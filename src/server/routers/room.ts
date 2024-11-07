import { prisma } from "@/server/prisma";
import { roomSchema } from "@/server/schema";
import { protectedProcedure, publicProcedure, router } from "@/server/trpc";
import { z } from "zod";

export const roomRouter = router({
  createRoom: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .output(roomSchema)
    .mutation(async (opts) => {
      const room = await prisma.room.create({
        data: {
          name: opts.input.name,
        },
      });
      return room;
    }),
  getRoom: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .output(roomSchema.nullable())
    .query(async (opts) => {
      const room = await prisma.room.findUnique({
        where: {
          id: opts.input.id,
        },
      });
      return room;
    }),
  getRooms: publicProcedure
    .output(z.array(roomSchema))
    .query(async ({ ctx }) => {
      ctx.res.setHeader("Set-Cookie", "hoge=fuga");
      const rooms = await prisma.room.findMany();
      return rooms;
    }),
});
