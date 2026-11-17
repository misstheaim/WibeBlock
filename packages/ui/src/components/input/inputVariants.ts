import { cva } from "class-variance-authority";
import { controlStyles } from "../../lib/controlStyles";

export const inputVariants = cva(controlStyles, {
  variants: {
    size: {
      sm: "h-8 px-2.5 text-sm",
      md: "h-10 px-3 text-sm",
      lg: "h-12 px-4 text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
