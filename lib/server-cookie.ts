"use server";

import { cookies } from "next/headers";
import { extractCookie } from "./extract-cookie";

export interface CookieValues {
  name: string;
  value: string;
}

export const getServerCookies = async (): Promise<CookieValues[]> => {
  const cookieStore = await cookies();
  const cookieData = cookieStore.getAll();
  const cookieValues = cookieData.map((cookie) => ({
    name: cookie.name,
    value: cookie.value,
  }));

  return cookieValues;
};

export const setServerCookie = async (setCookie: string[]) => {
  const resCookies = extractCookie(setCookie);
  const cookieServer = await cookies();

  resCookies.forEach((cookie) => {
    cookieServer.set(cookie.name, cookie.value, {
      httpOnly: cookie.config.httpOnly,
      expires: cookie.config.expires,
      secure: cookie.config.secure,
      sameSite: cookie.config.sameSite || "lax",
      path: cookie.config.path || "/",
      maxAge: cookie.config.maxAge,
    });
  });
};
