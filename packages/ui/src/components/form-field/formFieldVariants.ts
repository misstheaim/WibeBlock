import { cva } from "class-variance-authority";

export const formFieldVariants = cva(["grid gap-2"]);
export const formFieldHintVariants = cva(["text-sm text-muted-foreground"]);
export const formFieldErrorVariants = cva([
  "text-sm font-medium text-destructive",
]);
