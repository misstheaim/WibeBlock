import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { labelVariants } from "./labelVariants";

export type LabelProps = ComponentProps<"label"> &
  VariantProps<typeof labelVariants>;

export function Label({ className, ...rest }: LabelProps) {
  return <label className={cn(labelVariants(), className)} {...rest} />;
}
