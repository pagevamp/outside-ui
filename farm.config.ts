import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "@farmfe/core";
import farmDtsPlugin from "@farmfe/js-plugin-dts";

function getModuleEntries() {
  const modulesDir = resolve(__dirname, "src/modules");
  const folders = readdirSync(modulesDir, { withFileTypes: true }).filter((d) =>
    d.isDirectory(),
  );
  const allEntries: Record<string, string> = {};

  for (const folder of folders) {
    const modName = folder.name;
    const modulePath = resolve(modulesDir, modName, `index.ts`);

    allEntries[`modules/${modName}/index`] = modulePath;
  }

  return allEntries;
}

export default defineConfig({
  plugins: ["@farmfe/plugin-react", farmDtsPlugin({})],
  compilation: {
    persistentCache: true,
    input: {
      ...getModuleEntries(),
      index: "index.html",
    },
    output: {
      targetEnv: "browser",
    },
  },
});
