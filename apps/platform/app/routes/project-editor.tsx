import { Link } from "react-router";
import type { Route } from "./+types/project-editor";
import { mockUser } from "~/lib/mock-user";
import Studio from "@wibeblock/studio";

export function meta() {
  return [{ title: "Editor - WibeBlock" }];
}

export default function ProjectEditor({ params }: Route.ComponentProps) {
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
          <span className="text-sm text-muted-foreground">{mockUser.name}</span>
        </>
      }
    />
  );
}
