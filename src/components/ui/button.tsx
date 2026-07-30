import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "border text-sm",
    ghost: "text-sm",
    danger: "text-sm",
  };

  const variantColors: Record<string, React.CSSProperties> = {
    outline: { borderColor: "var(--border-color)", color: "var(--text-primary)" },
    ghost: { color: "var(--text-secondary)" },
    danger: { background: "#EF4444", color: "#FFFFFF" },
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(
        "rounded-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizes[size],
        className
      )}
      style={variantColors[variant]}
      {...props}
    >
      {children}
    </button>
  );
}
