const sha512 = require("js-sha512").sha512;

const DEFAULT_MERCHANT_CLIENT_SECRET = process.env.MONNIFY_SECRET_KEY;

/**
 *
 * @param {object} requestBody - Accept an object of the request body from monnify and compare it to the hashValue
 * @returns
 */
module.exports = (requestBody) =>
  sha512.hmac(DEFAULT_MERCHANT_CLIENT_SECRET, requestBody);
