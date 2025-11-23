import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import jsconfigPaths from "vite-jsconfig-paths";
import path from "path";
import dotenv from "dotenv";
import { VitePWA } from "vite-plugin-pwa";
import { version } from "./package.json";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envFile = path.resolve(process.cwd(), `.env-${mode}`);
  const env = dotenv.config({ path: envFile }).parsed;

  const envVariables = Object.keys(env || {}).reduce((acc, key) => {
    if (key.startsWith("VITE_")) {
      acc[key] = env[key];
    }
    return acc;
  }, {});

  const pwaConfig = {
    registerType: "autoUpdate",
    includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
    manifest: {
      name: "Azkenak",
      short_name: "Azkenak",
      start_url: envVariables.VITE_BASE_URL || "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#a6892b",
      icons: [
        {
          src: "pwa/icon-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "pwa/icon-512x512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ],
      screenshots: [
        {
          src: "pwa/screenshot-login-desktop.png",
          sizes: "1440x900",
          type: "image/png",
          form_factor: "wide",
          label: "Login Screen - Desktop"
        },
        {
          src: "pwa/screenshot-login-mobile.png",
          sizes: "1082x2402",
          type: "image/png",
          form_factor: "narrow",
          label: "Login Screen - Mobile"
        }
      ]
    }
  };

  return {
    base: envVariables.VITE_BASE_URL || "/",
    define: {
      "import.meta.env": JSON.stringify(envVariables),
      "import.meta.env.VITE_APP_VERSION": JSON.stringify(version)
    },
    plugins: [jsconfigPaths(), react(), VitePWA(pwaConfig)],
    server: {
      open: true,
      port: 3000
    }
  };
});
