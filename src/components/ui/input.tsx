import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ className, label, error, id, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "input",
          error && "border-error focus:ring-error/50",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm mt-1" style={{ color: "var(--error)" }}>{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ className, label, error, id, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          "input resize-none",
          error && "border-error focus:ring-error/50",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm mt-1" style={{ color: "var(--error)" }}>{error}</p>}
    </div>
  );
}
