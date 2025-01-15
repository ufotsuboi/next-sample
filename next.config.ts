import type { NextConfig } from "next";
import "./src/env";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  // NextAuthを使っているとでるエラーを回避するための設定
  // https://github.com/nextauthjs/next-auth/discussions/9385
  transpilePackages: ["next-auth"],
};

export default nextConfig;
