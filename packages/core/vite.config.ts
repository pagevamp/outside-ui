import { resolve } from "node:path";
import react from "@vitejs/plugin-react-swc";

import preserveDirectives from "rollup-preserve-directives";
import { defineConfig, type UserConfig } from "vite";
import dts from "vite-plugin-dts";

const config = defineConfig(() => {
  const isWatch = process.argv.includes("--watch");
  const userConfig: UserConfig = {
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      react(),
      preserveDirectives(),
      dts({
        include: ["lib"],
        tsconfigPath: "./tsconfig.json",
        root: "./",
      }),
    ],
    build: {
      sourcemap: true,
      emptyOutDir: true,
      lib: {
        entry: resolve(__dirname, "lib/index.ts"),
        formats: ["es"],
      },
      rollupOptions: {
        output: {
          dir: "dist",
          preserveModules: true,
          preserveModulesRoot: "lib",
          assetFileNames: "assets/[name][extname]",
          entryFileNames: "[name].js",
        },
        external: [
          "react",
          "react-dom",
          "react/jsx-runtime",
          "react/jsx-runtime",
          "react/jsx-dev-runtime",
          "lodash",
          "clsx",
          // "dialog-closedby-polyfill",
        ],
      },
    },
    ...(isWatch
      ? {
          watch: {
            include: "lib/*",
            clearScreen: true,
          },
        }
      : {}),
  };

  return userConfig;
});

export default config;
