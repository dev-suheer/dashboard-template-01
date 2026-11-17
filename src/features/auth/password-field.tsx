import { useState, type ReactNode } from "react";
import { TextField } from "@/components/ui/field";

export function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  name,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete: string;
  name: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      label={label}
      name={name}
      type={visible ? "text" : "password"}
      className={visible ? undefined : "password-mask"}
      placeholder={placeholder}
      value={value}
      autoComplete={autoComplete}
      error={error}
      onChange={(event) => onChange(event.target.value)}
      trailing={
        <button
          type="button"
          className="cursor-pointer text-xs font-semibold text-ink-2"
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? "Hide" : "Show"}
        </button>
      }
    />
  );
}

export function AuthLink({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="cursor-pointer font-semibold text-accent-text hover:underline">
      {children}
    </button>
  );
}
