import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    root: "./",
    include: ["tests/**/*.spec.ts"],
    testTimeout: 30000,
    coverage: {
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
      include: ["src"],
      reporter: ["text", "text-summary", "html", "cobertura"],
    },
  },
});
