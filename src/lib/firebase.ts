import { env } from "@/env.mjs";
import type { DecodedIdToken } from "firebase-admin/auth";
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_API_KEY,
  authDomain: env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_MESSAGIN_SENDER_ID,
  appId: env.NEXT_PUBLIC_APP_ID,
  measurementId: env.NEXT_PUBLIC_MEASUREMENT_ID,
};
const app = getApps()?.length ? getApps()[0] : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);

const client = jwksClient({
  jwksUri:
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
});

export async function verifyIdToken(idToken: string): Promise<DecodedIdToken> {
  const decoded = jwt.decode(idToken, { complete: true });
  const kid = decoded?.header.kid;
  const signingKey = await client.getSigningKey(kid);
  const token = (await jwt.verify(idToken, signingKey.getPublicKey(), {
    algorithms: ["RS256"],
  })) as DecodedIdToken;

  // tokenの検証
  // https://firebase.google.com/docs/auth/admin/verify-id-tokens?hl=ja#verify_id_tokens_using_a_third-party_jwt_library
  const now = Date.now() / 1000;
  if (token.exp && now > token.exp) {
    throw new Error("Token is expired");
  }
  if (token.iat && now < token.iat) {
    throw new Error("Token is not valid yet");
  }
  if (token.aud !== env.NEXT_PUBLIC_PROJECT_ID) {
    throw new Error("Token is not intended for this project");
  }
  if (
    token.iss !==
    "https://securetoken.google.com/" + env.NEXT_PUBLIC_PROJECT_ID
  ) {
    throw new Error("Token is not issued by securetoken.google.com");
  }
  if (!token.sub) {
    throw new Error("Token does not have a subject");
  }
  if (token.auth_time && now < token.auth_time) {
    throw new Error("Token is not authenticated yet");
  }

  return token;
}
