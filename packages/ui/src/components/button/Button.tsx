import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { buttonVariants } from "./buttonVariants";

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, intent, size, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(buttonVariants({ intent, size }), className)}
    />
  );
}
