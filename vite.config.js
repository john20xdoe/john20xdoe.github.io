import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-data-files",
      closeBundle() {
        const distData = resolve(__dirname, "dist/data");
        if (!existsSync(distData)) {
          mkdirSync(distData, { recursive: true });
        }
        copyFileSync(
          resolve(__dirname, "data/skills.json"),
          resolve(distData, "skills.json")
        );
        copyFileSync(
          resolve(__dirname, "data/links.json"),
          resolve(distData, "links.json")
        );
      },
    },
  ],
  base: "/", // change to "/repo-name/" if deploying to a GitHub project page subpath
});
