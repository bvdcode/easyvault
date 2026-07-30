import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://vault.splidex.com",
        changeOrigin: true,
        secure: true,
        ws: true,
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      injectRegister: "auto",
      includeAssets: ["favicon.ico"],
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        sourcemap: true,
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
      manifest: {
        name: "Vault",
        short_name: "Vault",
        description:
          "Vault is a secure password and secret management solution designed to help you store, manage, and share sensitive information safely and efficiently.",
        categories: ["account", "management", "server", "security", "utility"],
        lang: "en-US",
        theme_color: "#fe6c00",
        scope: "/",
        start_url: "/",
        display: "fullscreen",
        background_color: "#fe6c00",
        icons: [
          {
            src: "/assets/images/vault-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
      },
    }),
  ],
});
