import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as JwtUtils from 'src/+utils/jwt_token';
import AppError from 'src/+utils/errorHandle';
import cookiesObjectsKeys from 'src/+utils/helper/cookiesObjectsKeys';
import { User } from 'src/user/user.model';
import { GenerateCryptoHash } from 'src/+utils/helper/hashGen';
import { RefreshToken } from 'src/auth/auth.model';
import { CookieExpiryTime } from 'src/+utils/helper/cookieTimeObj';

@Injectable()
export class GlobalMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies[cookiesObjectsKeys.accessTokenName];
    const refreshToken =
      req.cookies[cookiesObjectsKeys.refreshTokenName] ||
      req.headers['X-REFRESH-TOKEN'];
    const serverToken = req.headers?.authorization;

    if (!serverToken && !accessToken && !refreshToken) {
      return next();
    }

    const clientToken = `Bearer ${accessToken}`;
    const authHeader = serverToken || clientToken;

    if (authHeader && !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        'Provide a valid authorisation header',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [_, token] = authHeader.split(' ');

    // If The token doesnot exists by chance
    if (!token) {
      //   console.log('No token');
      return next();
    }

    let tokenPayload;

    try {
      const td = await JwtUtils.verifyAccessToken(token);
      tokenPayload = { ...td, expired: false };
    } catch (error) {
      tokenPayload = {
        sub: null,
        expired: error.message.includes('jwt expired'),
      };
    }
    // For a valid access Token
    if (tokenPayload.sub && tokenPayload.expired === false) {
      const user = await User.findOne({
        where: {
          id: tokenPayload.sub,
        },
      });
      //   If User Not Found next
      if (!user) {
        return next();
      }

      req.user = {
        id: user?.id,
        email: user?.email,
        status: user?.status,
      };
      return next();
    }

    // For Invalid/Expired accessToken, we will check the Refresh Token

    if (!refreshToken) {
      return next();
    }

    // Verify RefreshToken
    let refreshTokenPayload;
    try {
      const t = await JwtUtils.verifyRefreshToken(refreshToken);
      refreshTokenPayload = { ...t, expired: false };
    } catch (error) {
      refreshTokenPayload = {
        sub: null,
        expired: error.message.includes('jwt expired'),
      };
    }

    const hashRefreshToken = GenerateCryptoHash(refreshToken);
    if (refreshTokenPayload.sub && refreshTokenPayload.expired === false) {
      // Hash Refresh Token then, query for the refresh Token in the Database
      const fetchToken = await RefreshToken.findOne({
        where: {
          token: hashRefreshToken,
          userId: refreshTokenPayload.sub,
        },
      });

      // If the refresh Token Doesn't Exist
      if (!fetchToken) {
        res.cookie(cookiesObjectsKeys.refreshTokenName, '', {
          maxAge: CookieExpiryTime.END_OF_SESSION,
          domain: cookiesObjectsKeys.domain,
          httpOnly: true,
          secure: cookiesObjectsKeys.secure,
        });
        return next();
      }
      const newAccessToken = await JwtUtils.signAccessToken(
        fetchToken?.userId as string,
      );
      const verifiedToken = await JwtUtils.verifyAccessToken(
        newAccessToken as string,
      );

      //   By Any chance if Verified Token is False
      if (!verifiedToken?.sub) {
        res.cookie(cookiesObjectsKeys.accessTokenName, '', {
          maxAge: CookieExpiryTime.END_OF_SESSION,
          domain: cookiesObjectsKeys.domain,
          httpOnly: true,
          secure: cookiesObjectsKeys.secure,
        });
        return next();
      }

      const user = await User.findOne({
        where: {
          id: verifiedToken.sub,
        },
      });
      //   If User Not Found next
      if (!user) {
        return next();
      }

      req.user = {
        id: user?.id,
        email: user?.email,
        status: user?.status,
      };

      // Set New AccessToken
      res.cookie(cookiesObjectsKeys.accessTokenName, newAccessToken, {
        maxAge: cookiesObjectsKeys.a_maxAge,
        domain: cookiesObjectsKeys.domain,
        httpOnly: true,
        secure: cookiesObjectsKeys.secure,
      });
      return next();
    }
    // if refreshedToken is expired
    // Remove it from cookies
    if (refreshTokenPayload.expired === true) {
      res.cookie(cookiesObjectsKeys.refreshTokenName, '', {
        maxAge: CookieExpiryTime.END_OF_SESSION,
        domain: cookiesObjectsKeys.domain,
        httpOnly: true,
        secure: cookiesObjectsKeys.secure,
      });
      //   If Expired Delete it
      await RefreshToken.destroy({
        where: {
          token: hashRefreshToken,
        },
      });
    }

    return next();
  }
}
