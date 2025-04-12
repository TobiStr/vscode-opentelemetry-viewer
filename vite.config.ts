import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: "src/webview",
  plugins: [react()],
  build: {
    outDir: "../../media/assets",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "src/webview/main.tsx"),
      output: {
        entryFileNames: "main.js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
});
