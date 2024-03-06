import { JwtPayload, SignOptions, sign, verify } from "jsonwebtoken";
import { decodeBase64Url, encodeBase64Url } from ".";
import redisClient from "./redisClient";

import errors from "http-errors"
import { HttpException, HttpStatus } from "@nestjs/common";

export const signAccessToken = (userId: string, secretKey: string)=> {
    return new Promise<string|undefined>((resolve, reject)=> {
        const payload: JwtPayload = {
            aud: userId
        };
        const options: SignOptions = {
            issuer: "krikia.com",
            expiresIn: "1h"
        };

    return sign(payload, secretKey, options, (err, token) => {
            if(err) return reject(err);
            resolve(encodeBase64Url(encodeBase64Url(token as string)));
        });
    })
}

export const signRefreshToken = (userId: string)=> {

    return new Promise<string|undefined>((resolve, reject)=> {
        const payload: JwtPayload = {
            aud: userId
        };
        const options: SignOptions = {
            issuer: "krikia.com",
            expiresIn: "1y"
        };

        return sign(payload, process.env.SERVICE_JWT_REFRESH_TOKEN_SECRET as string, options, (err, token) => {
            if(err) return reject(err);
            const hiddenToken = encodeBase64Url(encodeBase64Url(token as string))
            redisClient.then(redis => {

                const [key, exp, value] = [userId as any, 60*60*24*7*52, hiddenToken as any]

                redis.SETEX(key, exp, value).then((status: any)=> {
                   resolve(hiddenToken);
                }).catch((err: any) => {
                    return reject(errors.InternalServerError())
                })

            })
            
        });
    })
}

export const verifyRefreshToken = (userId: string)=> {
    return new Promise((resolve, reject)=> {
        // Check if refresh token exist in redis datastore
        if(!userId) return reject(new HttpException("Access denied", HttpStatus.UNAUTHORIZED))
        redisClient.then(redis => {
            redis.GET(userId as any).then((value: any) => {
                if(!!value) {
                    verify(decodeBase64Url(decodeBase64Url(value)), process.env.SERVICE_JWT_REFRESH_TOKEN_SECRET as string, (err, payload)=> {
                        if(err) {
                            return reject(err)
                        }
                        // const userId = (payload as JwtPayload).aud;
                        return resolve(value); //If token passes verification, sent it back to be used as secret_key for accessToken
                    })
                } else {
                    reject(new HttpException("Access denied", HttpStatus.UNAUTHORIZED));
                }
               
            })
        })
    })
}

export const verifyRefreshTokenGlobal = (userId: string)=> {
    return new Promise((resolve, reject)=> {
        // Check if refresh token exist in redis datastore
        if(!userId) return reject(new HttpException("Access denied", HttpStatus.UNAUTHORIZED))
        redisClient.then(redis => {
            redis.GET(userId as any).then((value: any) => {
                if(!!value) {
                    verify(decodeBase64Url(decodeBase64Url(value)), process.env.SERVICE_JWT_REFRESH_TOKEN_SECRET as string, (err, payload)=> {
                        if(err) {
                            resolve(null);
                        }
                        // const userId = (payload as JwtPayload).aud;
                        return resolve(value); //If token passes verification, sent it back to be used as secret_key for accessToken
                    })
                } else {
                    resolve(null);
                }
               
            })
        })
    })
}

export const verifyAccessTokenGlobal = (token: string, secretKey: string)=> {
    return new Promise((resolve, reject)=> {
        verify(decodeBase64Url(decodeBase64Url(token)), secretKey, (err, payload)=> {
            if(err) {
                return resolve(null)
            }
            const userId = (payload as JwtPayload).aud;
            return resolve(userId);
        })
    })
}


export const verifyAccessToken = (token: string, secretKey: string)=> {
    return new Promise((resolve, reject)=> {
        verify(decodeBase64Url(decodeBase64Url(token)), secretKey, (err, payload)=> {
            if(err) {
                return reject(new HttpException("Access denied", HttpStatus.UNAUTHORIZED))
            }
            const userId = (payload as JwtPayload).aud;
            return resolve(userId);
        })
    })
}