/*
create the entry object
the key should be `{module-name}/${key of moduleEntries eg. hooks|components except for extras}/${key of the object}`
eg. {
common/utils/checkUrlQuery: "src/modules/common/utils/checkUrlQuery"
}
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pluginReact } from "@rsbuild/plugin-react";
import { defineConfig } from "@rslib/core";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function getModuleEntries() {
  const modulesDir = resolve(__dirname, "src/modules");
  const folders = readdirSync(modulesDir, { withFileTypes: true }).filter((d) =>
    d.isDirectory(),
  );
  const allEntries: Record<string, string> = {};

  for (const folder of folders) {
    const modName = folder.name;
    const modulePath = resolve(modulesDir, modName, `${modName}.module.ts`);
    let _source: string;
    try {
      _source = readFileSync(modulePath, "utf8");
    } catch {
      continue;
    }

    const exports = require(modulePath);
    const moduleEntries = exports.moduleEntries;
    if (!moduleEntries) continue;

    for (const group of Object.keys(moduleEntries)) {
      const items = moduleEntries[group];
      const groupName = group === "extra" ? "" : `${group}/`;
      for (const [key, relPath] of Object.entries(items)) {
        allEntries[`modules/${modName}/${groupName}${key}`] =
          `./src/modules/${modName}/${groupName}${relPath}`;
      }
    }
  }

  console.log(allEntries);

  return allEntries;
}

const allEntries = getModuleEntries();

const pkgPath = resolve(__dirname, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

pkg.exports = Object.fromEntries(
  Object.entries(allEntries).map(([key, value]) => {
    const isCss = value.endsWith(".css");
    return [`./${key}`, `./dist/${key}.${isCss ? "css" : "js"}`];
  }),
);

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

// for allEntries keys add to exports in package.json file.. Identify if the file is css file based on the extension in value in which case we do need to add proper extension

export default defineConfig({
  source: {
    entry: allEntries,
  },
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
