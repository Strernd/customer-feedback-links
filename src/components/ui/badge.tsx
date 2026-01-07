type BadgeVariant = "default" | "positive" | "neutral" | "negative";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-card text-muted border-border",
  positive: "bg-success-bg text-success border-success/20",
  neutral: "bg-warning-bg text-warning border-warning/20",
  negative: "bg-error-bg text-error border-error/20",
};

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-2.5 py-0.5
        text-xs font-medium
        rounded-full border
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
