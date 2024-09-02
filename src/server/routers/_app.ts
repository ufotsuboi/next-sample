import { sleep } from "@/lib/sleep";
import { publicProcedure, router } from "@/server/trpc";
import { z } from "zod";
import { roomRouter } from "./room";

export const appRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(async (opts) => {
      await sleep(2000);
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  room: roomRouter,
});

export type AppRouter = typeof appRouter;
