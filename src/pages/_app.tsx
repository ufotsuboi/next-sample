import { Container, Header } from "@/components/layout";
import { trpc } from "@/lib/trpc/client";
import "@/styles/globals.css";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/app";

const MyApp: AppType<{ session: Session }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Header />
      <Container>
        <Component {...pageProps} />
      </Container>
    </SessionProvider>
  );
};
export default trpc.withTRPC(MyApp);
