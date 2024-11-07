import { createCaller } from "@/lib/trpc/server";
import { Context } from "@/server/context";
import { Session } from "next-auth";
import { createRequest, createResponse } from "node-mocks-http";
import { RoomFactory } from "../../../tests/factories";

function createContext(session: Session | null = null): Context {
  const req = createRequest();
  const res = createResponse();
  return { session, res, req };
}

describe("UserService", () => {
  const prisma = vPrisma.client;

  test("Get room", async () => {
    const exp = await RoomFactory.createList(10);
    const trpc = createCaller(createContext());
    const rooms = await trpc.room.getRooms();

    console.log("取得した数", exp);
    expect(rooms.length).toBe(10);
  });

  test("Get user", async () => {
    expect(await prisma.room.count()).toBe(0);
  });
});
