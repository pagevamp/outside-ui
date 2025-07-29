import { pluginReact } from "@rsbuild/plugin-react";
import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    {
      bundle: true,
      dts: true,
    },
  ],
  output: {
    target: "web",
  },
  plugins: [pluginReact()],
});
