import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const pages = process.env["GITHUB_PAGES"] === "true";
const pagesBase = process.env["PAGES_BASE"] ?? "/printvibe-landing/";

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
  ],
}));
