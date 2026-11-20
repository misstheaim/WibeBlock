import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import {
  buttonContentVariants,
  buttonSpinnerVariants,
  buttonVariants,
} from "./buttonVariants";
import { Spinner } from "../spinner";

export type ButtonProps = ComponentProps<"button"> & {
  loading?: boolean;
} & VariantProps<typeof buttonVariants>;

export function Button({
  className,
  intent,
  size,
  loading = false,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ intent, size }), className)}
    >
      <span className={cn(buttonContentVariants({ loading }))}>{children}</span>

      {loading && <Spinner size="sm" className={buttonSpinnerVariants()} />}
    </button>
  );
}
