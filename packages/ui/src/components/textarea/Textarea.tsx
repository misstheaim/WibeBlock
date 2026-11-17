import type { VariantProps } from "class-variance-authority";
import { useContext, type ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { textareaVariants } from "./textareaVariants";
import { FormFieldContext } from "../form-field/FormFieldContext";

export type TextareaProps = ComponentProps<"textarea"> & {
  loading?: boolean;
} & VariantProps<typeof textareaVariants>;

export function Textarea({
  className,
  loading = false,
  disabled,
  ...rest
}: TextareaProps) {
  const fieldContext = useContext(FormFieldContext);
  return (
    <textarea
      className={cn(textareaVariants(), className)}
      disabled={loading || disabled}
      {...fieldContext}
      {...rest}
    />
  );
}
