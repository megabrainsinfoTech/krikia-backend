// One Time Token (OTT)
import redisClient from './redisClient';
import { WelcomeNotification } from './email';
import AppError from './errorHandle';
import { HttpStatus } from '@nestjs/common';

export const storeOTT = async (key: any, value: any, exp: number) => {
  const emailUrl = `${process.env.CUSTOMER_FRONTEND_URL}/verify-email/${key}`;

  // if (process.env.NODE_ENV === 'production') {
  const emailer = await WelcomeNotification.sendWelcomeToKrikiaCustomer({
    params: {
      subject:
        'Welcome to Krikia, Verify Your Email: Take the Next Step in Securing Your Account',
      verifyUrl: emailUrl,
    },
    to: { email: value, name: 'Customer' },
  });

  if (emailer) {
    throw new AppError(
      `Network error. Check your network connection and try again.`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  // saving into redis store, after sending email if in production
  (await redisClient).SETEX(key, exp, value);
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
