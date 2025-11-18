import axios from "axios";
import {
  CookieValues,
  getServerCookies,
  setServerCookie,
} from "./server-cookie";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async function (config) {
    const setCookie: CookieValues[] = await getServerCookies();
    if (setCookie.length > 0) {
      config.headers = config.headers || {};
      config.headers["Cookie"] = setCookie
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");
    }

    return config;
  },
  function (error) {
    return Promise.reject(error?.response?.data || error);
  }
);

api.interceptors.response.use(
  async function (response) {
    const setCookie = response.headers["set-cookie"];

    if (setCookie) {
      await setServerCookie([...setCookie]);
    }

    return response;
  },
  async function (error) {
    return Promise.reject(error?.response?.data || error);
  }
);
