import type { IconName } from "@/components/icons";

/**
 * Single-desk navigation. `roles` is reserved so a later super-admin / user
 * split can filter this list without moving routes.
 */
export type NavItem = {
  id: string;
  label: string;
  to: string;
  icon: IconName;
  badge?: number;
  /** Red count. Soft gray when omitted. */
  badgeTone?: "bad" | "accent";
  section: "Crew desk" | "People ops" | "Admin";
  roles?: Array<"admin" | "member">;
  crumb: string;
  children?: { id: string; label: string; to: string }[];
};

export const navigation: NavItem[] = [
  { id: "overview", label: "Overview", to: "/", icon: "overview", section: "Crew desk", crumb: "Overview" },
  { id: "crew", label: "Crew", to: "/crew", icon: "crew", section: "Crew desk", crumb: "Crew" },
  {
    id: "attendance",
    label: "Attendance",
    to: "/attendance",
    icon: "clock",
    badge: 26,
    badgeTone: "bad",
    section: "Crew desk",
    crumb: "Attendance",
  },
  { id: "payroll", label: "Payroll", to: "/payroll", icon: "wallet", section: "People ops", crumb: "Payroll" },
  {
    id: "performance",
    label: "Performance",
    to: "/performance",
    icon: "target",
    section: "People ops",
    crumb: "Performance",
  },
  { id: "insights", label: "Insights", to: "/insights", icon: "chart", section: "Admin", crumb: "Insights" },
  {
    id: "settings",
    label: "Settings",
    to: "/support",
    icon: "settings",
    section: "Admin",
    crumb: "Settings",
    children: [
      { id: "support", label: "Support", to: "/support" },
      { id: "faq", label: "FAQ", to: "/support/faq" },
      { id: "terms", label: "Terms", to: "/support/terms" },
      { id: "privacy", label: "Privacy", to: "/support/privacy" },
    ],
  },
];

export const supportTabs = [
  { to: "/support", label: "Help", end: true },
  { to: "/support/faq", label: "FAQ" },
  { to: "/support/terms", label: "Terms" },
  { to: "/support/privacy", label: "Privacy policy" },
];

export const payrollTabs = [
  { to: "/payroll/run", label: "Pay run" },
  { to: "/payroll/payslips", label: "Payslips" },
  { to: "/payroll/history", label: "History" },
];
