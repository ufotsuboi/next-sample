import { firebaseAuth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signOut as signOutByFirebase,
} from "firebase/auth";
import {
  signIn as signInByNextAuth,
  signOut as signOutByNextAuth,
} from "next-auth/react";

export async function signIn(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );
  const idToken = await userCredential.user.getIdToken();
  await signInByNextAuth("credentials", {
    idToken,
  });
}

export async function signOut() {
  await signOutByFirebase(firebaseAuth);
  await signOutByNextAuth();
}
