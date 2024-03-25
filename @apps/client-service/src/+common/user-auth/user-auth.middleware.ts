import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { decodeBase64Url } from '../../+utils';
import { verifyAccessToken, verifyRefreshToken } from '../../+utils/jwt_token';
import AppError from 'src/+utils/errorHandle';
import { Request, Response } from 'express';

@Injectable()
export class UserAuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: () => void) {
    if (!req.user) {
      throw new AppError(
        'You are not logged in, Please login to continue',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Prompt User to Complete their Profile, Skip Check when they about to update it
    if (
      req.user.status === 'Incomplete' &&
      req.originalUrl.endsWith('/user/profile/complete') === false
    ) {
      throw new AppError(
        'Complete your profile to continue using krikia',
        HttpStatus.FORBIDDEN,
        {
          email: req.user.email,
        },
      );
    }
    return next();
  }
}
