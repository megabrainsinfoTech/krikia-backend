import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDTO, VerifyEmailToken } from './auth.dto';
import { Response, Request } from 'express';
import {
  CreateNewUserPassword,
  CreateUserDTO,
  createEmailDTO,
} from '../user/user.dto';
import { CreateBusinessDTO } from '../business/business.dto';
import { removeOTT } from 'src/+utils/redis_fn';
import cookiesObjectsKeys from 'src/+utils/helper/cookiesObjectsKeys';

@Controller('auth')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
  }),
)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupBody: createEmailDTO) {
    return await this.authService.signup(signupBody);
  }

  @Post('verify-email')
  async verifyEmail(@Body() token: VerifyEmailToken) {
    const data = await this.authService.verifyEmail(token);
    return data;
  }

  @Post('login')
  async login(
    @Body() loginBody: LoginAuthDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userAgent = req.headers['user-agent'] as string;

    const auth = await this.authService.login(loginBody, userAgent);

    // Set AccessToken
    res.cookie(cookiesObjectsKeys.accessTokenName, auth.accessToken, {
      maxAge: cookiesObjectsKeys.a_maxAge,
      domain: cookiesObjectsKeys.domain,
      httpOnly: true,
      secure: cookiesObjectsKeys.secure,
    });

    // Set RefreshToken
    res.cookie(cookiesObjectsKeys.refreshTokenName, auth.refreshToken, {
      maxAge: cookiesObjectsKeys.r_maxAge,
      domain: cookiesObjectsKeys.domain,
      httpOnly: true,
      secure: cookiesObjectsKeys.secure,
    });

    return res.json({
      message: 'You are logged in successfully',
    });
  }

  // Logout Route
  // @Get()

  @Post('create-password')
  async createPassWordAndLogin(
    @Body() CPAL: CreateNewUserPassword,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.createPasswordNewUser(CPAL);
    // Set accessToken
    res.cookie(cookiesObjectsKeys.accessTokenName, user.accessToken, {
      maxAge: cookiesObjectsKeys.a_maxAge,
      httpOnly: true,
    });
    await removeOTT(CPAL.token);
    return { message: user.message };
  }

  @Post('login-or-signup')
  async loginOrSignup(
    @Body() loginBody: LoginAuthDTO,
    @Res() res: Response,
    @Req() req: any,
  ) {
    // Check if email already exist in database
    const isUser = await this.authService.getIsUser(loginBody.email);

    // if (!isUser) {
    //   await this.authService.signup({
    //     ...loginBody,
    //     confirmPassword: loginBody.password,
    //   });
    // }
    const userAgent = req.headers['user-agent'];

    const auth = await this.authService.login(loginBody, userAgent as string);
    // Set data on client

    // Complete business creation with updates
    const business = await this.authService.createBusinessComplete(
      req.cookies['__bizId'],
      auth.userId,
    );

    // Remove __bizId from cookie storage
    res.cookie('__bizId', null, { maxAge: -1 });
    // Send business detail to the client cookie. Will be removed
    res.cookie('business', JSON.stringify(business), {
      maxAge: 60 * 60 * 1000 * 24 * 7 * 52,
    }); //1 yr

    return res.sendStatus(200);
  }

  @Post('create-business')
  async createBusiness(
    @Body() createBusinessBody: CreateBusinessDTO,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const response = await this.authService.createBusiness(
      createBusinessBody,
      req.user?.id,
    );

    // Send businessId back to user
    res.cookie('__bizId', response.businessId, {
      maxAge: 60 * 60 * 1000 * 24 * 7 * 52,
    }); //1 yr

    if (!response.pending) {
      res.cookie('business', JSON.stringify(response.business), {
        maxAge: 60 * 60 * 1000 * 24 * 7 * 52,
      }); //1 yr
    }

    // Send status. true if business is yet to have a UserBusiness relationship
    return res.json({ pending: response.pending });
  }
}
