const axios = require("axios");
const clientIDSecretInBase64 = Buffer.from(
  process.env.MONNIFY_API_KEY + ":" + process.env.MONNIFY_SECRET_KEY
).toString("base64");


const headers = {
  "Content-Type": "application/json",
  Authorization: "Basic " + clientIDSecretInBase64,
};

/**
 * This Axios Instance authenticate the API KEY and generated the Access Token for making authorised request,
 * @note - it Authorization Header Value Starts with Basic
 */
module.exports = axios.create({
  baseURL: process.env.MONNIFY_BASE_URL,
  timeout: process.env.NODE_ENV === "development" ? 30000 : 10000,
  headers,
});
