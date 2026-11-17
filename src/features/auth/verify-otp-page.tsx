import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/features/auth/auth-layout";
import { useAuth } from "@/features/auth/auth-context";
import { OtpInput } from "@/features/auth/otp-input";
import { AuthLink } from "@/features/auth/password-field";
import { validateOtp } from "@/features/auth/validation";
import { useToast } from "@/lib/toast";

export function VerifyOtpPage() {
  const { challenge, verifyCode, resendCode } = useAuth();
  const navigate = useNavigate();
  const { push } = useToast();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  if (!challenge) return <Navigate to="/sign-in" replace />;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const message = validateOtp(code);
    setError(message);
    if (message) return;
    const result = verifyCode(code);
    if (result) {
      setError(result);
      return;
    }
    if (challenge.purpose === "signup") {
      push("Account created. Welcome aboard.");
      navigate("/", { replace: true });
      return;
    }
    navigate("/reset-password", { replace: true });
  };

  return (
    <AuthLayout
      title="Verify code"
      subtitle={challenge.purpose === "signup" ? "Enter the code to finish creating your account." : "Enter the code to choose a new password."}
    >
      <form className="grid gap-4" onSubmit={submit} noValidate>
        <p className="rounded-[14px] bg-accent-soft px-3 py-2.5 text-sm text-ink-2">
          Sent to <span className="font-semibold">{challenge.email}</span>. This template has no mail server, so the code is{" "}
          <span className="font-semibold tabular-nums">{challenge.code}</span>.
        </p>
        <OtpInput value={code} onChange={setCode} error={error} />
        <Button type="submit" variant="primary" className="h-11 w-full">
          Verify
        </Button>
        <p className="text-center text-sm text-muted">
          <AuthLink
            onClick={() => {
              const message = resendCode();
              if (message) {
                setError(message);
                return;
              }
              setCode("");
              setError("");
              push("A new code is ready.");
            }}
          >
            Resend code
          </AuthLink>
        </p>
      </form>
    </AuthLayout>
  );
}
