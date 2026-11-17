import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { navigation, supportTabs } from "@/app/navigation";
import { Icon, type IconName } from "@/components/icons";
import { useShell } from "@/components/layout/shell-context";
import { Button, IconButton } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import { StatusPill } from "@/components/ui/surface";
import { SearchField } from "@/components/ui/search-field";
import { people } from "@/data/people";
import { defaultAvatar, useAuth } from "@/features/auth/auth-context";
import { cn } from "@/lib/cn";

const clock = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" });

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

const notifications: Array<{
  id: string;
  title: string;
  body: string;
  time: string;
  area: string;
  tone: "bad" | "warn" | "info";
  icon: IconName;
  to: string;
}> = [
  {
    id: "late",
    title: "Late on watch",
    body: "Elif Hartley is 30 minutes late on Corran.",
    time: "12m",
    area: "Attendance",
    tone: "bad",
    icon: "clock",
    to: "/attendance/timesheets",
  },
  {
    id: "short",
    title: "Short of minimum crew",
    body: "Two sailings this afternoon are below the line.",
    time: "34m",
    area: "Crew",
    tone: "warn",
    icon: "ship",
    to: "/crew",
  },
  {
    id: "pay",
    title: "Pay run ready",
    body: "November’s run is ready to review before Friday.",
    time: "2h",
    area: "Payroll",
    tone: "info",
    icon: "wallet",
    to: "/payroll/run",
  },
];

const noteWell = {
  bad: "bg-bad-soft text-bad",
  warn: "bg-warn-soft text-warn",
  info: "bg-info-soft text-info",
} as const;

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
  const [notesOpen, setNotesOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const unread = notifications.filter((item) => !readIds.includes(item.id));
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
    <>
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

          <div className="hidden h-10 items-center gap-2 rounded-full bg-card px-3.5 text-sm font-semibold shadow-raise ring-1 ring-line lg:flex">
            <span className="size-2 rounded-full bg-good" />
            <span className="tabular-nums">{clock.format(now)}</span>
            <span className="text-muted" aria-hidden>
              ·
            </span>
            <span>{weekday.format(now)}</span>
          </div>


          <span className="relative">
            <IconButton
              label={unread.length ? `Notifications, ${unread.length} unread` : "Notifications"}
              className="bg-card text-ink shadow-raise ring-1 ring-line hover:bg-side-hover"
              onClick={() => setNotesOpen(true)}
            >
              <Icon name="bell" />
            </IconButton>
            {unread.length ? (
              <span className="pointer-events-none absolute top-0 right-0 z-10 grid size-4 translate-x-1/4 -translate-y-1/2 place-items-center rounded-full bg-bad text-[9px] font-bold text-white ring-2 ring-canvas">
                {unread.length}
              </span>
            ) : null}
          </span>

          {/* <Popover
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
          </Popover> */}

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
    <NotificationsDrawer
      open={notesOpen}
      unread={unread.length}
      readIds={readIds}
      onClose={() => setNotesOpen(false)}
      onRead={(id) => setReadIds((current) => (current.includes(id) ? current : [...current, id]))}
      onReadAll={() => setReadIds(notifications.map((item) => item.id))}
      onOpen={(to) => {
        setNotesOpen(false);
        navigate(to);
      }}
    />
    </>
  );
}

function NotificationsDrawer({
  open,
  unread,
  readIds,
  onClose,
  onRead,
  onReadAll,
  onOpen,
}: {
  open: boolean;
  unread: number;
  readIds: string[];
  onClose: () => void;
  onRead: (id: string) => void;
  onReadAll: () => void;
  onOpen: (to: string) => void;
}) {
  const [present, setPresent] = useState(open);
  const closing = present && !open;

  useEffect(() => {
    if (open) setPresent(true);
  }, [open]);

  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(() => setPresent(false), 260);
    return () => window.clearTimeout(timer);
  }, [closing]);

  useEffect(() => {
    if (!present) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [present, open, onClose]);

  if (!present) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Close notifications"
        className={cn("absolute inset-0 cursor-pointer bg-overlay", closing ? "overlay-out" : "overlay-in")}
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="notifications-title"
        className={cn(
          "absolute inset-y-0 right-0 flex w-[min(420px,calc(100vw-20px))] flex-col bg-panel text-ink shadow-pop",
          closing ? "drawer-out" : "drawer-in",
        )}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget && closing) setPresent(false);
        }}
      >
        <div className="flex items-start gap-3 px-5 pt-5 pb-4">
          <div className="min-w-0 flex-1">
            <h2 id="notifications-title" className="text-xl font-bold tracking-tight">
              Notifications
            </h2>
            <p className="mt-1 text-sm text-muted">
              {unread ? `${unread} unread · newest first` : "You’re caught up."}
            </p>
          </div>
          <IconButton label="Close" size="sm" onClick={onClose}>
            <Icon name="close" />
          </IconButton>
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto border-t border-line">
          {notifications.map((item) => {
            const seen = readIds.includes(item.id);
            return (
              <li key={item.id} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => {
                    onRead(item.id);
                    onOpen(item.to);
                  }}
                  className="flex w-full cursor-pointer items-start gap-3 px-5 py-4 text-left hover:bg-side-hover focus-visible:bg-side-hover focus-visible:outline-none"
                >
                  <span className={cn("grid size-10 shrink-0 place-items-center rounded-[13px]", noteWell[item.tone])}>
                    <Icon name={item.icon} className="size-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className={cn("truncate text-sm font-semibold", seen && "text-ink-2")}>{item.title}</span>
                      {seen ? null : <span className="size-1.5 shrink-0 rounded-full bg-accent" />}
                      <span className="ml-auto shrink-0 text-xs font-semibold text-muted tabular-nums">{item.time}</span>
                    </span>
                    <span className={cn("mt-0.5 block text-sm", seen ? "text-muted" : "text-ink-2")}>{item.body}</span>
                    <span className="mt-2 inline-flex">
                      <StatusPill tone={item.tone}>{item.area}</StatusPill>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex justify-end border-t border-line px-5 py-4">
          <Button variant="ghost" disabled={!unread} onClick={onReadAll}>
            Mark all read
          </Button>
        </div>
      </aside>
    </div>,
    document.body,
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
        <ul className="mt-2 max-h-[min(52vh,420px)] overflow-y-auto p-1">
          {results.map((result) => (
            <li key={result.id}>
              <button
                type="button"
                className={cn(
                  "flex w-full items-center justify-between rounded-[12px] px-3 py-2 text-left hover:bg-side-hover",
                  "focus-visible:bg-side-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
                )}
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
