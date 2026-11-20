import { cva } from "class-variance-authority";

export const spinnerVariants = cva([
  "inline-flex shrink-0 items-center justify-center",
]);

export const spinnerIconVariants = cva(
  ["animate-spin motion-reduce:animate-none"],
  {
    variants: {
      size: { sm: "size-4", md: "size-5", lg: "size-6" },
    },
    defaultVariants: { size: "md" },
  },
);

export const spinnerLabelVariants = cva(["sr-only"]);
