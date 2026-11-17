import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/app-shell";
import { TimesheetsPage } from "@/features/attendance/timesheets-page";
import { ForgotPasswordPage } from "@/features/auth/forgot-password-page";
import { GuestOnly, RequireAuth } from "@/features/auth/auth-context";
import { ResetPasswordPage } from "@/features/auth/reset-password-page";
import { SignInPage } from "@/features/auth/sign-in-page";
import { SignUpPage } from "@/features/auth/sign-up-page";
import { VerifyOtpPage } from "@/features/auth/verify-otp-page";
import { CrewPage } from "@/features/crew/crew-page";
import { InsightsPage } from "@/features/insights/insights-page";
import { OverviewPage } from "@/features/overview/overview-page";
import { HistoryPage } from "@/features/payroll/history-page";
import { PayRunPage } from "@/features/payroll/pay-run-page";
import { PayrollLayout } from "@/features/payroll/payroll-layout";
import { PayslipsPage } from "@/features/payroll/payslips-page";
import { GoalsPage } from "@/features/performance/goals-page";
import { ProfileIndex, ProfileLayout } from "@/features/profile/profile-layout";
import { GeneralPage } from "@/features/profile/general-page";
import { PasswordPage } from "@/features/profile/password-page";
import { FaqPage } from "@/features/support/faq-page";
import { PrivacyPage } from "@/features/support/privacy-page";
import { SupportLayout } from "@/features/support/support-layout";
import { SupportPage } from "@/features/support/support-page";
import { TermsPage } from "@/features/support/terms-page";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestOnly />}>
        <Route path="sign-in" element={<SignInPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="verify-otp" element={<VerifyOtpPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>
      <Route element={<RequireAuth />}>
      <Route element={<AppShell />}>
        <Route index element={<OverviewPage />} />
        <Route path="crew" element={<CrewPage />} />
        <Route path="attendance">
          <Route index element={<Navigate to="timesheets" replace />} />
          <Route path="timesheets" element={<TimesheetsPage />} />
        </Route>
        <Route path="payroll" element={<PayrollLayout />}>
          <Route index element={<Navigate to="run" replace />} />
          <Route path="run" element={<PayRunPage />} />
          <Route path="payslips" element={<PayslipsPage />} />
          <Route path="history" element={<HistoryPage />} />
        </Route>
        <Route path="performance">
          <Route index element={<Navigate to="goals" replace />} />
          <Route path="goals" element={<GoalsPage />} />
        </Route>
        <Route path="insights" element={<InsightsPage />} />
        <Route path="support" element={<SupportLayout />}>
          <Route index element={<SupportPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
        </Route>
        <Route path="profile" element={<ProfileLayout />}>
          <Route index element={<ProfileIndex />} />
          <Route path="general" element={<GeneralPage />} />
          <Route path="password" element={<PasswordPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      </Route>
    </Routes>
  );
}
