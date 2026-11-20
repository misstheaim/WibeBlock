import { cva } from "class-variance-authority";

export const avatarVariants = cva(
  ["relative flex shrink-0 overflow-hidden rounded-full"],
  {
    variants: {
      size: {
        sm: "size-8 text-xs",
        md: "size-10 text-sm",
        lg: "size-12 text-base",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export const avatarImageVariants = cva([
  "aspect-square size-full object-cover",
]);

export const avatarFallbackVariants = cva(
  ["flex size-full items-center justify-center font-medium"],
  {
    variants: {
      tone: {
        neutral: "bg-muted text-muted-foreground",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        accent: "bg-accent text-accent-foreground",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);
