import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type FieldProps = {
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

export function Field({ label, hint, error, className, children }: FieldProps) {
  return (
    <label className={cn("grid gap-1.5 text-sm", className)}>
      {label ? <span className="font-semibold text-ink-2">{label}</span> : null}
      {children}
      {error ? (
        <span role="alert" className="text-xs font-semibold text-bad">
          {error}
        </span>
      ) : hint ? (
        <span className="text-xs text-muted">{hint}</span>
      ) : null}
    </label>
  );
}

const control =
  "h-10 w-full rounded-full bg-card px-3.5 text-md text-ink shadow-raise ring-1 ring-line-strong outline-none transition-[box-shadow,background-color] placeholder:text-muted focus:ring-2 focus:ring-accent disabled:opacity-60";

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  hint?: string;
  error?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  fieldClassName?: string;
};

export function TextField({
  label,
  hint,
  error,
  leading,
  trailing,
  className,
  fieldClassName,
  id,
  ...props
}: TextFieldProps) {
  const generated = useId();
  const fieldId = id ?? generated;

  return (
    <Field label={label} hint={hint} error={error} className={fieldClassName}>
      <span
        className={cn(
          "relative flex items-center",
          error && "is-shake",
        )}
      >
        {leading ? (
          <span className="pointer-events-none absolute left-3.5 text-muted">{leading}</span>
        ) : null}
        <input
          id={fieldId}
          aria-invalid={error ? true : undefined}
          className={cn(control, leading && "pl-10", trailing && "pr-16", className)}
          {...props}
        />
        {trailing ? <span className="absolute right-3 text-muted">{trailing}</span> : null}
      </span>
    </Field>
  );
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
  error?: string;
  fieldClassName?: string;
};

export function SelectField({
  label,
  hint,
  error,
  className,
  fieldClassName,
  children,
  id,
  ...props
}: SelectFieldProps) {
  const generated = useId();
  const fieldId = id ?? generated;

  return (
    <Field label={label} hint={hint} error={error} className={fieldClassName}>
      <select
        id={fieldId}
        aria-invalid={error ? true : undefined}
        className={cn(control, "appearance-none bg-[length:12px] bg-[right_14px_center] bg-no-repeat pr-9", error && "is-shake", className)}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath fill='none' stroke='%2355606b' stroke-width='1.5' stroke-linecap='round' d='M1 1.5 6 6.5 11 1.5'/%3E%3C/svg%3E\")",
        }}
        {...props}
      >
        {children}
      </select>
    </Field>
  );
}
