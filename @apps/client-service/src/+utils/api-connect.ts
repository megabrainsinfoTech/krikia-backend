import axios, { AxiosInstance } from "axios";

  export default function(url: string, headers?: any): AxiosInstance {
   return axios.create({
        baseURL: url,
        timeout: 8000,
        headers,
      });
  }