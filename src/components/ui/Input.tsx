"use client";

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, useId } from "react";
import { cn } from "@/lib/utils";

/* ============================================================
   Input — Form input with label, error state, textarea variant
   ============================================================ */

interface InputBaseProps {
  label?: string;
  error?: string;
  textarea?: boolean;
  rows?: number;
  wrapperClassName?: string;
}

type InputProps = InputBaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, keyof InputBaseProps> &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof InputBaseProps>;

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      label,
      error,
      textarea = false,
      rows = 4,
      wrapperClassName,
      className,
      id: externalId,
      required,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const id = externalId || generatedId;
    const errorId = `${id}-error`;

    const inputClasses = cn(
      "w-full rounded-md border bg-white px-4 py-2.5",
      "font-sans text-sm text-primary-text placeholder:text-secondary-text/60",
      "transition-colors duration-200",
      "focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent",
      "disabled:bg-surface disabled:cursor-not-allowed disabled:opacity-60",
      error
        ? "border-red-500 focus:ring-red-500/40 focus:border-red-500"
        : "border-borders hover:border-accent/40",
      className
    );

    return (
      <div className={cn("space-y-1.5", wrapperClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-primary-text"
          >
            {label}
            {required && (
              <span className="text-red-500 ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        {textarea ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={id}
            rows={rows}
            className={cn(inputClasses, "resize-y min-h-[80px]")}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            required={required}
            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            id={id}
            className={inputClasses}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            required={required}
            {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}

        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
