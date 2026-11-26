import { http, HttpResponse } from "msw";

import { mockProfile, type Profile } from "./fixtures.server.ts";
import {
  validationProblem,
  withScenario,
  type Scenario,
} from "./scenarios.server.ts";

// In-memory profile: a PATCH changes it and later GETs see the change, until
// the dev server restarts (editing a mock file also starts over).
let profile: Profile = { ...mockProfile };

// Rejected by the mock API only, so an API-side 400 can be tested past the
// form's own checks.
const reservedNames = ["admin"];

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
      mock(() => HttpResponse.json(profile)),
    ),

    http.patch(
      `${baseUrl}/accounts/me`,
      mock(async ({ request }) => {
        const body = (await request.json()) as { displayName?: unknown };

        if (body.displayName !== undefined) {
          const name =
            typeof body.displayName === "string" ? body.displayName.trim() : "";

          if (name.length < 1 || name.length > 50) {
            return validationProblem({
              displayName: ["The display name must be 1 to 50 characters."],
            });
          }
          if (reservedNames.includes(name.toLowerCase())) {
            return validationProblem({
              displayName: ["This display name is reserved."],
            });
          }

          profile = {
            ...profile,
            displayName: name,
            updatedAt: new Date().toISOString(),
          };
        }

        return HttpResponse.json(profile);
      }),
    ),
  ];
}
