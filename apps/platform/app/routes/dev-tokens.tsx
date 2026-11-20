import {
  Input,
  Textarea,
  Button,
  IconButton,
  Label,
  FormField,
  Skeleton,
  Spinner,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  toast,
} from "@wibeblock/ui";
import { File, List, LogOut, Plus, Trash, User } from "lucide-react";
import { useState } from "react";

export function meta() {
  return [{ title: "Tokens - WibeBlock" }];
}

export default function DevTokens() {
  const [mode, setMode] = useState("system");

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
          <Button intent="primary" loading={true}>
            Primary
          </Button>
          <Button intent="secondary" loading={true}>
            Secondary
          </Button>
          <Button intent="ghost" loading={true}>
            Ghost
          </Button>
          <Button intent="destructive" loading={true}>
            Destructive
          </Button>
          <Button intent="destructive" size="lg" loading={true}>
            Destructive
          </Button>
          <IconButton intent="primary" aria-label="Add project">
            <Plus />
          </IconButton>
          <IconButton intent="secondary" aria-label="Add project">
            <Trash />
          </IconButton>
          <IconButton intent="ghost" aria-label="Add project">
            <File />
          </IconButton>
          <IconButton intent="destructive" aria-label="Add project">
            <List />
          </IconButton>
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
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-md">
        <div className="flex flex-wrap items-center gap-3">
          <Input size="sm" placeholder="Small" className="w-48" />
          <Input placeholder="Medium (default)" className="w-48" />
          <Input size="lg" placeholder="Large" className="w-48" />
          <Button size="lg">Next to a large input</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Input placeholder="Disabled" disabled className="w-48" />
          <Input defaultValue="Wrong value" aria-invalid className="w-48" />
        </div>
        <div className="grid max-w-xl gap-3">
          <Textarea placeholder="Project description" />
          <Textarea defaultValue="Too short" aria-invalid />
          <Textarea placeholder="Disabled" disabled />
        </div>
        <div className="grid max-w-sm gap-2">
          <Label htmlFor="dev-project-name">Project name</Label>
          <Input id="dev-project-name" placeholder="My new app" />
        </div>
        <div className="grid max-w-xl gap-2">
          <Label htmlFor="dev-project-description">Description</Label>
          <Textarea
            id="dev-project-description"
            placeholder="What is it for?"
          />
        </div>
        <div className="grid max-w-sm gap-4">
          <FormField label="Email" hint="We never share it">
            <Input type="email" placeholder="you@example.com" />
          </FormField>
          <FormField label="Project name" error="Name is already taken">
            <Input defaultValue="my-app" />
          </FormField>
          <FormField
            label="Description"
            hint="Shown on the dashboard"
            error="At least 10 characters"
          >
            <Textarea defaultValue="Short" />
          </FormField>
        </div>
      </section>
      <section className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-md">
        <h2 className="text-lg font-semibold">Loading</h2>
        <div className="flex items-center gap-4">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Spinner label="Loading projects" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-md">
        <h2 className="text-lg font-semibold">Dropdown menu</h2>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button intent="secondary">Open menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => console.log("profile")}>
                <User /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem disabled>Billing (soon)</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Mode</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={mode} onValueChange={setMode}>
                <DropdownMenuRadioItem value="light">
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem intent="destructive">
                <LogOut /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>
      <section className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-md">
        <h2 className="text-lg font-semibold">Avatar</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Avatar size="sm">
            <AvatarImage
              src="https://avatars.githubusercontent.com/u/9919"
              alt="GitHub"
            />
            <AvatarFallback>GH</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="https://avatars.githubusercontent.com/u/9919"
              alt="GitHub"
            />
            <AvatarFallback>GH</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarImage
              src="https://avatars.githubusercontent.com/u/9919"
              alt="GitHub"
            />
            <AvatarFallback>GH</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="data:image/png;base64,broken"
              alt="Ada Lovelace"
            />
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>MU</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="data:image/png;base64,broken" alt="" />
            <AvatarFallback name="Ada Lovelace" />
          </Avatar>
          <Avatar>
            <AvatarFallback name="Mock User" />
          </Avatar>
          <Avatar>
            <AvatarFallback name="Grace Hopper" />
          </Avatar>
          <Avatar>
            <AvatarFallback name="Linus" />
          </Avatar>
          <Avatar>
            <AvatarFallback name="Margaret Heafield Hamilton" />
          </Avatar>
          <Avatar>
            <AvatarFallback>??</AvatarFallback>
          </Avatar>
        </div>
      </section>
      <section className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-md">
        <h2 className="text-lg font-semibold">Dialog</h2>
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button intent="secondary">Edit profile</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Change how others see you in WibeBlock.
                </DialogDescription>
              </DialogHeader>
              <FormField label="Display name">
                <Input defaultValue="Mock User" />
              </FormField>
              <DialogFooter>
                <DialogClose asChild>
                  <Button intent="ghost">Cancel</Button>
                </DialogClose>
                <Button>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button intent="destructive">Delete project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete this project?</DialogTitle>
                <DialogDescription>
                  The project and its history are removed. You can't undo this.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button intent="ghost">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button intent="destructive">Delete</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>
      <section className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-md">
        <h2 className="text-lg font-semibold">Toast</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            intent="secondary"
            onClick={() => toast({ title: "Profile saved" })}
          >
            Show toast
          </Button>
          <Button
            intent="secondary"
            onClick={() =>
              toast({
                title: "Project created",
                description: "You can start adding blocks.",
                tone: "success",
              })
            }
          >
            Success toast
          </Button>
          <Button
            intent="destructive"
            onClick={() =>
              toast({
                title: "Couldn't save",
                description: "Check your connection and try again.",
                tone: "destructive",
              })
            }
          >
            Error toast
          </Button>
        </div>
      </section>
    </main>
  );
}
