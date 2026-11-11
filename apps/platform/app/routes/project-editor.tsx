import { Link } from "react-router";
import type { Route } from "./+types/project-editor";
import Studio from "@wibeblock/studio";
import { getProfile } from "~/lib/accounts.server";

export function meta() {
  return [{ title: "Editor - WibeBlock" }];
}

export async function loader() {
  const profile = await getProfile();
  return { profile };
}

export default function ProjectEditor({
  params,
  loaderData,
}: Route.ComponentProps) {
  return (
    <Studio
      externalTools={
        <>
          <Link
            to="/projects"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Projects
          </Link>
          <span className="text-sm text-muted-foreground">{params.id}</span>
          <span className="text-sm text-muted-foreground">
            {loaderData.profile.displayName}
          </span>
        </>
      }
    />
  );
}
