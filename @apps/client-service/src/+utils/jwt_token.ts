import { JwtPayload, SignOptions, sign, verify } from 'jsonwebtoken';
import { decodeBase64Url, encodeBase64Url } from '.';
import redisClient from './redisClient';

import { HttpException, HttpStatus } from '@nestjs/common';
import AppError from './errorHandle';

function generateToken(
  payload: JwtPayload,
  secretPass: string,
  expiresIn: string = '5m',
) {
  const payloads: JwtPayload = {
    aud: 'api.krikia.com',
  };
  const options: SignOptions = {
    issuer: 'krikia.com',
    expiresIn,
  };

  return new Promise((resolve, reject) => {
    sign({ ...payload, ...payloads }, secretPass, options, (err, token) => {
      if (err) return reject(err);
      resolve(token as string);
    });
  });
}

function verifyToken(token: string, jwtSecretKey: string) {
  return new Promise<JwtPayload>((resolve, reject) => {
    verify(token, jwtSecretKey, (err, decodedToken: JwtPayload) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return resolve({
            payload: null,
            expired: false,
            iat: 0,
            exp: 0,
            aud: '',
            sub: '',
          });
        }
        if (!decodedToken.iss?.endsWith('krikia.com')) {
          return reject(
            new AppError('Unrecognised Token', HttpStatus.FORBIDDEN),
          );
        }
        reject(err);
      } else {
        resolve(decodedToken as JwtPayload);
      }
    });
  });
}

export const signAccessToken = async (userId: string) => {
  return await generateToken(
    { sub: userId },
    process.env.SERVICE_JWT_ACCESS_TOKEN_SECRET as string,
    '1m',
  );
};

export const signRefreshToken = async (userId: string) => {
  return await generateToken(
    { sub: userId },
    process.env.SERVICE_JWT_REFRESH_TOKEN_SECRET as string,
    '1y',
  );
};

export const verifyAccessToken = async (token: string): Promise<JwtPayload> => {
  return await verifyToken(
    token,
    process.env.SERVICE_JWT_ACCESS_TOKEN_SECRET as string,
  );
};
export const verifyRefreshToken = async (
  token: string,
): Promise<JwtPayload> => {
  return await verifyToken(
    token,
    process.env.SERVICE_JWT_REFRESH_TOKEN_SECRET as string,
  );
};

export const verifyRefreshTokenGlobal = (userId: string) => {
  return new Promise((resolve, reject) => {
    // Check if refresh token exist in redis datastore
    if (!userId)
      return reject(
        new HttpException('Access denied', HttpStatus.UNAUTHORIZED),
      );
    redisClient.then((redis) => {
      redis.GET(userId as any).then((value: any) => {
        if (!!value) {
          verify(
            decodeBase64Url(value),
            process.env.SERVICE_JWT_REFRESH_TOKEN_SECRET as string,
            (err, payload) => {
              if (err) {
                resolve(null);
              }
              // const userId = (payload as JwtPayload).aud;
              return resolve(value); //If token passes verification, sent it back to be used as secret_key for accessToken
            },
          );
        } else {
          resolve(null);
        }
      });
    });
  });
};

export const verifyAccessTokenGlobal = (token: string, secretKey: string) => {
  return new Promise((resolve, reject) => {
    verify(decodeBase64Url(token), secretKey, (err, payload) => {
      if (err) {
        return resolve(null);
      }
      const userId = (payload as JwtPayload).aud;
      return resolve(userId);
    });
  });
};
