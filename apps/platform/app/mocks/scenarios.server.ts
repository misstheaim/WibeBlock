import { delay, HttpResponse, type HttpResponseResolver } from "msw";

// A scenario changes how every mocked API call behaves, so loading and error
// states can be built without a backend. Chosen with API_MOCK_SCENARIO.
export const scenarios = ["normal", "slow", "error", "unauthorized"] as const;
export type Scenario = (typeof scenarios)[number];

export function readScenario(value: string | undefined): Scenario {
  if (!value) return "normal";
  if ((scenarios as readonly string[]).includes(value)) {
    return value as Scenario;
  }
  throw new Error(
    `API_MOCK_SCENARIO="${value}" is not a scenario. Use one of: ${scenarios.join(", ")}.`,
  );
}

/**
 * An error response as RFC 9457 problem details, the shape ASP.NET Core
 * returns, so the API client is written against the real format.
 */
export function problem(status: number, title: string, detail: string) {
  return HttpResponse.json(
    {
      type: `https://tools.ietf.org/html/rfc9110#status-${status}`,
      title,
      status,
      detail,
    },
    { status, headers: { "Content-Type": "application/problem+json" } },
  );
}

/**
 * Wraps an endpoint's resolver with the scenario: waits, then either answers
 * with the scenario's error or runs the endpoint's own resolver.
 *
 * A wrapper per endpoint rather than one catch-all handler in front: MSW counts
 * a matched catch-all as "handled", so a call without a mock would go
 * unreported.
 */
export function withScenario(scenario: Scenario) {
  return (resolver: HttpResponseResolver): HttpResponseResolver =>
    async (info) => {
      // MSW's "realistic" delay is 0 in Node, so pick the time explicitly.
      await delay(scenario === "slow" ? 3000 : 100 + Math.random() * 200);

      if (scenario === "error") {
        return problem(
          500,
          "An error occurred while processing your request.",
          "Mocked server error (API_MOCK_SCENARIO=error).",
        );
      }
      if (scenario === "unauthorized") {
        return problem(
          401,
          "Unauthorized",
          "Mocked missing or expired token (API_MOCK_SCENARIO=unauthorized).",
        );
      }
      return resolver(info);
    };
}
