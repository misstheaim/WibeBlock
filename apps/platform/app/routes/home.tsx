export function meta() {
  return [
    { title: "WibeBlock" },
    { name: "description", content: "Welcome to WibeBlock!" },
  ];
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background p-8 text-foreground">
      <h1 className="text-4xl font-semibold">WibeBlock</h1>
      <p className="text-muted-foreground">
        Build web apps with AI, block by block.
      </p>
    </main>
  );
}
