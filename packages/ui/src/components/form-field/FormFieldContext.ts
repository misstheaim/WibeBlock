import { createContext } from "react";

export type FormFieldContextValue = {
  id: string;
  "aria-describedby": string | undefined;
  "aria-invalid": boolean | undefined;
};
export const FormFieldContext = createContext<FormFieldContextValue | null>(
  null,
);
