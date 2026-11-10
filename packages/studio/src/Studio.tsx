import type { ReactNode } from "react";

export type StudioProps = {
  externalTools?: ReactNode;
};

export default function Studio({ externalTools }: StudioProps) {
  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="flex h-12 shrink-0 items-center gap-4 border-b border-border px-4">
        <span className="text-sm font-semibold">Studio</span>
        <div className="ml-auto flex items-center gap-3">{externalTools}</div>
      </header>
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Not done yet! Coming soon!
      </div>
    </div>
  );
}
