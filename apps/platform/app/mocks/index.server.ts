import { setupServer, type SetupServer } from "msw/node";
import { loadEnv, type Plugin } from "vite";

import { createHandlers } from "./handlers.server.ts";
import { readScenario } from "./scenarios.server.ts";

// The interceptor patches Node's networking for the whole process. The dev
// server restarts in the same process when a mock file changes, so keep one
// instance on globalThis and only swap its handlers.
const state = globalThis as typeof globalThis & {
  __wibeblockApiMocks?: SetupServer;
};

/**
 * Vite plugin that starts the mocked backend (P-08 US-2, D-33) in the dev
 * server's process. `apply: "serve"` keeps it out of `react-router build`, and
 * no app module imports the mocks, so they never reach the build output.
 *
 * Settings come from the .env files in apps/platform (shell variables win):
 * API_MOCKS=on turns it on, API_BASE_URL is the URL to answer for,
 * API_MOCK_SCENARIO picks the scenario.
 */
export function apiMocks(): Plugin {
  return {
    name: "wibeblock-api-mocks",
    apply: "serve",
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.root, "");
      if (env.API_MOCKS !== "on") return;
      startMocks(env.API_BASE_URL, env.API_MOCK_SCENARIO);
    },
  };
}

function startMocks(
  rawBaseUrl: string | undefined,
  rawScenario: string | undefined,
) {
  if (!rawBaseUrl) {
    throw new Error(
      "API_MOCKS=on needs API_BASE_URL (see apps/platform/.env.example).",
    );
  }
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");
  const scenario = readScenario(rawScenario);
  const handlers = createHandlers(baseUrl, scenario);

  if (state.__wibeblockApiMocks) {
    state.__wibeblockApiMocks.resetHandlers(...handlers);
    return;
  }

  const server = setupServer(...handlers);
  server.listen({
    onUnhandledFrame({ frame, defaults }) {
      // A call to the API without a mock is a bug: print an error (the
      // request then goes on to the network and fails there). Requests to
      // other hosts pass through quietly.
      if (frame.protocol !== "http") return;
      // The frame type is generic over protocols; HTTP frames carry the request.
      const { request } = frame.data as { request: Request };
      if (request.url.startsWith(`${baseUrl}/`)) {
        defaults.error();
      }
    },
  });
  state.__wibeblockApiMocks = server;
  console.info(`[mocks] API mocks on for ${baseUrl}, scenario: ${scenario}`);
}
