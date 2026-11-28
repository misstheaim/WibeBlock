import { Outlet } from "react-router";
import type { Route } from "./+types/page-boundary";
import { describeError, ErrorView } from "~/features/errors";

export function meta({ error }: Route.MetaArgs) {
  if (error === undefined) return [];
  return [{ title: `${describeError(error).title} - WibeBlock` }];
}

export default function PageBoundary() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <ErrorView {...describeError(error)} />;
}
