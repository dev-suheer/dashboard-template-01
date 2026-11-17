import { Outlet, useLocation } from "react-router-dom";
import { PageHeader } from "@/components/ui/surface";

const headings: Record<string, { title: string; subtitle: string }> = {
  "/support": {
    title: "Support",
    subtitle: "Requests sent to you.",
  },
  "/support/faq": {
    title: "FAQ",
    subtitle: "A short list of the questions people ask most.",
  },
  "/support/terms": {
    title: "Terms of Service",
    subtitle: "Please read these terms and conditions carefully before using our platform.",
  },
  "/support/privacy": {
    title: "Privacy Policy",
    subtitle: "Please read this privacy policy carefully before using our platform.",
  },
};

export function SupportLayout() {
  const { pathname } = useLocation();
  const heading = headings[pathname] ?? headings["/support"];
  return (
    <>
      <PageHeader title={heading.title} subtitle={heading.subtitle} />
      <Outlet />
    </>
  );
}
