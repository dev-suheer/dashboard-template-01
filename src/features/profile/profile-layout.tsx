import { Navigate, Outlet } from "react-router-dom";
import { PageHeader } from "@/components/ui/surface";
import { SectionTabs } from "@/components/ui/section-tabs";

export function ProfileLayout() {
  return (
    <div className="grid gap-5">
      <PageHeader title="Profile" subtitle="Your name, contact details, and password." />
      <SectionTabs
        items={[
          { to: "/profile/general", label: "General" },
          { to: "/profile/password", label: "Change password" },
        ]}
      />
      <Outlet />
    </div>
  );
}

export function ProfileIndex() {
  return <Navigate to="/profile/general" replace />;
}
