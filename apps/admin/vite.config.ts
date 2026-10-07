import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_BASE ?? "http://127.0.0.1:3010";

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/admin": { target: apiTarget, changeOrigin: true },
        "/api": { target: apiTarget, changeOrigin: true },
      },
    },
  };
});
