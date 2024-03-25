import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginAuthDTO, VerifyEmailToken } from './auth.dto';
import { signAccessToken, signRefreshToken } from '../+utils/jwt_token';
import { encodeBase64Url, generateRandom6Digits } from '../+utils';
import { UserService } from '../user/user.service';
import {
  getRedisData,
  removeOTT,
  setRedisData,
  storeOTT,
  verifyOTT,
} from '../+utils/redis_fn';
import { ILoginPayload } from './auth.interface';
import {
  CreateNewUserPassword,
  CreateUserDTO,
  createEmailDTO,
} from '../user/user.dto';
import { CreateBusinessDTO } from '../business/business.dto';
import { BusinessService } from '../business/business.service';
import { UserBusinessService } from '../user-business/user-business.service';
import apiConnect from 'src/+utils/api-connect';
import AppError from 'src/+utils/errorHandle';
import { GenerateCryptoHash } from 'src/+utils/helper/hashGen';
import { InjectModel } from '@nestjs/sequelize';
import { RefreshToken } from './auth.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly businessService: BusinessService,
    private readonly userBusinessService: UserBusinessService,
    @InjectModel(RefreshToken)
    private readonly refreshToken: typeof RefreshToken,
  ) {}

  async signup(signupBody: createEmailDTO) {
    const doesExist = await this.userService.findByEmail(signupBody.email);
    if (!!doesExist) {
      throw new AppError(
        `Sorry. ${signupBody.email} has already been registered`,
        HttpStatus.CONFLICT,
      );
    }

    // Create and send email confirmation token to redis datastore

    const token = generateRandom6Digits() as unknown as string;

    const temporaryToken = GenerateCryptoHash();

    await storeOTT(signupBody.email, token, 60 * 60 * 24 * 3 * 1000); //Store One Time Token for 3 days. ms returns milliseconds so divide by 1000 to get seconds
    await setRedisData(
      temporaryToken,
      signupBody.email,
      60 * 60 * 24 * 3 * 1000,
    ); // Temp Holder for the email
    return {
      message: `Account created successfully. Verify your email and login`,
      temporaryToken,
    };
  }

  async verifyEmail(token: VerifyEmailToken) {
    const isValidToken = await verifyOTT(token.user_token_id, token.token);
    if (!isValidToken) {
      throw new AppError('Invalid Confirmation Code', HttpStatus.UNAUTHORIZED);
    }

    // get user email from Redis DB
    const email = await getRedisData(token.user_token_id);

    // Email return null if not present in the database
    const user = await this.userService.findByEmail(email);
    if (user) {
      throw new AppError(
        'Sorry we cannot proceed with the email Verification',
        HttpStatus.CONFLICT,
      );
    }

    const createPassHash = GenerateCryptoHash();

    if (!createPassHash) {
      throw new AppError(
        'Something went wrong!!. Its not your facult',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // Remove the Email from Redis
    await removeOTT(token.user_token_id);

    // Token to recognize email
    await setRedisData(createPassHash, email, 60 * 60 * 1);
    return {
      message: 'Email verified successfully, Continue to create Password',
      token: createPassHash,
    };
  }
  private async loginTokenAction(userId: string, userAgent: string) {
    // Sign refresh token
    const refreshToken = await signRefreshToken(userId);
    // Sign access token
    const accessToken = await signAccessToken(userId);

    if (!refreshToken || !accessToken) {
      throw new AppError(
        'Sorry, Something went wrong. its not your fault',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // This Line Stores the  Refresh Token to the Database
    const hashrefreshToken = GenerateCryptoHash(`${refreshToken}`);
    const newrefreshToken = await this.refreshToken.create({
      token: hashrefreshToken as string,
      userId,
      userAgent,
    });

    if (!newrefreshToken) {
      throw new AppError(
        "You can't login at moment. Please contact the krikia team if the issues persist",
        HttpStatus.FAILED_DEPENDENCY,
      );
    }

    return { refreshToken, accessToken };
  }
  async createPasswordNewUser(CPNU: CreateNewUserPassword) {
    const userEmail = await getRedisData(CPNU.token);
    if (!userEmail) {
      throw new AppError(
        'Sorry, we cannot proceed with this request, try signing up again',
        HttpStatus.FAILED_DEPENDENCY,
      );
    }

    // Email return null if not present in the database
    const user = await this.userService.findByEmail(userEmail);
    if (user) {
      throw new AppError(
        'Email Address is verified already',
        HttpStatus.CONFLICT,
      );
    }

    const createUser = await this.userService.create({
      ...CPNU,
      email: userEmail,
    });
    if (!createUser) {
      throw new AppError(
        'Unable to create account',
        HttpStatus.FAILED_DEPENDENCY,
      );
    }

    // Sign refresh token
    const refreshToken = await signRefreshToken(createUser.id);
    // Sign access token
    const accessToken = await signAccessToken(createUser.id);

    // this.refreshToken.create({});

    return {
      userId: createUser.id,
      accessToken,
      message: 'Password created Successfully. Continue to complete profile',
    };
  }
  async login(loginBody: LoginAuthDTO, userAgent: string) {
    const user = await this.userService.findByEmail(loginBody.email);

    if (!user) {
      throw new AppError(
        'Sorry, this account does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.status === 'Pending') {
      throw new AppError(
        'Go to your email to verify new user account',
        HttpStatus.FORBIDDEN,
      );
    }

    // Password
    const isMatch = await user.cmpPassword(loginBody.password);
    if (!isMatch) {
      throw new AppError('Incorrect login credentials', HttpStatus.BAD_REQUEST);
    }

    // Sign refresh token
    const Tokens = await this.loginTokenAction(user.id, userAgent);

    return {
      userId: user.id,
      accessToken: Tokens.accessToken,
      refreshToken: Tokens.refreshToken,
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
          throw new AppError(
            "Can't create wallet now. Try again later",
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        else throw new AppError(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
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
