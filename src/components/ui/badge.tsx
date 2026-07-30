import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "gold" | "silver" | "bronze";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variantStyles: Record<string, React.CSSProperties> = {
    default: { background: "var(--bg-card)", color: "var(--text-secondary)" },
    success: { background: "rgba(16, 185, 129, 0.15)", color: "#34D399" },
    warning: { background: "rgba(245, 158, 11, 0.15)", color: "#FBBF24" },
    error: { background: "rgba(239, 68, 68, 0.15)", color: "#F87171" },
    info: { background: "rgba(0, 229, 255, 0.15)", color: "var(--accent-color)" },
    gold: { background: "rgba(255, 215, 0, 0.15)", color: "#FFD700" },
    silver: { background: "rgba(192, 192, 192, 0.15)", color: "#C0C0C0" },
    bronze: { background: "rgba(205, 127, 50, 0.15)", color: "#CD7F32" },
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        className
      )}
      style={variantStyles[variant]}
      {...props}
    >
      {children}
    </span>
  );
}
