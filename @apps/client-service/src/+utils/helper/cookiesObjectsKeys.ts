import { CookieExpiryTime } from './cookieTimeObj';

export default {
  accessTokenName: '_krikia_oauth_secure',
  refreshTokenName: '_krikia_oauth_renewed',
  a_maxAge: CookieExpiryTime.MINUTE * 15, // 15 mins Then it expires
  r_maxAge: CookieExpiryTime.YEAR * 1, // 1 yr
  domain: process.env.NODE_ENV === 'production' ? '.krikia.com' : undefined,
  secure: process.env.NODE_ENV === 'production' ? true : false,
};
