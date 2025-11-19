import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "./features/auth/actions/current-user.action";

const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];
const protectedRoutes = ["/dashboard", "/profile"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const currentUser = await getCurrentUser();
  const isAuthenticated = currentUser.success === true && currentUser.data;

  if (isAuthenticated && authRoutes.includes(pathname)) {
    const redirect = request.nextUrl.searchParams.get("redirect");
    if (redirect) {
      return NextResponse.redirect(new URL(redirect, request.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (!isAuthenticated && protectedRoutes.includes(pathname)) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
