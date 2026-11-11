import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import babel from "@rolldown/plugin-babel";
import { reactCompilerPreset } from "@vitejs/plugin-react";

import { apiMocks } from "./app/mocks/index.server.ts";

export default defineConfig({
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
});
