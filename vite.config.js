import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { resolve, join } from "path";

export default defineConfig({
  plugins: [
    react(),
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
