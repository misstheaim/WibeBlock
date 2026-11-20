import { cva } from "class-variance-authority";
import { popoverAnimationStyles } from "../../lib/overlayStyles";

export const dropdownMenuContentVariants = cva([
  popoverAnimationStyles,
  "z-50 min-w-40 overflow-hidden rounded-md border border-border bg-card p-1 text-card-foreground shadow-md",
]);

export const dropdownMenuItemVariants = cva(
  [
    "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      intent: {
        default: "",
        destructive:
          "text-destructive data-[highlighted]:bg-destructive data-[highlighted]:text-destructive-foreground",
      },
    },
    defaultVariants: { intent: "default" },
  },
);

export const dropdownMenuRadioItemVariants = cva(["pl-8"]);

export const dropdownMenuIndicatorVariants = cva([
  "absolute left-2 flex size-4 items-center justify-center",
]);

export const dropdownMenuLabelVariants = cva([
  "px-2 py-1.5 text-xs font-medium text-muted-foreground",
]);

export const dropdownMenuSeparatorVariants = cva(["-mx-1 my-1 h-px bg-border"]);
