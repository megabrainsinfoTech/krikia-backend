enum CookieExpiryTime {
  END_OF_SESSION = 0,
  SECOND = 1000,
  MINUTE = 1000 * 60,
  HOUR = 1000 * 60 * 60,
  DAY = 1000 * 60 * 60 * 24,
  YEAR = 1000 * 60 * 60 * 24 * 365,
  NEVER = 1000 * 60 * 60 * 24 * 365 * 20,
}
export { CookieExpiryTime };
