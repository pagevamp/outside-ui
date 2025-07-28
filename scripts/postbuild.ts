import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const distModulesDir = resolve("dist/modules");
const folders = readdirSync(distModulesDir, { withFileTypes: true }).filter(
  (d) => d.isDirectory(),
);

const exportsMap: Record<string, string> = {};

for (const folder of folders) {
  const modName = folder.name;
  const files = readdirSync(resolve(distModulesDir, modName)).filter((f) =>
    f.endsWith(".js"),
  );
  for (const file of files) {
    const name = file.replace(/\.js$/, "");
    exportsMap[`./${modName}/${name}`] = `./dist/modules/${modName}/${file}`;
  }
}

const pkgPath = resolve("package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
pkg.exports = { ...(pkg.exports || {}), ...exportsMap };

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log("✅ package.json exports updated.");
