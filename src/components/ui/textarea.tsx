import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full min-h-[120px] px-3 py-3
            bg-background
            border border-border rounded-lg
            text-base md:text-sm text-foreground placeholder:text-muted
            transition-[border-color,box-shadow] duration-150
            hover:border-[#444]
            focus-visible:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border
            resize-y
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

Textarea.displayName = "Textarea";
