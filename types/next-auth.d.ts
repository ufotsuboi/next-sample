/* eslint-disable @typescript-eslint/no-unused-vars */
import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      // Firebaseの認証情報
      uid: string;
      emailVerified?: boolean;
    } & DefaultSession["user"];
  }
  interface User {
    // Firebaseの認証情報
    uid: string;
    emailVerified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    // Firebaseの認証情報
    uid: string;
    emailVerified: boolean;
  }
}
