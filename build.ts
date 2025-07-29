import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dts from "bun-plugin-dtsx";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

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
    plugins: [
      dts({
        // @ts-ignore
        cwd: "./", // optional, default: process.cwd()
        root: "./src", // optional, default: './src'
        outdir: "./lib", // optional, default: './dist'
        keepComments: true, // optional, default: true
        tsconfigPath: "./tsconfig.json", // optional, default: './tsconfig.json'}
      }),
    ],
  });

  return allEntries;
}

function updatePackageJsonExports(allEntries: Record<string, string>) {
  const pkgPath = resolve(__dirname, "package.json");
  const pkgJson = JSON.parse(readFileSync(pkgPath, "utf-8"));

  const exportsField: Record<string, any> = {};
  for (const entry of Object.keys(allEntries)) {
    const modName = entry.replace(/^modules\//, "").replace(/\/index$/, "");
    exportsField[`./${modName}`] = {
      import: `./lib/modules/${entry}/index.js`,
      types: `./lib/modules/${entry}/index.d.ts`,
    };
  }

  pkgJson.exports = {
    ...exportsField,
  };

  writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2) + "\n");
}

getModuleEntries().then((entries) => {
  updatePackageJsonExports(entries);
});
