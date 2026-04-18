import { cn } from "@/lib/cn";
import * as React from "react";
import { Label } from "./label";

/**
 * Minimal form primitives for Phase 1. Phase 2 onwards will extend this with
 * React Hook Form + Zod integration. The layout decisions here match
 * DESIGN_SYSTEM.md §11: label above, helper above input, error below, required
 * asterisk in danger colour.
 */

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  htmlFor: string;
  helper?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, htmlFor, helper, error, required, optional, children, className, ...props }, ref) => {
    const helperId = helper ? `${htmlFor}-helper` : undefined;
    const errorId = error ? `${htmlFor}-error` : undefined;

    return (
      <div ref={ref} className={cn("flex flex-col gap-1.5", className)} {...props}>
        <div className="flex items-baseline gap-1">
          <Label htmlFor={htmlFor}>
            {label}
            {required ? (
              <span className="ml-0.5 text-danger" aria-hidden>
                *
              </span>
            ) : null}
          </Label>
          {optional && !required ? (
            <span className="text-body-sm text-tertiary">(optional)</span>
          ) : null}
        </div>

        {helper ? (
          <p id={helperId} className="text-body-sm text-tertiary">
            {helper}
          </p>
        ) : null}

        {React.isValidElement(children)
          ? React.cloneElement(
              children as React.ReactElement<{
                id?: string;
                "aria-describedby"?: string;
                "aria-invalid"?: boolean;
              }>,
              {
                id: htmlFor,
                "aria-describedby": errorId ?? helperId,
                "aria-invalid": Boolean(error),
              },
            )
          : children}

        {error ? (
          <p id={errorId} className="text-body-sm text-danger">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
FormField.displayName = "FormField";
