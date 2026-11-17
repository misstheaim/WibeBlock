import type { VariantProps } from "class-variance-authority";
import { useContext, type ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { inputVariants } from "./inputVariants";
import { FormFieldContext } from "../form-field/FormFieldContext";

export type InputProps = Omit<ComponentProps<"input">, "size"> & {
  loading?: boolean;
} & VariantProps<typeof inputVariants>;

export function Input({
  className,
  size,
  loading = false,
  disabled,
  ...rest
}: InputProps) {
  const fieldContext = useContext(FormFieldContext);
  return (
    <input
      className={cn(inputVariants({ size }), className)}
      disabled={loading || disabled}
      {...fieldContext}
      {...rest}
    />
  );
}
