import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  build: {
    outDir: "dist/client",
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          "blocknote": ["@blocknote/core", "@blocknote/react", "@blocknote/mantine"],
          "mermaid": ["mermaid"],
          "xterm": ["@xterm/xterm", "@xterm/addon-fit", "@xterm/addon-web-links"],
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": "http://127.0.0.1:3210",
      "/ws": {
        target: "ws://127.0.0.1:3210",
        ws: true,
      },
    },
  },
});
