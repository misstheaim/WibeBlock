import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { buttonVariants } from "./buttonVariants";
import { LoaderCircle } from "lucide-react";

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
      <span
        className={cn("inline-flex items-center gap-2", loading && "opacity-0")}
      >
        {children}
      </span>

      {loading && (
        <LoaderCircle
          aria-hidden
          className="absolute size-4 animate-spin motion-reduce:animate-none"
        />
      )}
    </button>
  );
}
