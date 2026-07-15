import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { resolve, join } from "path";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-shoelace-assets",
      buildStart() {
        try {
          const src = resolve(__dirname, "node_modules/@shoelace-style/shoelace/dist/assets");
          const dest = resolve(__dirname, "public/shoelace/assets");
          
          if (!existsSync(src)) {
            console.warn("Shoelace assets not found. Skipping copy.");
            return;
          }
          
          const copyDir = (srcDir, destDir) => {
            if (!existsSync(destDir)) {
              mkdirSync(destDir, { recursive: true });
            }
            const entries = readdirSync(srcDir, { withFileTypes: true });
            for (const entry of entries) {
              const srcPath = join(srcDir, entry.name);
              const destPath = join(destDir, entry.name);
              if (entry.isDirectory()) {
                copyDir(srcPath, destPath);
              } else {
                copyFileSync(srcPath, destPath);
              }
            }
          };
          
          copyDir(src, dest);
          console.log("Shoelace assets copied to public/shoelace/assets");
        } catch (error) {
          console.error("Failed to copy Shoelace assets:", error);
        }
      },
    },
    {
      name: "copy-data-files",
      closeBundle() {
        try {
          const dataDir = resolve(__dirname, "data");
          const distData = resolve(__dirname, "dist/data");
          
          // Check if source data directory exists
          if (!existsSync(dataDir)) {
            console.warn('Data directory does not exist. Skipping data file copy.');
            return;
          }
          
          // Create dist/data directory if needed
          if (!existsSync(distData)) {
            mkdirSync(distData, { recursive: true });
          }
          
          // Copy all JSON files from data/ to dist/data/
          const files = readdirSync(dataDir).filter(f => f.endsWith('.json'));
          
          if (files.length === 0) {
            console.warn('No JSON files found in data directory.');
            return;
          }
          
          files.forEach(file => {
            copyFileSync(
              join(dataDir, file),
              join(distData, file)
            );
          });
          
          console.log(`Copied ${files.length} JSON file(s) to dist/data/`);
        } catch (error) {
          console.error('Failed to copy data files:', error);
          throw error;
        }
      },
    },
  ],
  base: "/", // change to "/repo-name/" if deploying to a GitHub project page subpath
});
