import * as path from "node:path";
import { defineConfig } from "@farmfe/core";

export default defineConfig({
  plugins: ["@farmfe/plugin-react"],
  compilation: {
    input: {
      index: "./src/app/index.html",
    },
    output: {
      clean: true,
      targetEnv: "browser",
    },
    resolve: {
      alias: {
        modules: path.join(process.cwd(), "src/modules"),
      },
    },
  },
});
