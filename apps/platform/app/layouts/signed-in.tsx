import { Button } from "@wibeblock/ui";
import {
  Link,
  NavLink,
  Outlet,
  type ShouldRevalidateFunctionArgs,
} from "react-router";
import { getProfile } from "~/lib/accounts.server";
import type { Route } from "./+types/signed-in";
import { UserMenu } from "~/features/account";

export async function loader() {
  const profile = await getProfile();
  return { profile };
}

export function shouldRevalidate({
  currentUrl,
  formMethod,
  nextUrl,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (formMethod) return defaultShouldRevalidate;
  if (currentUrl.href === nextUrl.href) return defaultShouldRevalidate;
  return false;
}

export default function SignedInLayout({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex h-14 items-center gap-6 border-b border-border px-4">
        <Link to="/" className="text-lg font-semibold">
          WibeBlock
        </Link>
        <nav>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive
                ? "rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground"
                : "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            }
          >
            Projects
          </NavLink>
          <NavLink
            to="/dev/tokens"
            className={({ isActive }) =>
              isActive
                ? "rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground"
                : "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            }
          >
            Dev tokens
          </NavLink>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <UserMenu profile={loaderData.profile} />

          <Button
            intent="ghost"
            onClick={() => {
              const root = document.documentElement;
              const isDark =
                root.dataset.mode === "dark" ||
                (!root.dataset.mode &&
                  window.matchMedia("(prefers-color-scheme: dark)").matches);
              root.dataset.mode = isDark ? "light" : "dark";
            }}
          ></Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}
