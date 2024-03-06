const axios = require("axios");

const clientIDSecretInBase64 = Buffer.from(
  process.env.MONNIFY_API_KEY + ":" + process.env.MONNIFY_SECRET_KEY
).toString("base64");

const headers = {
  Authorization: "Basic " + clientIDSecretInBase64,
};
/**
 * This Axios Function Handle a Authorizated Operations on the monnify API
 * And it is added to the Authorization header stating with Bearer
 */
module.exports = axios.create({
  baseURL: process.env.MONNIFY_BASE_URL,
  timeout: 8000,
  headers,
});
