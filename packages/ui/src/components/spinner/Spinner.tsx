import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import {
  spinnerIconVariants,
  spinnerLabelVariants,
  spinnerVariants,
} from "./spinnerVariants";
import { LoaderCircle } from "lucide-react";

export type SpinnerProps = ComponentProps<"span"> &
  VariantProps<typeof spinnerIconVariants> & { label?: string };

export function Spinner({ className, size, label, ...rest }: SpinnerProps) {
  return (
    <span
      className={cn(spinnerVariants(), className)}
      aria-hidden={label ? undefined : true}
      role={label ? "status" : undefined}
      {...rest}
    >
      <LoaderCircle aria-hidden className={spinnerIconVariants({ size })} />
      {label && <span className={spinnerLabelVariants()}>{label}</span>}
    </span>
  );
}
