import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Vitest reads tsconfig for types but not for `paths`, so the `~/` alias the app
 * imports through has to be repeated here. Without it any module that uses the
 * alias is untestable, which quietly pushes tests towards the modules that
 * happen not to.
 */
export default defineConfig({
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
