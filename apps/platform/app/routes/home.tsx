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
    <main className="min-h-screen flex items-center justify-center gap-4">
      <Button>Welcome</Button>
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
      <Button size="lg">WibeBlock</Button>
    </main>
  );
}
