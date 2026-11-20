import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { skeletonVariants } from "./skeletonVariants";

export type SkeletonProps = ComponentProps<"div"> &
  VariantProps<typeof skeletonVariants>;

export function Skeleton({ className, ...rest }: SkeletonProps) {
  return (
    <div aria-hidden className={cn(skeletonVariants(), className)} {...rest} />
  );
}
