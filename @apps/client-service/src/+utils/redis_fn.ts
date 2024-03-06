// One Time Token (OTT)
import redisClient from './redisClient';
import Email from './email';
import AppError from './errorHandle';
import { HttpStatus } from '@nestjs/common';

export const storeOTT = async (key: any, value: any, exp: number) => {
  (await redisClient).SETEX(key, exp, value);

  // After saving into redis store, send to email if in production
  const emailUrl = `${process.env.CUSTOMER_FRONTEND_URL}/auth/verify-email/${key}`;

  console.log(emailUrl);
  if (process.env.NODE_ENV === 'production') {
    const emailUrl = `${process.env.CUSTOMER_FRONTEND_URL}/auth/verify-email/${key}`;

    const emailer = new Email(
      { email: value },
      `${process.env.EMAIL_USERNAME}`,
      emailUrl,
      {},
    );

    await emailer.sendVerifyEmail();

    if (!emailer) {
      throw new AppError(
        `Network error. Check your network connection and try again.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
};

export const verifyOTT = async (key: any) => {
  return (await redisClient).GET(key);
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
