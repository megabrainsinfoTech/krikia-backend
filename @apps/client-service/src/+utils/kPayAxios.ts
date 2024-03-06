import axios from "axios";
import { encodeBase64Url } from ".";

export default (userSecret: string)=> {
  const clientIDSecret = encodeBase64Url(userSecret);

  const headers = {
    Authorization: "Monarch " + clientIDSecret,
  };

  return axios.create({
    baseURL: process.env.PAYMENT_SERVICE_URL,
    timeout: 8000, 
    headers,
  });
}