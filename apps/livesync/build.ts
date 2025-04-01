import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "es2020",
  platform: "node",
});
