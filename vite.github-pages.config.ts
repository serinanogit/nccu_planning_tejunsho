import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: resolve(projectRoot, "github-pages"),
  publicDir: resolve(projectRoot, "public"),
  base: "/nccu_planning_tejunsho/",
  plugins: [react()],
  build: {
    outDir: resolve(projectRoot, "github-pages-dist"),
    emptyOutDir: true,
  },
});
