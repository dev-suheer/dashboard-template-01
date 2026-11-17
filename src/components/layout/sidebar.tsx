import { navigation, type NavItem } from "@/app/navigation";
import { Icon } from "@/components/icons";
import { useShell } from "@/components/layout/shell-context";
import { cn } from "@/lib/cn";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const ease = "cubic-bezier(0.22,1,0.36,1)";

function useActiveId() {
  const { pathname } = useLocation();
  return (
    navigation.find((item) =>
      item.to === "/"
        ? pathname === "/"
        : pathname === item.to ||
          pathname.startsWith(`${item.to.split("/").slice(0, 2).join("/")}`),
    )?.id ?? "overview"
  );
}

function childMatches(pathname: string, to: string) {
  return to === "/support" ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
}

function iconRail(rail: boolean) {
  const docked = window.matchMedia("(min-width: 768px)").matches;
  const wide = window.matchMedia("(min-width: 1280px)").matches;
  if (!docked) return false;
  if (!wide) return true;
  return rail;
}

function groups() {
  const order: NavItem["section"][] = ["Crew desk", "People ops", "Admin"];
  return order.map((section) => ({
    section,
    items: navigation.filter((item) => item.section === section),
  }));
}

export function Sidebar() {
  const { rail, setRail, mobileOpen, setMobileOpen, theme, toggleTheme } =
    useShell();
  const activeId = useActiveId();
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  const layoutRef = useRef({ rail, mobileOpen, ready: false });

  useLayoutEffect(() => {
    const nav = navRef.current;
    const pill = pillRef.current;
    if (!nav || !pill) return;

    const previous = layoutRef.current;
    const layoutChanged =
      previous.ready &&
      (previous.rail !== rail || previous.mobileOpen !== mobileOpen);
    layoutRef.current = { rail, mobileOpen, ready: true };

    let generation = 0;
    let raf = 0;

    const box = () => {
      const item = nav.querySelector<HTMLElement>(`[data-nav="${activeId}"]`);
      if (!item) return null;
      return {
        top: `${item.offsetTop}px`,
        left: `${item.offsetLeft}px`,
        width: `${item.offsetWidth}px`,
        height: `${item.offsetHeight}px`,
      };
    };

    const commit = (next: {
      top: string;
      left: string;
      width: string;
      height: string;
    }) => {
      generation += 1;
      pill.getAnimations().forEach((animation) => animation.cancel());
      Object.assign(pill.style, next);
    };

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const next = box();
    if (!next) return;

    if (layoutChanged && !reduced) {
      const until = performance.now() + 480;
      const step = (now: number) => {
        const measured = box();
        if (measured) commit(measured);
        if (now < until) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    } else if (!reduced && pill.style.width) {
      const from = {
        top: pill.style.top,
        left: pill.style.left,
        width: pill.style.width,
        height: pill.style.height,
      };
      const moved =
        from.top !== next.top ||
        from.left !== next.left ||
        from.width !== next.width ||
        from.height !== next.height;
      if (moved) {
        const token = ++generation;
        pill.getAnimations().forEach((animation) => animation.cancel());
        const animation = pill.animate([from, next], {
          duration: 450,
          easing: ease,
        });
        animation.onfinish = () => {
          if (token === generation) Object.assign(pill.style, next);
        };
      }
    } else {
      commit(next);
    }

    let skip = true;
    const observer = new ResizeObserver(() => {
      if (skip) {
        skip = false;
        return;
      }
      const measured = box();
      if (measured) commit(measured);
    });
    observer.observe(nav);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [activeId, rail, mobileOpen]);

  const label = cn(
    "overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
    "max-md:max-w-[140px] max-md:opacity-100",
    "md:max-w-0 md:opacity-0",
    !rail && "xl:max-w-[140px] xl:opacity-100",
  );

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        className={cn(
          "fixed inset-0 z-30 cursor-pointer bg-overlay md:hidden",
          mobileOpen ? "block" : "hidden",
        )}
        onClick={() => setMobileOpen(false)}
      />
      <aside
        aria-label="Sidebar"
        className={cn(
          "fixed z-40 flex flex-col overflow-hidden bg-side text-side-ink shadow-[inset_0_0_0_1px_var(--side-line),var(--shadow)]",
          "transition-[width,padding,transform] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          "max-md:inset-y-0 max-md:left-0 max-md:w-[232px] max-md:gap-2 max-md:px-3 max-md:py-3.5",
          "md:top-3 md:bottom-3 md:left-3 md:w-[68px] md:items-center md:gap-2.5 md:rounded-[22px] md:px-3 md:py-3.5",
          !rail && "xl:w-[236px] xl:items-stretch xl:px-3",
          mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
        )}
      >
        <div
          className={cn(
            "flex w-full items-center gap-2",
            "md:flex-col md:items-center md:gap-2.5",
            !rail && "xl:flex-row xl:gap-2 xl:px-0.5",
          )}
        >
          <NavLink
            to="/"
            aria-label="Temp01 — Overview"
            className={cn(
              "flex min-w-0 items-center gap-2.5",
              "md:w-10 md:flex-none md:justify-center md:gap-0",
              !rail && "xl:flex-1 xl:justify-start xl:gap-2.5",
            )}
            onClick={() => setMobileOpen(false)}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-[13px] bg-accent text-accent-ink shadow-[inset_0_1px_0_#ffffff4d,0_8px_16px_-8px_var(--accent)]">
              <Icon name="mark" className="size-[22px]" />
            </span>
            <span className={cn("min-w-0", label)}>
              <b className="block text-[20px] leading-none font-bold tracking-tight">
                Temp01
              </b>
              <small className="mt-1 block text-[10px] leading-none font-semibold tracking-tight text-side-muted">
                Skerrow Line crew desk
              </small>
            </span>
          </NavLink>
          <button
            type="button"
            aria-label={rail ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={rail}
            title="Collapse  ["
            onClick={() => setRail(!rail)}
            className="hidden size-8 shrink-0 cursor-pointer place-items-center rounded-[10px] text-side-ink shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--side-ink)_14%,transparent)] transition-colors hover:bg-side-hover xl:grid"
          >
            <Icon
              name="panel"
              className={cn(
                "size-[18px] transition-transform duration-300",
                rail && "-scale-x-100",
              )}
            />
          </button>
        </div>

        <nav
          ref={navRef}
          aria-label="Main"
          className={cn(
            "relative flex min-h-0 w-full flex-1 flex-col gap-1.5 overflow-x-hidden overflow-y-auto pt-4",
            "md:items-center",
            !rail && "xl:items-stretch xl:gap-2",
          )}
        >
          <span
            ref={pillRef}
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 h-10 w-0 rounded-[14px] bg-accent"
          />
          {groups().map((group, index) => (
            <div key={group.section} className="flex w-full flex-col gap-1">
              {index > 0 ? (
                <span
                  className={cn(
                    "mx-auto my-1 hidden h-px w-7 bg-side-line md:block",
                    !rail && "xl:hidden",
                  )}
                />
              ) : null}
              {group.items.map((item) =>
                item.children ? (
                  <SideMenu
                    key={item.id}
                    item={item}
                    active={activeId === item.id}
                    label={label}
                    rail={rail}
                    onNavigate={() => setMobileOpen(false)}
                  />
                ) : (
                  <NavLink
                    key={item.id}
                    to={item.to}
                    end={item.to === "/"}
                    data-nav={item.id}
                    aria-label={item.label}
                    title={item.label}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "relative z-10 flex h-10 w-full cursor-pointer items-center gap-3 overflow-hidden rounded-[14px] px-3 text-md font-semibold",
                      "transition-[padding,gap] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                      "md:justify-center md:gap-0 md:px-0",
                      !rail && "xl:justify-start xl:gap-3 xl:px-3",
                      activeId === item.id
                        ? "text-accent-ink"
                        : "text-side-ink hover:bg-side-hover",
                    )}
                  >
                    <Icon
                      name={item.icon}
                      className={cn(
                        "size-5 shrink-0 md:absolute md:top-1/2 md:left-1/2 md:size-[18px] md:-translate-x-1/2 md:-translate-y-1/2",
                        !rail && "xl:static xl:size-5 xl:translate-none",
                        activeId === item.id ? "text-accent-ink" : "text-side-muted",
                      )}
                    />
                    <span className={label}>{item.label}</span>
                    {item.badge ? (
                      <>
                        <span
                          className={cn(
                            "absolute top-2 right-2.5 size-2 rounded-full ring-2 ring-side",
                            item.badgeTone === "bad" ? "bg-bad" : "bg-accent",
                            "md:block",
                            !rail && "xl:hidden",
                          )}
                        />
                        <span
                          className={cn(
                            "ml-auto inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1 text-[10px] leading-none font-bold tabular-nums",
                            item.badgeTone === "bad"
                              ? "bg-bad text-white"
                              : "bg-side-well text-side-ink",
                            activeId === item.id && "bg-white/25 text-accent-ink",
                            "max-md:inline-flex",
                            "md:hidden",
                            !rail && "xl:ml-auto xl:inline-flex",
                          )}
                        >
                          {item.badge}
                        </span>
                      </>
                    ) : null}
                  </NavLink>
                ),
              )}
            </div>
          ))}
        </nav>

        <div
          className={cn(
            "mt-auto flex w-full flex-col gap-1.5 pt-2",
            "md:items-center",
            !rail && "xl:items-stretch",
          )}
        >
          
          <button
            type="button"
            aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
            aria-pressed={theme === "dark"}
            onClick={(event) => toggleTheme(event.currentTarget)}
            className={cn(
              "flex h-10 w-full cursor-pointer items-center gap-2.5 overflow-hidden rounded-[14px] px-2 text-sm font-semibold text-side-ink",
              "transition-[padding,gap] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-side-hover",
              "md:justify-center md:gap-0 md:px-0",
              !rail && "xl:justify-start xl:gap-2.5 xl:px-2",
            )}
          >
            <Icon
              name={theme === "dark" ? "sun" : "moon"}
              className={cn(
                "size-5 shrink-0 text-side-muted md:size-[18px]",
                !rail && "xl:size-5",
              )}
            />
            <span className={label}>
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </span>
            <span
              className={cn(
                "ml-auto h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors duration-300",
                theme === "dark" ? "bg-accent" : "bg-line-strong",
                "md:hidden",
                !rail && "xl:block",
              )}
            >
              <span
                className={cn(
                  "block size-4 rounded-full bg-white shadow-raise transition-transform duration-300",
                  theme === "dark" && "translate-x-4",
                )}
              />
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

function SideMenu({
  item,
  active,
  label,
  rail,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  label: string;
  rail: boolean;
  onNavigate: () => void;
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const children = item.children ?? [];
  const routeOpen = children.some((child) => childMatches(pathname, child.to));
  const [manual, setManual] = useState<boolean | null>(null);

  useEffect(() => {
    setManual(null);
  }, [pathname]);

  const open = manual ?? routeOpen;

  return (
    <div className="flex w-full flex-col">
      <button
        type="button"
        data-nav={item.id}
        aria-expanded={open}
        aria-label={item.label}
        title={item.label}
        onClick={() => {
          if (iconRail(rail)) {
            navigate(children[0]?.to ?? item.to);
            onNavigate();
            return;
          }
          setManual(!open);
        }}
        className={cn(
          "relative z-10 flex h-10 w-full cursor-pointer items-center gap-3 overflow-hidden rounded-[14px] px-3 text-md font-semibold",
          "transition-[padding,gap] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          "md:justify-center md:gap-0 md:px-0",
          !rail && "xl:justify-start xl:gap-3 xl:px-3",
          active ? "text-accent-ink" : "text-side-ink hover:bg-side-hover",
        )}
      >
        <Icon
          name={item.icon}
          className={cn(
            "size-5 shrink-0 md:absolute md:top-1/2 md:left-1/2 md:size-[18px] md:-translate-x-1/2 md:-translate-y-1/2",
            !rail && "xl:static xl:size-5 xl:translate-none",
            active ? "text-accent-ink" : "text-side-muted",
          )}
        />
        <span className={label}>{item.label}</span>
        <Icon
          name="chevron"
          className={cn(
            "ml-auto size-3.5 shrink-0 transition-transform duration-300",
            open && "rotate-180",
            active ? "text-accent-ink" : "text-side-muted",
            "md:hidden",
            !rail && "xl:block",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          "md:hidden",
          !rail && "xl:grid",
        )}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="mt-1 mb-1.5 ml-[21px] flex flex-col gap-px py-0.5 pl-3 shadow-[inset_1.5px_0_0_var(--side-line)]">
            {children.map((child) => {
              const current = childMatches(pathname, child.to);
              return (
                <NavLink
                  key={child.id}
                  to={child.to}
                  onClick={onNavigate}
                  className={cn(
                    "flex h-8 items-center gap-2 rounded-[10px] px-2.5 text-sm font-semibold",
                    current
                      ? "bg-accent-soft text-accent-text"
                      : "text-side-muted hover:bg-side-hover hover:text-side-ink",
                  )}
                >
                  <i
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      current ? "bg-accent" : "bg-current opacity-70",
                    )}
                  />
                  {child.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
