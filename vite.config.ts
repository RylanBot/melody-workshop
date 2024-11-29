import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";

import path from "path";

export default defineConfig({
  plugins: [react(), UnoCSS()],
  resolve: {
    alias: {
      "@": path.join(__dirname, "./src")
    }
  }
});
