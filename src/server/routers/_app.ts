import { procedure, router } from "@/server/trpc";
import { sleep } from "@/utils/sleep";
import { z } from "zod";
import { roomRouter } from "./room";

export const appRouter = router({
  hello: procedure
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
