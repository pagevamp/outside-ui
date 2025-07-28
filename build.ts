import { readdirSync } from "node:fs";
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

    await Bun.build({
      entrypoints: [modulePath],
      outdir: `lib/modules/${modName}/`,
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

    // const proc = Bun.spawnSync({
    //   cmd: [
    //     "bun",
    //     "x",
    //     "tsc",
    //     modulePath,
    //     "--declaration",
    //     "--emitDeclarationOnly",
    //     "--outFile",
    //     path.resolve(__dirname, `dist/modules/${modName}/index.d.ts`),
    //     "--moduleResolution",
    //     "node",
    //     "--module",
    //     "esnext"
    //   ],
    //   stdout: "inherit",
    //   stderr: "inherit"
    // });

    // if (proc.exitCode !== 0) {
    //   throw new Error(`Failed to generate types for ${modName}`);
    // }
  }

  return allEntries;
}

getModuleEntries();

// for (const [modName, entryPath] of Object.entries(allEntries)) {
//   const inputPath = path.resolve(__dirname, entryPath);
//   const outputPath = path.resolve(__dirname, `dist/modules/${modName}.d.ts`);
//   const proc = Bun.spawnSync({
//     cmd: [
//       "bun",
//       "x",
//       "tsc",
//       inputPath,
//       "--declaration",
//       "--emitDeclarationOnly",
//       "--outFile",
//       outputPath,
//       "--moduleResolution",
//       "node",
//       "--module",
//       "esnext",
//     ],
//     stdout: "inherit",
//     stderr: "inherit",
//   });
//
//   if (proc.exitCode !== 0) {
//     throw new Error(`Failed to generate types for ${modName}`);
//   }
// }
