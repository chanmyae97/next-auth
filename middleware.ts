import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  console.log("Middleware Check:", {
    path: nextUrl.pathname,
    isLoggedIn,
    isApiAuthRoute,
    isPublicRoute,
    isAuthRoute,
    auth: req.auth,
    cookies: req.cookies.getAll()
  });

  if (isApiAuthRoute) {
    console.log("API Auth route - allowing");
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      console.log("Auth route - user logged in, redirecting to", DEFAULT_LOGIN_REDIRECT);
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    console.log("Auth route - allowing unauthenticated access");
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    console.log("Protected route - redirecting to login");
    const redirectUrl = new URL("/auth/login", nextUrl);
    redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return Response.redirect(redirectUrl);
  }

  console.log("Route allowed");
  return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
