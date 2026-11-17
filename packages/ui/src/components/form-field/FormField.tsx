import type { VariantProps } from "class-variance-authority";
import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import {
  formFieldErrorVariants,
  formFieldHintVariants,
  formFieldVariants,
} from "./formFieldVariants";
import { Label } from "../label";
import { FormFieldContext } from "./FormFieldContext";

export type FormFieldProps = ComponentProps<"div"> & {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
} & VariantProps<typeof formFieldVariants>;

export function FormField({
  className,
  label,
  hint,
  error,
  children,
  ...rest
}: FormFieldProps) {
  const id = useId();
  const controlId = id + "-control";
  const hintId = id + "-hint";
  const errorId = id + "-error";
  const ariaDescribedly =
    [error && errorId, hint && hintId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn(formFieldVariants(), className)} {...rest}>
      <Label htmlFor={controlId}>{label}</Label>
      <FormFieldContext
        value={{
          id: controlId,
          "aria-describedby": ariaDescribedly,
          "aria-invalid": error ? true : undefined,
        }}
      >
        {children}
      </FormFieldContext>
      {hint && (
        <p id={hintId} className={cn(formFieldHintVariants())}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={cn(formFieldErrorVariants())}>
          {error}
        </p>
      )}
    </div>
  );
}
