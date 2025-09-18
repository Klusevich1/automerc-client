import type { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

type RHFError =
  | FieldError
  | Merge<FieldError, FieldErrorsImpl<any>>
  | undefined;

export function getErrorMessage(err: RHFError): string | undefined {
  if (!err) return undefined;
  if ("message" in err && typeof err.message === "string") return err.message;
  return undefined;
}
