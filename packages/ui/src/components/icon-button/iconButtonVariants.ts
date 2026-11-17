import { cva } from "class-variance-authority";

export const iconButtonVariants = cva("", {
  variants: {
    size: {
      sm: "size-8 px-0 [&_svg]:size-4",
      md: "size-10 px-0 [&_svg]:size-4",
      lg: "size-12 px-0 [&_svg]:size-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
