import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginAuthDTO } from './auth.dto';
import { signAccessToken, signRefreshToken } from '../+utils/jwt_token';
import { encodeBase64Url } from '../+utils';
import { UserService } from '../user/user.service';
import { removeOTT, storeOTT, verifyOTT } from '../+utils/redis_fn';
import { ILoginPayload } from './auth.interface';
import { v4 } from 'uuid';

import { CreateUserDTO } from '../user/user.dto';
import { CreateBusinessDTO } from '../business/business.dto';
import { BusinessService } from '../business/business.service';
import { UserBusinessService } from '../user-business/user-business.service';
import apiConnect from 'src/+utils/api-connect';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly businessService: BusinessService,
    private readonly userBusinessService: UserBusinessService,
  ) {}

  async signup(signupBody: CreateUserDTO) {
    const doesExist = await this.userService.findByEmail(signupBody.email);
    if (!!doesExist) {
      throw new HttpException(
        `Sorry. ${signupBody.email} has already been registered`,
        HttpStatus.CONFLICT,
      );
    }

    // Create user
    await this.userService.create(signupBody);

    // Create and send email confirmation token to redis datastore

    const token = v4();

    await storeOTT(token, signupBody.email, 60 * 60 * 24 * 2); //Store One Time Token for two days. ms returns milliseconds so divide by 1000 to get seconds

    return {
      message: `Account created successfully. Verify your email and login`,
    };
  }

  async verifyEmail(token: string) {
    try {
      const email = await verifyOTT(token);

      if (!!email) {
        const user = await this.userService.findByEmail(email);

        if (!!user) {
          await removeOTT(token);

          // Update user status in DB to active
          user.set({
            status: 'Active',
            avatarUrl: `${process.env.CDN_URL}/krikia-assets/default_avatar.png`,
          });
          user.save();

          return email;
        } else {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
      } else {
        throw new HttpException(
          'Invalid or expired token',
          HttpStatus.FORBIDDEN,
        );
      }
    } catch (err: any) {
      throw new HttpException(err.message, err.statusCode);
    }
  }

  async login(loginBody: LoginAuthDTO): Promise<ILoginPayload> {
    const user = await this.userService.findByEmail(loginBody.email);

    if (!user) {
      throw new HttpException(
        'Sorry, this account does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.status === 'Pending') {
      throw new HttpException(
        'Go to your email to verify new user account',
        HttpStatus.FORBIDDEN,
      );
    }

    // Password
    const isMatch = await user.cmpPassword(loginBody.password);
    if (!isMatch) {
      throw new HttpException(
        'Incorrect login credentials',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Sign refresh token
    const secretKey = await signRefreshToken(user.id);
    // Sign access token
    const accessToken = await signAccessToken(user.id, secretKey as string);

    return {
      __uAud: encodeBase64Url(`${user.id},${user.email}`),
      userId: user.id,
      __ASSEMBLYsxvscz090619_: accessToken as string,
    };
  }

  async createBusiness(createBusinessBody: CreateBusinessDTO, userId: string) {
    const business = await this.businessService.create(createBusinessBody);
    if (!!userId) {
      try {
        await this.userBusinessService.create({
          businessId: business.id,
          userId,
          role: 'Creator',
        });

        // Create wallet for business
        const wallet = (
          await apiConnect(process.env.PAYMENT_SERVICE_URL as string).post(
            'wallet/create',
            { holderEmail: business.email, type: 'Business' },
          )
        ).data;
        return wallet;
      } catch (err) {
        if (err.code === 'ECONNREFUSED')
          throw new HttpException(
            "Can't create wallet now. Try again later",
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        else
          throw new HttpException(
            err.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }

    return {
      pending: !userId,
      businessId: business.id,
      business: { businessName: business.name, businessAlias: business._alias },
    };
  }

  async createBusinessComplete(businessId: string, userId: string) {
    try {
      await this.businessService.updateById(businessId, { status: 'Active' });
      await this.userBusinessService.create({
        businessId,
        userId,
        role: 'Creator',
      });

      //    Get business
      const business = await this.businessService.findByBusinessId(businessId);

      // Create wallet for business
      const wallet = (
        await apiConnect(process.env.PAYMENT_SERVICE_URL as string).post(
          'wallet/create',
          { holderEmail: business?.email, type: 'Business' },
        )
      ).data;

      return { businessName: business?.name, businessAlias: business?._alias };
    } catch (err) {
      throw err;
    }
  }

  async getIsUser(email: string) {
    const user = await this.userService.findByEmail(email);
    return !!user;
  }
}
