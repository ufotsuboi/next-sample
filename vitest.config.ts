import react from "@vitejs/plugin-react";
import * as path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    environment: "vprisma",
    setupFiles: ["vitest-environment-vprisma/setup", "./tests/setup.ts"],
    environmentOptions: {
      vprisma: {
        baseEnv: "node",
      },
    },
  },
});
