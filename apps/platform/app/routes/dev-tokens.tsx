import { Button } from "@wibeblock/ui";

export function meta() {
  return [{ title: "Tokens - WibeBlock" }];
}

export default function DevTokens() {
  return (
    <main className="flex min-h-screen flex-col gap-6 p-8">
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
      <section className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-md">
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
          <div className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
            background
          </div>
          <div className="rounded-md border border-border bg-card px-3 py-2 text-sm text-card-foreground">
            card
          </div>
          <div className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
            muted
          </div>
          <div className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">
            primary
          </div>
          <div className="rounded-md bg-secondary px-3 py-2 text-sm text-secondary-foreground">
            secondary
          </div>
          <div className="rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground">
            accent
          </div>
          <div className="rounded-md bg-success px-3 py-2 text-sm text-success-foreground">
            success
          </div>
          <div className="rounded-md bg-warning px-3 py-2 text-sm text-warning-foreground">
            warning
          </div>
          <div className="rounded-md bg-destructive px-3 py-2 text-sm text-destructive-foreground">
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
          <div className="size-16 rounded-sm border border-border bg-background" />
          <div className="size-16 rounded-md border border-border bg-background" />
          <div className="size-16 rounded-lg border border-border bg-background" />
          <div className="size-16 rounded-xl border border-border bg-background" />
          <div className="size-16 rounded-lg border border-border bg-background shadow-xs" />
          <div className="size-16 rounded-lg border border-border bg-background shadow-sm" />
          <div className="size-16 rounded-lg border border-border bg-background shadow-md" />
          <div className="size-16 rounded-lg border border-border bg-background shadow-lg" />
        </div>
        <div className="flex flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">
            A hint, like the text under a form field
          </p>
          <p className="text-sm text-destructive">An error message</p>
          <p className="font-mono text-sm">packages/ui/src/styles/index.css</p>
        </div>
      </section>
    </main>
  );
}
