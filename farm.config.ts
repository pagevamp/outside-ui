import { readdirSync, readFileSync, writeFileSync } from "node:fs";
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

    allEntries[`modules/${modName}/index`] = modulePath;
  }

  return allEntries;
}

function updatePackageJsonExports(allEntries: Record<string, string>) {
  const pkgPath = resolve(__dirname, "package.json");
  const pkgJson = JSON.parse(readFileSync(pkgPath, "utf-8"));

  const exportsField: Record<string, any> = {};
  for (const entry of Object.keys(allEntries)) {
    const modName = entry.replace(/^modules\//, "").replace(/\/index$/, "");
    exportsField[`./${modName}`] = {
      import: `./dist/${entry}.js`,
      types: `./dist/${entry}.d.ts`,
    };
  }

  pkgJson.exports = {
    ...exportsField,
  };

  writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2) + "\n");
}

const allEntries = getModuleEntries();
updatePackageJsonExports(allEntries);

export default defineConfig({
  plugins: ["@farmfe/plugin-react", farmDtsPlugin({})],
  compilation: {
    resolve: {
      alias: {
        modules: path.join(process.cwd(), "src/modules"),
      },
    },
    minify: false,
    input: {
      // ...allEntries,
      "modules/index": "./src/modules/index.ts",
      index: "index.html",
    },
    output: {
      clean: true,
      targetEnv: "browser",
    },
  },
});
