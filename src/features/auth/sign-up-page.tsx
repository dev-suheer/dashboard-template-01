import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { AuthLayout } from "@/features/auth/auth-layout";
import { useAuth } from "@/features/auth/auth-context";
import { AuthLink, PasswordField } from "@/features/auth/password-field";
import { hasErrors, validateSignUp } from "@/features/auth/validation";

export function SignUpPage() {
  const { beginSignup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<ReturnType<typeof validateSignUp>>({});
  const [formError, setFormError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = validateSignUp({ name, email, phone, password, confirm });
    setErrors(next);
    setFormError("");
    if (hasErrors(next)) return;
    const message = beginSignup({ name, email, phone, password });
    if (message) {
      setFormError(message);
      return;
    }
    navigate("/verify-otp");
  };

  return (
    <AuthLayout title="Create account" subtitle="We'll send a 6-digit code before opening the desk.">
      <form className="grid gap-4" onSubmit={submit} noValidate>
        <TextField
          label="Full name"
          name="name"
          autoComplete="name"
          placeholder="User"
          value={name}
          error={errors.name}
          onChange={(event) => setName(event.target.value)}
        />
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
        <TextField
          label="Phone number"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+44 7700 900418"
          value={phone}
          error={errors.phone}
          onChange={(event) => setPhone(event.target.value)}
        />
        <PasswordField
          label="Password"
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
          placeholder="Repeat your password"
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
          Continue
        </Button>
        <p className="text-center text-sm text-muted">
          Already have an account? <AuthLink onClick={() => navigate("/sign-in")}>Sign in</AuthLink>
        </p>
      </form>
    </AuthLayout>
  );
}
