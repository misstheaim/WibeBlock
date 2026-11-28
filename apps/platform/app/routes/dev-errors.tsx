import { data, Link } from "react-router";
import type { Route } from "./+types/dev-errors";

let flakyFailsNext = true;
const kinds = ["500", "503", "404", "render", "flaky"];

export function meta() {
  return [{ title: "Errors - WibeBlock" }];
}

export function loader({ request }: Route.LoaderArgs) {
  const kind = new URL(request.url).searchParams.get("kind");
  if (kind === "500")
    throw new Error("Test error thrown by the /dev/errors loader");
  if (kind === "503") throw data(null, { status: 503 });
  if (kind === "404") throw data(null, { status: 404 });
  if (kind === "flaky") {
    const flakyCurrent = flakyFailsNext;
    flakyFailsNext = !flakyFailsNext;
    if (flakyCurrent) throw new Error("Flaky test error: try again");
  }
  return { kind };
}

export default function DevErrors({ loaderData }: Route.ComponentProps) {
  if (loaderData.kind === "render") {
    throw new Error("Test error thrown while rendering /dev/errors");
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">Error states</h1>
      <p className="text-muted-foreground">
        Each link makes this page fail in a different way. The top bar should
        stay; only this area is replaced.
      </p>
      <ul className="flex flex-col gap-2">
        {kinds.map((kind) => (
          <li key={kind}>
            <Link
              to={`?kind=${kind}`}
              className="text-sm font-medium underline underline-offset-4"
            >
              ?kind={kind}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
