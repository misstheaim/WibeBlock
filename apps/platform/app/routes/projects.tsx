import { buttonVariants } from "@wibeblock/ui";
import { Link, useRouteLoaderData } from "react-router";
import type { loader as signedInLoader } from "~/layouts/signed-in";

export function meta() {
  return [{ title: "Projects - WibeBlock" }];
}

export default function Projects() {
  const signedInLoaderData =
    useRouteLoaderData<typeof signedInLoader>("layouts/signed-in");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
      <h1 className="text-2xl font-semibold">
        Welcome {signedInLoaderData?.profile.displayName}
      </h1>
      <p className="text-muted-foreground">Projects are coming.</p>
      <div className="mt-2">
        <Link
          to="/projects/56465fc6d56/edit"
          className={buttonVariants({ intent: "primary" })}
        >
          Try the Editor!
        </Link>
      </div>
    </div>
  );
}
