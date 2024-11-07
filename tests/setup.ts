import { loadEnvConfig } from "@next/env";
import { vi } from "vitest";
import { initialize, resetSequence } from "./__generated__/fabbrica";

// Netx.jsの機能を使って環境変数(.env.test)を読み込む
loadEnvConfig(process.cwd());

// prismaをvPrismaにモックする
vi.mock("../src/server/prisma", () => ({
  prisma: vPrisma.client,
}));

// prisma-fabbricaのセットアップ
beforeAll(async () => {
  initialize({
    prisma: () => vPrisma.client,
  });
});
beforeEach(() => resetSequence());
