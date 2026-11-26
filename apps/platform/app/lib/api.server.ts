export type ProblemDetails = {
  type?: string;
  title?: string;
  detail?: string;
  status?: number;
  errors?: Record<string, string[]>;
};

export class ApiError extends Error {
  readonly status: number;
  readonly problem: ProblemDetails | null;

  constructor(status: number, problem: ProblemDetails | null, message: string) {
    super(message);
    this.status = status;
    this.problem = problem;
    this.name = "ApiError";
  }
}

function getApiBaseUrl(): string {
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl)
    throw new Error(
      "API_BASE_URL is not set: copy apps/platform/.env.example to .env (see docs/development.md).",
    );

  return baseUrl.replace(/\/+$/, "");
}

export async function apiRequest<T>(
  path: string,
  { method = "GET", body }: { method?: string; body?: unknown } = {},
): Promise<T> {
  const url = `${getApiBaseUrl()}${path}`;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const response = await fetch(url, {
    method: method,
    headers: headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const contentType = response.headers.get("Content-Type");
    let problem: ProblemDetails | null = null;
    if (contentType?.includes("application/problem+json"))
      problem = (await response.json()) as ProblemDetails;
    throw new ApiError(
      response.status,
      problem,
      `${method} ${path} failed with ${response.status} ${problem?.title ?? response.statusText}`,
    );
  }
  return (await response.json()) as T;
}
