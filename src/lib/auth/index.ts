import { verifyIdToken } from "@/lib/firebase";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

const credentialSchema = z.object({
  idToken: z.string(),
});

export const UNAUTHORIZED_ONLY_PATH = ["/auth/login"];
export const HOME_PATH = "/rooms";
export const PUBLIC_PATH = ["/public"];

export const { auth, handlers } = NextAuth({
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
  },
  providers: [
    CredentialsProvider({
      credentials: { idToken: {} },
      authorize: async (credentials) => {
        const { idToken } = credentialSchema.parse(credentials);
        try {
          const decoded = await verifyIdToken(idToken);
          return { ...decoded, id: decoded.uid };
        } catch (err) {
          console.error(err);
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token }) {
      return {
        ...token,
      };
    },
    async authorized({ auth }) {
      console.log("auth", auth);
      return !!auth;
    },
    // sessionにJWTトークンからのユーザ情報を格納
    async session({ session, token }) {
      session.user.uid = token.uid;
      return session;
    },
  },
});
