import { readdirSync, readFileSync } from "node:fs";
import * as path from "node:path";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@farmfe/core";
import farmDtsPlugin from "@farmfe/js-plugin-dts";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function getModuleEntries() {
  const modulesDir = resolve(__dirname, "src/modules");
  const folders = readdirSync(modulesDir, { withFileTypes: true }).filter((d) =>
    d.isDirectory(),
  );
  const allEntries: Record<string, string> = {};

  for (const folder of folders) {
    const modName = folder.name;
    const modulePath = resolve(modulesDir, modName, `index.ts`);
    let _source: string;
    try {
      _source = readFileSync(modulePath, "utf8");
    } catch {
      continue;
    }

    allEntries[modName] = `./src/modules/${modName}/index.ts`;
  }

  return allEntries;
}

const allEntries = getModuleEntries();

export default defineConfig({
  plugins: ["@farmfe/plugin-react"],
  compilation: {
    input: allEntries,
    persistentCache: true,
    resolve: {
      alias: {
        "@": process.cwd(),
        src: path.join(process.cwd(), "src"),
        modules: path.join(process.cwd(), "src/modules"),
      },
    },
  },
});
