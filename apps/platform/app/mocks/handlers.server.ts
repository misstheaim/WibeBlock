import { http, HttpResponse } from "msw";

import { mockProfile } from "./fixtures.server.ts";
import { withScenario, type Scenario } from "./scenarios.server.ts";

/**
 * Every mocked endpoint. Paths are the Gateway's (P-02): the Core API's
 * Accounts module lives under `/accounts`. Mock only what a screen uses, and
 * wrap each resolver with `mock` so the scenario applies to it.
 */
export function createHandlers(baseUrl: string, scenario: Scenario) {
  const mock = withScenario(scenario);

  return [
    http.get(
      `${baseUrl}/accounts/me`,
      mock(() => HttpResponse.json(mockProfile)),
    ),
  ];
}
