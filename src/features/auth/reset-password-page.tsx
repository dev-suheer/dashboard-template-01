import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/features/auth/auth-layout";
import { useAuth } from "@/features/auth/auth-context";
import { PasswordField } from "@/features/auth/password-field";
import { hasErrors, validateReset } from "@/features/auth/validation";
import { useToast } from "@/lib/toast";

export function ResetPasswordPage() {
  const { challenge, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { push } = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<ReturnType<typeof validateReset>>({});
  const [formError, setFormError] = useState("");

  if (!challenge || challenge.purpose !== "reset" || !challenge.verified) {
    return <Navigate to="/forgot-password" replace />;
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = validateReset({ password, confirm });
    setErrors(next);
    setFormError("");
    if (hasErrors(next)) return;
    const message = resetPassword(password);
    if (message) {
      setFormError(message);
      return;
    }
    push("Password updated. You're signed in.");
    navigate("/", { replace: true });
  };

  return (
    <AuthLayout title="Reset password" subtitle={`Choose a new password for ${challenge.email}.`}>
      <form className="grid gap-4" onSubmit={submit} noValidate>
        <PasswordField
          label="New password"
          name="new-password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          value={password}
          error={errors.password}
          onChange={setPassword}
        />
        <PasswordField
          label="Confirm password"
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
        <Button type="submit" variant="primary" className="h-11 w-full">
          Save password
        </Button>
      </form>
    </AuthLayout>
  );
}
