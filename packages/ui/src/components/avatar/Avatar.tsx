import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import {
  avatarFallbackVariants,
  avatarImageVariants,
  avatarVariants,
} from "./avatarVariants";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { getAvatarTone, getInitials } from "./avatarUtils";

export type AvatarProps = ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants>;

export function Avatar({ className, size, ...rest }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      className={cn(avatarVariants({ size }), className)}
      {...rest}
    />
  );
}

export function AvatarImage({
  className,
  ...rest
}: ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      className={cn(avatarImageVariants(), className)}
      {...rest}
    />
  );
}

export function AvatarFallback({
  className,
  name,
  tone,
  children,
  ...rest
}: ComponentProps<typeof AvatarPrimitive.Fallback> &
  VariantProps<typeof avatarFallbackVariants> & { name?: string }) {
  const rTone = tone ?? (name ? getAvatarTone(name) : undefined);

  return (
    <AvatarPrimitive.Fallback
      className={cn(avatarFallbackVariants({ tone: rTone }), className)}
      {...rest}
    >
      {children ?? (name && getInitials(name))}
    </AvatarPrimitive.Fallback>
  );
}
