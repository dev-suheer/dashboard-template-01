import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/app/router";
import { ShellProvider } from "@/components/layout/shell-context";
import { AuthProvider } from "@/features/auth/auth-context";
import { ToastProvider } from "@/lib/toast";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ShellProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </ShellProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
