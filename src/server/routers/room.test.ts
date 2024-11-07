import { createCaller } from "@/lib/trpc/server";
import { Context } from "@/server/context";
import { Session } from "next-auth";
import { createRequest, createResponse } from "node-mocks-http";

function createContext(session: Session | null = null): Context {
  const req = createRequest();
  const res = createResponse();
  return { session, res, req };
}

describe("UserService", () => {
  const prisma = vPrisma.client;

  test("Get room", async () => {
    const trpc = createCaller(createContext());
    await prisma.room.create({
      data: {
        name: "test",
      },
    });
    const rooms = await trpc.room.getRooms();

    console.log("取得した数", rooms.length);
    expect(rooms.length).toBe(await prisma.room.count());
  });

  test("Get user", async () => {
    expect(await prisma.room.count()).toBe(0);
  });
});
