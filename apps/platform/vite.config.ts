import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import babel from "@rolldown/plugin-babel";
import { reactCompilerPreset } from "@vitejs/plugin-react";

import { apiMocks } from "./app/mocks/index.server.ts";

export default defineConfig(({ mode }) => {
  // Copy the .env values (shell variables win) into process.env, so the app's
  // server code can read API_BASE_URL at runtime. See docs/development.md.
  const env = loadEnv(mode, import.meta.dirname, "");
  Object.assign(process.env, env);
  return {
    plugins: [
      tailwindcss(),
      reactRouter(),
      babel({
        presets: [reactCompilerPreset()],
      }),
      // Mocked backend in development (API_MOCKS=on), see docs/development.md.
      apiMocks(),
    ],
    resolve: {
      tsconfigPaths: true,
    },
  };
});
