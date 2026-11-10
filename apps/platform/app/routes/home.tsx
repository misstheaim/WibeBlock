export function meta() {
  return [
    { title: "WibeBlock" },
    { name: "description", content: "Welcome to WibeBlock!" },
  ];
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
      <h1 className="text-4xl font-semibold">WibeBlock</h1>
      <p className="text-muted-foreground">
        Build web apps with AI, block by block.
      </p>
    </div>
  );
}
