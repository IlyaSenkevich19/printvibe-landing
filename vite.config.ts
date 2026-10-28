import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { defineConfig, type Plugin } from "vite";

const pages = process.env["GITHUB_PAGES"] === "true";
const pagesBase = process.env["PAGES_BASE"] ?? "/";

/** Emits sw.js with every build file listed, so the site keeps working offline after one visit. */
function serviceWorker(): Plugin {
  const offlinePublic = ["favicon.png", ...readdirSync("public/fonts").map((f) => `fonts/${f}`)];
  return {
    name: "printvibe-service-worker",
    apply: "build",
    applyToEnvironment: (environment) => environment.name === "client",
    generateBundle(_, bundle) {
      const built = Object.keys(bundle).filter(
        (file) => file.startsWith("assets/") && !file.includes("heic-to") && !file.endsWith(".map"),
      );
      const assets = [...built, ...offlinePublic].sort();
      const version = createHash("sha256").update(assets.join("\n")).digest("hex").slice(0, 12);
      const source = readFileSync("src/service-worker.js", "utf8")
        .replace("__VERSION__", version)
        .replace("__ASSETS__", JSON.stringify(assets));
      this.emitFile({ type: "asset", fileName: "sw.js", source });
    },
  };
}

export default defineConfig(({ command }) => ({
  base: pages ? pagesBase : "/",
  resolve: {
    tsconfigPaths: true,
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
      server: { entry: "server" },
      ...(pages
        ? {
            prerender: { enabled: true, crawlLinks: true },
            pages: [{ path: "/" }, { path: "/privacy" }],
          }
        : {}),
    }),
    ...(command === "build" && !pages ? [nitro({ preset: "node-server" })] : []),
    viteReact(),
    serviceWorker(),
  ],
}));
