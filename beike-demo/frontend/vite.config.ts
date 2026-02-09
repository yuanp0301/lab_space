import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      data: path.resolve(__dirname, "../data"),
    },
  },
  server: {
    port: 5173,
    fs: {
      allow: [path.resolve(__dirname, "..")],
    },
  },
});
