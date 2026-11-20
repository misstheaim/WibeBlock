import { cva } from "class-variance-authority";

export const dialogOverlayVariants = cva([
  "fixed inset-0 z-50 bg-background/70 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
]);

export const dialogContentVariants = cva([
  "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-safe:data-[state=closed]:zoom-out-95 motion-safe:data-[state=open]:zoom-in-95 sm:max-w-lg",
]);

export const dialogCloseVariants = cva(["absolute top-4 right-4"]);

export const dialogHeaderVariants = cva([
  "flex flex-col gap-1.5 pr-8 text-left",
]);

export const dialogFooterVariants = cva([
  "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
]);

export const dialogTitleVariants = cva(["text-lg leading-none font-semibold"]);

export const dialogDescriptionVariants = cva(["text-sm text-muted-foreground"]);
