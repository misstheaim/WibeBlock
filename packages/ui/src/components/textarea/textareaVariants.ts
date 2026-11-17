import { cva } from "class-variance-authority";
import { controlStyles } from "../../lib/controlStyles";

export const textareaVariants = cva([
  controlStyles,
  "min-h-20 resize-y px-3 py-2 text-sm",
]);
