import * as path from "node:path";
import { defineConfig } from "@farmfe/core";

export default defineConfig({
  plugins: ["@farmfe/plugin-react"],
  compilation: {
    resolve: {
      alias: {
        modules: path.join(process.cwd(), "src/modules"),
      },
    },
  },
});
