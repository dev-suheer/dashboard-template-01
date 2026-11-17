import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { navigation, supportTabs } from "@/app/navigation";
import { Icon } from "@/components/icons";
import { useShell } from "@/components/layout/shell-context";
import { Button, IconButton } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import { SearchField } from "@/components/ui/search-field";
import { people } from "@/data/people";
import { defaultAvatar, useAuth } from "@/features/auth/auth-context";
import { cn } from "@/lib/cn";

const clock = new Intl.DateTimeFormat("en-GB", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

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

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export function Topbar({ onSearch }: { onSearch: () => void }) {
  const now = useClock();
  const { user, signOut } = useAuth();
  const { pathname } = useLocation();
  const { setMobileOpen } = useShell();
  const navigate = useNavigate();
  const onProfile = pathname.startsWith("/profile");
  const section = navigation.find((item) =>
    item.to === "/" ? pathname === "/" : pathname.startsWith(item.to),
  );
  const leaf = pathname.split("/").filter(Boolean).at(-1);
  const child = onProfile
    ? pathname.endsWith("/password")
      ? "Change password"
      : null
    : leaf && crumbs[leaf] && crumbs[leaf] !== section?.label
      ? crumbs[leaf]
      : null;
  const crumb = onProfile ? "Profile" : (section?.crumb ?? "Overview");
  const avatar = user?.avatar || defaultAvatar;

  return (
    <header className="sticky top-0 z-20 bg-canvas px-4 sm:px-6 md:pl-3">
      <div className="flex h-[68px] items-center gap-3">
        <IconButton label="Open menu" className="md:hidden" onClick={() => setMobileOpen(true)}>
          <Icon name="menu" />
        </IconButton>

        <nav aria-label="Breadcrumb" className="hidden min-w-[92px] shrink-0 items-center gap-2 text-[15px] font-semibold sm:flex">
          <span className={cn("truncate", child ? "text-muted" : "text-ink")}>{crumb}</span>
          {child ? (
            <>
              <span className="text-out">/</span>
              <span className="truncate text-ink">{child}</span>
            </>
          ) : null}
        </nav>

        <div className="mx-auto hidden w-full max-w-[460px] md:block">
          <SearchField
            aria-label="Search"
            placeholder="Search crew, sailings, requests..."
            shortcut="⌘K"
            readOnly
            onClick={onSearch}
            onFocus={onSearch}
            className="h-10 bg-card shadow-raise ring-1 ring-line"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <IconButton label="Search" className="md:hidden" onClick={onSearch}>
            <Icon name="search" />
          </IconButton>

          <div className="hidden h-10 items-center gap-2 rounded-full bg-card px-3 text-sm font-semibold shadow-raise ring-1 ring-line lg:flex">
            <span className="size-2 rounded-full bg-good" />
            <span className="tabular-nums">{clock.format(now)}</span>
          </div>


          <Popover
            label="Notifications"
            trigger={() => (
              <span className="relative">
                <IconButton label="Notifications, 3 unread">
                  <Icon name="bell" />
                </IconButton>
                <span className="pointer-events-none absolute top-1.5 right-1.5 grid size-4 place-items-center rounded-full bg-bad text-[9px] font-bold text-white">
                  3
                </span>
              </span>
            )}
          >
            <p className="text-sm font-semibold">Notifications</p>
            <ul className="mt-2 grid gap-2 text-sm text-ink-2">
              <li>Elif Hartley is 30 minutes late on Corran.</li>
              <li>Two sailings this afternoon are short of minimum crew.</li>
              <li>November pay run is ready to review.</li>
            </ul>
          </Popover>

          <Popover
            label="Create"
            trigger={() => (
              <Button variant="primary" size="md" magnetic icon={<Icon name="plus" className="size-4" />} className="hidden h-10 px-4 sm:inline-flex">
                Create
              </Button>
            )}
          >
            <div className="grid gap-1">
              <CreateItem label="Add a person" detail="Crew directory" onClick={() => navigate("/crew")} />
              <CreateItem label="Review a timesheet" detail="Last week’s hours" onClick={() => navigate("/attendance/timesheets")} />
              <CreateItem label="Open the pay run" detail="November, still in review" onClick={() => navigate("/payroll/run")} />
            </div>
          </Popover>

          <Popover
            label="Account"
            panelClassName="w-52"
            trigger={() => (
              <button type="button" aria-label={`${user?.name ?? "Account"} — account`} className="relative grid size-10 cursor-pointer place-items-center overflow-hidden rounded-full bg-h4 text-xs font-bold text-ink">
                <img src={avatar} alt="" className="size-full object-cover" />
              </button>
            )}
          >
            <div className="flex items-center gap-2.5 px-1 pt-1">
              <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-h4">
                <img src={avatar} alt="" className="size-full object-cover" />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-semibold">{user?.name}</span>
                <span className="block truncate text-sm text-muted">{user?.email}</span>
              </span>
            </div>
            <div className="mt-3 grid gap-1">
              <button
                type="button"
                className="cursor-pointer rounded-[12px] px-3 py-2 text-left text-sm font-semibold hover:bg-side-hover"
                onClick={() => navigate("/profile/general")}
              >
                Profile
              </button>
              <button
                type="button"
                className="cursor-pointer rounded-[12px] px-3 py-2 text-left text-sm font-semibold text-bad hover:bg-bad-soft"
                onClick={() => {
                  signOut();
                  navigate("/sign-in", { replace: true });
                }}
              >
                Sign out
              </button>
            </div>
          </Popover>
        </div>
      </div>
    </header>
  );
}

function CreateItem({
  label,
  detail,
  onClick,
}: {
  label: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md px-2 py-2 text-left hover:bg-side-hover"
    >
      <span className="block text-sm font-semibold">{label}</span>
      <span className="block text-xs text-muted">{detail}</span>
    </button>
  );
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pages = navigation
      .filter((item) => !q || item.label.toLowerCase().includes(q))
      .map((item) => ({ id: item.id, label: item.label, detail: "Page", to: item.to === "/attendance" ? "/attendance/timesheets" : item.to === "/payroll" ? "/payroll/run" : item.to === "/performance" ? "/performance/goals" : item.to }));
    const support = supportTabs
      .filter((item) => item.to !== "/support" && (!q || item.label.toLowerCase().includes(q)))
      .map((item) => ({ id: item.to, label: item.label, detail: "Support", to: item.to }));
    const crew = people
      .filter((person) => !q || `${person.name} ${person.role}`.toLowerCase().includes(q))
      .slice(0, 6)
      .map((person) => ({ id: person.id, label: person.name, detail: person.role, to: "/crew" }));
    return [...pages, ...support, ...crew].slice(0, 10);
  }, [query]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-center bg-overlay px-4 pt-[12vh]" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-label="Search"
        className="rise-in h-fit w-full max-w-xl rounded-xl bg-card p-3 shadow-pop"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <SearchField
          autoFocus
          placeholder="Search crew, sailings, requests…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search the desk"
        />
        <ul className="mt-2 max-h-[min(52vh,420px)] overflow-auto">
          {results.map((result) => (
            <li key={result.id}>
              <button
                type="button"
                className={cn("flex w-full items-center justify-between rounded-md px-3 py-2 text-left hover:bg-side-hover")}
                onClick={() => {
                  navigate(result.to);
                  onClose();
                  setQuery("");
                }}
              >
                <span className="font-semibold">{result.label}</span>
                <span className="text-xs text-muted">{result.detail}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
