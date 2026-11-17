import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { navigation } from "@/app/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { useShell } from "@/components/layout/shell-context";
import { CommandPalette, Topbar } from "@/components/layout/topbar";
import { cn } from "@/lib/cn";

const crumbs: Record<string, string> = {
  timesheets: "Timesheets",
  run: "Pay run",
  payslips: "Payslips",
  history: "History",
  goals: "Goals",
  support: "Support",
  faq: "FAQ",
  terms: "Terms of Service",
  privacy: "Privacy policy",
};

export function AppShell() {
  const { pathname } = useLocation();
  const { rail } = useShell();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/profile")) {
      document.title = pathname.endsWith("/password")
        ? "Change password — Temp01"
        : "Profile — Temp01";
      return;
    }
    const section = navigation.find((item) =>
      item.to === "/" ? pathname === "/" : pathname.startsWith(item.to),
    );
    const leaf = pathname.split("/").filter(Boolean).at(-1);
    const child = leaf && crumbs[leaf];
    document.title =
      child && child !== section?.label
        ? `${child} — Temp01`
        : `${section?.label ?? "Overview"} — Temp01`;
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex h-dvh overflow-hidden bg-canvas text-ink">
      <Sidebar />
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col transition-[padding] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:pl-[80px]",
          !rail && "xl:pl-[262px]",
        )}
      >
        <Topbar onSearch={() => setSearchOpen(true)} />
        <main id="main" className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
          <div
            key={pathname}
            className={cn(
              "page-in mr-auto flex w-full min-w-0 max-w-[1440px] flex-col gap-4 px-4 py-5 md:pr-6 md:pl-5 lg:pr-7 [&>*]:min-w-0 [&_.card]:min-w-0",
              !rail && "xl:pl-3",
            )}
          >
            <Outlet />
          </div>
        </main>
      </div>
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
