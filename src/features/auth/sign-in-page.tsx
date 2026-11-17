import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { AuthLayout } from "@/features/auth/auth-layout";
import { useAuth } from "@/features/auth/auth-context";
import { AuthLink, PasswordField } from "@/features/auth/password-field";
import { hasErrors, validateSignIn } from "@/features/auth/validation";

export function SignInPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/";
  const [email, setEmail] = useState("user@gmail.com");
  const [password, setPassword] = useState("112233");
  const [errors, setErrors] = useState<ReturnType<typeof validateSignIn>>({});
  const [formError, setFormError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = validateSignIn({ email, password });
    setErrors(next);
    setFormError("");
    if (hasErrors(next)) return;
    const message = signIn(email, password);
    if (message) {
      setFormError(message);
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <AuthLayout title="Sign in" subtitle="Use the crew desk account for this device.">
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
        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={password}
          error={errors.password}
          onChange={setPassword}
        />
        <div className="flex justify-end">
          <AuthLink onClick={() => navigate("/forgot-password")}>Forgot password?</AuthLink>
        </div>
        {formError ? (
          <p role="alert" className="text-sm font-semibold text-bad">
            {formError}
          </p>
        ) : null}
        <Button type="submit" variant="primary" className="h-11 w-full">
          Sign in
        </Button>
        <p className="text-center text-sm text-muted">
          New here? <AuthLink onClick={() => navigate("/sign-up")}>Create an account</AuthLink>
        </p>
      </form>
    </AuthLayout>
  );
}
