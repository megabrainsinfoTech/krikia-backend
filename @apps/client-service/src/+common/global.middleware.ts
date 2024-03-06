import { Injectable, NestMiddleware } from '@nestjs/common';
import { decodeBase64Url } from 'src/+utils';
import { verifyAccessTokenGlobal, verifyRefreshToken, verifyRefreshTokenGlobal } from 'src/+utils/jwt_token';


@Injectable()
export class GlobalMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    if(!req.headers['authorization'] && !req.cookies?.["__ASSEMBLYsxvscz090619_"]) {
      return next();
    }
    
      const serverToken = req.headers?.authorization;
      const clientToken = `Bearer ${req.cookies?.["__ASSEMBLYsxvscz090619_"]}:${req.cookies?.["__uAud"]}`;

      const authHeader = serverToken || clientToken;
      
      const [_, rest] = authHeader.split(" ")

      const [bearerToken, uAud] = rest.split(":");
      const [uId, uEmail] = decodeBase64Url(uAud).split(",");

      // Get secret key from refresh token
      const secretKey = await verifyRefreshTokenGlobal(uId);
      //Verify accessToken
      const userId = await verifyAccessTokenGlobal(bearerToken, secretKey as string);

      req.user = { id: userId, email: uEmail };
      // req.user = {id: "Local Module"};
      return next();

    
  }
}
