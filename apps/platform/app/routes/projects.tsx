import { buttonVariants } from "@wibeblock/ui";
import { Link } from "react-router";
import { mockUser } from "~/lib/mock-user";

export function meta() {
  return [{ title: "Projects - WibeBlock" }];
}

export default function Projects() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
      <h1 className="text-2xl font-semibold">Welcome {mockUser.name}</h1>
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
