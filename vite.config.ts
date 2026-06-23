import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: new URL("./index.html", import.meta.url).pathname,
        zh: new URL("./zh/index.html", import.meta.url).pathname,
      },
    },
  },
  plugins: [react()],
});
