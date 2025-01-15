import { auth, PUBLIC_PATH, UNAUTHORIZED_ONLY_PATH } from "@/lib/auth";
import { NextResponse } from "next/server";

export const middleware = auth(async (req) => {
  console.log("middleware: nextUrl.href", req.nextUrl.href);
  console.log(
    "middleware: x-forwarded-host",
    req.headers.get("x-forwarded-host"),
  );
  console.log(
    "middleware: x-forwarded-proto",
    req.headers.get("x-forwarded-proto"),
  );
  console.log(
    "middleware: x-forwarded-port",
    req.headers.get("x-forwarded-port"),
  );

  const { pathname, searchParams } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  if (PUBLIC_PATH.includes(pathname)) {
    return NextResponse.next();
  }

  if (UNAUTHORIZED_ONLY_PATH.includes(pathname)) {
    if (isAuthenticated) {
      const callbackUrl =
        searchParams.get("callbackUrl") || new URL("/rooms", req.url);
      return NextResponse.redirect(callbackUrl);
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const signInUrl = req.nextUrl.clone();
    signInUrl.pathname = "/auth/login";
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.href);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
