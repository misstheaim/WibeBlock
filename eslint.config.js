import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import reactHooks from "eslint-plugin-react-hooks";
import { reactRefresh } from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  // Never lint build output or generated files (flat config doesn't read .gitignore)
  globalIgnores(["**/dist/", "**/build/", "**/.react-router/"]),

  // Every TypeScript file in the workspace
  {
    files: ["**/*.{ts,tsx}"],

    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite(),
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // React Router route modules: the framework handles hot reload for these exports
  {
    files: ["apps/platform/app/**/*.tsx"],
    extends: [
      reactRefresh.configs.vite({
        allowExportNames: [
          "meta",
          "links",
          "headers",
          "loader",
          "clientLoader",
          "action",
          "clientAction",
          "handle",
          "shouldRevalidate",
          "middleware",
          "clientMiddleware",
        ],
      }),
    ],
  },

  // Overrides for every TypeScript file: parser root, hot-reload hints as warnings
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "warn",
    },
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Tool config files run in Node, not in the browser
  {
    files: ["**/*.config.{js,ts}"],
    languageOptions: {
      globals: globals.node,
    },
  },

  // Last: turn off every rule that only deals with formatting (Prettier owns it)
  eslintConfigPrettier,
]);
