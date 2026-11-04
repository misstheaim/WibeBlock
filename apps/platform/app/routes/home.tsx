import { Button } from "@wibeblock/ui";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "WibeBlock" },
    { name: "description", content: "Welcome to WibeBlock!" },
  ];
}

export default function Home() {
  return (
    <main className="min-h-screen p-8 flex flex-col gap-6">
      <div>
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
      <section className="bg-card text-card-foreground border border-border rounded-xl shadow-md p-6 flex flex-col gap-6">
        <div className="flex flex-wrap gap-3">
          <Button intent="primary">Primary</Button>
          <Button intent="secondary">Secondary</Button>
          <Button intent="ghost">Ghost</Button>
          <Button intent="destructive">Destructive</Button>
          <Button intent="primary" disabled>
            Disabled
          </Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="bg-background text-foreground border border-border rounded-md px-3 py-2 text-sm">
            background
          </div>
          <div className="bg-card text-card-foreground border border-border rounded-md px-3 py-2 text-sm">
            card
          </div>
          <div className="bg-muted text-muted-foreground rounded-md px-3 py-2 text-sm">
            muted
          </div>
          <div className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-sm">
            primary
          </div>
          <div className="bg-secondary text-secondary-foreground rounded-md px-3 py-2 text-sm">
            secondary
          </div>
          <div className="bg-accent text-accent-foreground rounded-md px-3 py-2 text-sm">
            accent
          </div>
          <div className="bg-success text-success-foreground rounded-md px-3 py-2 text-sm">
            success
          </div>
          <div className="bg-warning text-warning-foreground rounded-md px-3 py-2 text-sm">
            warning
          </div>
          <div className="bg-destructive text-destructive-foreground rounded-md px-3 py-2 text-sm">
            destructive
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <p className="text-xs">text-xs</p>
          <p className="text-sm">text-sm</p>
          <p className="text-base">text-base</p>
          <p className="text-lg">text-lg</p>
          <p className="text-xl">text-xl</p>
          <p className="text-2xl">text-2xl</p>
          <p className="text-3xl">text-3xl</p>
          <p className="text-4xl">text-4xl</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="bg-background border border-border size-16 rounded-sm" />
          <div className="bg-background border border-border size-16 rounded-md" />
          <div className="bg-background border border-border size-16 rounded-lg" />
          <div className="bg-background border border-border size-16 rounded-xl" />
          <div className="bg-background border border-border size-16 rounded-lg shadow-xs" />
          <div className="bg-background border border-border size-16 rounded-lg shadow-sm" />
          <div className="bg-background border border-border size-16 rounded-lg shadow-md" />
          <div className="bg-background border border-border size-16 rounded-lg shadow-lg" />
        </div>
        <div className="flex flex-wrap gap-3">
          <p className="text-muted-foreground text-sm">
            A hint, like the text under a form field
          </p>
          <p className="text-destructive text-sm">An error message</p>
          <p className="font-mono text-sm">packages/ui/src/styles/index.css</p>
        </div>
      </section>
    </main>
  );
}
