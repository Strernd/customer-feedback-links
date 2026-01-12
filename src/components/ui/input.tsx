import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full h-10 px-3
            bg-background
            border border-border rounded-lg
            text-base md:text-sm text-foreground placeholder:text-muted
            transition-[border-color,box-shadow] duration-150
            hover:border-[#444]
            focus-visible:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border
            ${error ? "border-error focus-visible:border-error focus-visible:ring-error" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
