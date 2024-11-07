import type { JestPrisma } from "@quramy/jest-prisma-core";
import type { prisma } from "../src/server/prisma";

declare global {
  const vPrisma: JestPrisma<typeof prisma>;
}
