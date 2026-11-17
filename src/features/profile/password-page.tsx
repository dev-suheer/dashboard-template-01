import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-context";
import { PasswordField } from "@/features/auth/password-field";
import { hasErrors, validatePasswordChange } from "@/features/auth/validation";
import { useToast } from "@/lib/toast";

export function PasswordPage() {
  const { changePassword } = useAuth();
  const { push } = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<ReturnType<typeof validatePasswordChange>>({});
  const [formError, setFormError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const fieldErrors = validatePasswordChange({ current, next, confirm });
    setErrors(fieldErrors);
    setFormError("");
    if (hasErrors(fieldErrors)) return;
    const message = changePassword(current, next);
    if (message) {
      setFormError(message);
      return;
    }
    setCurrent("");
    setNext("");
    setConfirm("");
    push("Password updated.");
  };

  return (
    <form className="card grid max-w-[640px] gap-4 p-5 sm:p-6" onSubmit={submit} noValidate>
      <PasswordField
        label="Current password"
        name="current-password"
        autoComplete="current-password"
        placeholder="Your current password"
        value={current}
        error={errors.current}
        onChange={setCurrent}
      />
      <PasswordField
        label="New password"
        name="new-password"
        autoComplete="new-password"
        placeholder="At least 6 characters"
        value={next}
        error={errors.next}
        onChange={setNext}
      />
      <PasswordField
        label="Confirm new password"
        name="confirm-password"
        autoComplete="new-password"
        placeholder="Repeat your new password"
        value={confirm}
        error={errors.confirm}
        onChange={setConfirm}
      />
      {formError ? (
        <p role="alert" className="text-sm font-semibold text-bad">
          {formError}
        </p>
      ) : null}
      <div>
        <Button type="submit" variant="primary">
          Update password
        </Button>
      </div>
    </form>
  );
}
