import { CheckedContext, Context } from "@/server/context";
import { TRPCError, initTRPC } from "@trpc/server";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

const checkSession = t.middleware(async ({ ctx, next }) => {
  if (ctx.session) {
    return next<CheckedContext>({ ctx: { ...ctx, session: ctx.session } });
  }
  throw new TRPCError({ code: "UNAUTHORIZED" });
});

export const protectedProcedure = t.procedure.use(checkSession);
export const createCallerFactory = t.createCallerFactory;
