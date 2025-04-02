import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["./src/index.ts"],
  bundle: true,
  minify: false,
  outdir: "./dist",
  platform: "node",
  format: "esm",
  target: "es2020",

  banner: {
    js: 'import { createRequire } from "module";const require = createRequire(import.meta.url);',
  },
});
