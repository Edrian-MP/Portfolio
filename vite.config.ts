import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  base: "./",
  plugins: [react(), {
    name: "verify-browser-dependencies",
    apply: "build",
    generateBundle(_options, bundle) {
      const packages = new Set<string>();
      for (const output of Object.values(bundle)) {
        if (output.type !== "chunk") continue;
        for (const id of Object.keys(output.modules)) {
          const normalized = id.split("\\").join("/");
          const match = normalized.match(/\/node_modules\/((?:@[^/]+\/)?[^/]+)/);
          if (match) packages.add(match[1]);
          if (/(?:^|\/)node_modules\/(?:picomatch|fdir|tinyglobby|vite)(?:\/|$)/.test(normalized)) {
            this.error("Build-only dependency found in browser bundle: " + id);
          }
        }
      }
      console.log("Verified browser dependency modules: " + [...packages].sort().join(", "));
      console.log("Bundle check passed: picomatch, fdir, tinyglobby and vite excluded.");
    },
  }],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: { host: "127.0.0.1" },
  preview: { host: "127.0.0.1" },
});
