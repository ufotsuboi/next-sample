import { getToken } from "next-auth/jwt";
import { NextMiddleware, NextResponse } from "next/server";

export const UNAUTHORIZED_ONLY_PATHS = ["/auth/login"];
export const HOME_PATH = "/rooms";
export const PUBLIC_PATHS = ["/public"];

const pathMatch = (path: string, patterns: (string | RegExp)[]) =>
  patterns.some((pattern) =>
    typeof pattern === "string" ? pattern === path : pattern.test(path),
  );

export const middleware: NextMiddleware = async (req) => {
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

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });
  const isAuthenticated = !!token;

  // PUBLICな場合は認証状態に限らず表示する
  if (pathMatch(pathname, PUBLIC_PATHS)) {
    return NextResponse.next();
  }

  // ログインページなどログイン状態でアクセスできないページの場合はリダイレクト
  if (pathMatch(pathname, UNAUTHORIZED_ONLY_PATHS)) {
    if (isAuthenticated) {
      const callbackUrl =
        searchParams.get("callbackUrl") || new URL("/chat", req.nextUrl.href);
      return NextResponse.redirect(callbackUrl);
    }
    return NextResponse.next();
  }

  // デフォルトは認証が必要なので、ログインしていなければ、ログインページにリダイレクト
  if (!isAuthenticated) {
    const signInUrl = req.nextUrl.clone();
    signInUrl.pathname = "/auth/login";
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.href);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
};

/**
 * プリフェッチのヘッダーがついていなくて、次のパスにマッチしない場合にmiddlewareが動作するように設定
 *
 * - api: APIはすべて、API側で認証を行っているため除外
 * - _next: Next.jsが生成するファイルは除外
 * - static: public配下に配置する静的ファイル。まとめて除外するため、ブラウザの仕様に従う必要があるもの以外はpublic/staticに配置する
 * - ブラウザの仕様として直下に置く必要のあるファイルは個別に除外
 *     - favicon.ico
 *     - manifest.json
 *     - robots.txt
 * - next-pwaが生成するファイル
 *     - sw.js
 *     - sw.js.map
 *     - workbox-*.js
 *     - workbox-*.js.map
 */
export const config = {
  matcher: [
    {
      source: "/((?!api|_next|static|favicon.ico|robots.txt|manifest.json).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
