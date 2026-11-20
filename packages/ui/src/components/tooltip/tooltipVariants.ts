import { cva } from "class-variance-authority";
import { popoverAnimationStyles } from "../../lib/overlayStyles";

export const tooltipContentVariants = cva([
  popoverAnimationStyles,
  "z-50 max-w-xs rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-md",
]);
