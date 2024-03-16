import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { decodeBase64Url } from '../../+utils';
import { verifyAccessToken, verifyRefreshToken } from '../../+utils/jwt_token';
import AppError from 'src/+utils/errorHandle';

@Injectable()
export class UserAuthMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    if (!req.user) {
      throw new AppError(
        'You are not logged in, Please login to continue',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return next();
  }
}
