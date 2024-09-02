import { auth } from "@/lib/auth";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { GetServerSidePropsContext } from "next";
import { Session } from "next-auth";

export type Context = {
  session: Session | null;
  res: GetServerSidePropsContext["res"];
  req: GetServerSidePropsContext["req"];
};

export type CheckedContext = {
  session: Session;
  res: GetServerSidePropsContext["res"];
  req: GetServerSidePropsContext["req"];
};

export async function createContext(
  opts: CreateNextContextOptions,
): Promise<Context> {
  const session = await auth(opts.req, opts.res);
  return { session, res: opts.res, req: opts.req };
}

export async function createContextGetServerSideProps(
  ctx: GetServerSidePropsContext,
): Promise<Context> {
  const session = await auth(ctx);
  return { session, res: ctx.res, req: ctx.req };
}
