import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { AuthLayout } from "@/features/auth/auth-layout";
import { useAuth } from "@/features/auth/auth-context";
import { AuthLink } from "@/features/auth/password-field";
import { hasErrors, validateEmailOnly } from "@/features/auth/validation";

export function ForgotPasswordPage() {
  const { beginReset } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ReturnType<typeof validateEmailOnly>>({});
  const [formError, setFormError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = validateEmailOnly(email);
    setErrors(next);
    setFormError("");
    if (hasErrors(next)) return;
    const message = beginReset(email);
    if (message) {
      setFormError(message);
      return;
    }
    navigate("/verify-otp");
  };

  return (
    <AuthLayout title="Forgot password" subtitle="We'll send a 6-digit code to the email on the account.">
      <form className="grid gap-4" onSubmit={submit} noValidate>
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          error={errors.email}
          onChange={(event) => setEmail(event.target.value)}
        />
        {formError ? (
          <p role="alert" className="text-sm font-semibold text-bad">
            {formError}
          </p>
        ) : null}
        <Button type="submit" variant="primary" className="h-11 w-full">
          Send code
        </Button>
        <p className="text-center text-sm text-muted">
          Remembered it? <AuthLink onClick={() => navigate("/sign-in")}>Sign in</AuthLink>
        </p>
      </form>
    </AuthLayout>
  );
}
