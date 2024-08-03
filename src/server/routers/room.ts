import { prisma } from "@/server/prisma";
import { roomSchema } from "@/server/schema";
import { procedure, router } from "@/server/trpc";
import { z } from "zod";

export const roomRouter = router({
  createRoom: procedure
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
  getRoom: procedure
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
  getRooms: procedure.output(z.array(roomSchema)).query(async () => {
    const rooms = await prisma.room.findMany();
    return rooms;
  }),
});
