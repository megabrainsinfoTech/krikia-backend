// One Time Token (OTT)
import redisClient from './redisClient';
import { WelcomeNotification } from './email';
import AppError from './errorHandle';
import { HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export const getRedisData = async (key: any) => (await redisClient).GET(key);
export const setRedisData = async (
  key: string,
  value: string,
  expiresIn: number,
) => (await redisClient).SETEX(key, expiresIn, value);

export const storeOTT = async (key: string, value: string, exp: number) => {
  const emailUrl = `${process.env.CUSTOMER_FRONTEND_URL}/verify-email/${key}`;
  // HashToken
  const hashToken = await bcrypt.hash(`${value}`, 12);
  if (!hashToken) {
    throw new AppError(
      `Sorry!!! Something went wrong.`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  // if (process.env.NODE_ENV === 'production') {
  const emailer = await WelcomeNotification.sendWelcomeToKrikiaCustomer({
    params: {
      subject:
        'Welcome to Krikia, Verify Your Email: Take the Next Step in Securing Your Account',
      verifyUrl: value,
    },
    to: { email: key, name: 'Customer' },
  });

  if (emailer) {
    throw new AppError(
      `Network error. Check your network connection and try again.`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  // saving into redis store, after sending email if in production
  await setRedisData(key, hashToken, exp);
};

export const verifyOTT = async (key: any, token: any) => {
  const hashedOTP = await getRedisData(key);
  const k = await getRedisData(hashedOTP);
  return await bcrypt.compare(`${token}`, `${k}`);
};
export const removeOTT = async (key: any) => {
  (await redisClient).DEL(key);
};

export const verifyCreateListingProgressToken = async (key: string) => {
  const storage = await (await redisClient).GET(key);
  if (storage) {
    const [listingId, pageIdx] = storage.split(':'); //First index is the listingId
    return { listingId, pageIdx };
  }

  return { listingId: null, pageIdx: null };
};

export const updateCreateListingProgressStep = async (
  key: string,
  value: string,
) => {
  const exp = 1000000;
  (await redisClient).SETEX(key, exp, value);
};
