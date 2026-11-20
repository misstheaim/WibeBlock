import { cva } from "class-variance-authority";

export const toastVariants = cva(
  [
    "pointer-events-auto relative grid w-full gap-1 overflow-hidden rounded-lg border p-4 pr-12 shadow-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none motion-safe:data-[state=closed]:slide-out-to-right-full motion-safe:data-[state=open]:slide-in-from-bottom-full",
  ],
  {
    variants: {
      tone: {
        default: "border-border bg-card text-card-foreground",
        success: "border-success bg-success text-success-foreground",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: { tone: "default" },
  },
);

export const toastViewportVariants = cva([
  "fixed right-0 bottom-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 outline-hidden sm:max-w-sm",
]);

export const toastTitleVariants = cva(["text-sm font-semibold"]);

export const toastDescriptionVariants = cva(["text-sm opacity-90"]);

export const toastCloseVariants = cva([
  "absolute top-2 right-2 text-current opacity-70 hover:bg-transparent hover:text-current hover:opacity-100",
]);
