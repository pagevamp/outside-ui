import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import * as path from "node:path";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import styleLoader from "bun-style-loader";

const __dirname = path.resolve(
  fileURLToPath(new URL(".", import.meta.url)),
  "../",
);

async function getModuleEntries() {
  const modulesDir = resolve(__dirname, "src/modules");
  const folders = readdirSync(modulesDir, { withFileTypes: true }).filter((d) =>
    d.isDirectory(),
  );
  const allEntries: Record<string, string> = {};

  for (const folder of folders) {
    const modName = folder.name;
    const modulePath = resolve(modulesDir, modName, `index.ts`);

    allEntries[modName] = modulePath;
  }

  await Bun.build({
    entrypoints: Object.values(allEntries),
    outdir: `lib/modules/`,
    target: "browser",
    format: "esm",
    minify: false,
    sourcemap: "external",
    external: ["react", "react-dom", "zod", "qs"],
    plugins: [styleLoader()],
  });

  return allEntries;
}

function updatePackageJsonExports(allEntries: Record<string, string>) {
  const pkgPath = resolve(__dirname, "package.json");
  const pkgJson = JSON.parse(readFileSync(pkgPath, "utf-8"));

  const exportsField: Record<string, any> = {};
  for (const entry of Object.keys(allEntries)) {
    const modName = entry.replace(/^modules\//, "").replace(/\/index$/, "");
    const jsPath = `./lib/modules/${entry}/index.js`;
    const dtsPath = `./lib/modules/${entry}/index.d.ts`;
    const cssPath = `./lib/modules/${entry}/index.css`;
    const styleExists = existsSync(resolve(__dirname, cssPath));

    exportsField[`./${modName}`] = {
      import: jsPath,
      types: dtsPath,
      ...(styleExists && { style: cssPath }),
    };
  }

  pkgJson.exports = {
    ...exportsField,
  };

  writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2) + "\n");
}

getModuleEntries().then(async (entries) => {
  updatePackageJsonExports(entries);
});
