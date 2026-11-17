import { NavLink } from "react-router-dom";
import { cn } from "@/lib/cn";

export function SectionTabs({
  items,
}: {
  items: { to: string; label: string; badge?: number; end?: boolean }[];
}) {
  return (
    <nav aria-label="Sections" className="-mb-px flex gap-5 overflow-x-auto border-b border-line">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "inline-flex shrink-0 items-center gap-1.5 border-b-2 pb-2.5 text-md font-semibold transition-colors",
              isActive
                ? "border-ink text-ink"
                : "border-transparent text-muted hover:text-ink",
            )
          }
        >
          {item.label}
          {item.badge ? (
            <span className="rounded-full bg-bad-soft px-1.5 py-0.5 text-2xs font-bold text-bad">
              {item.badge}
            </span>
          ) : null}
        </NavLink>
      ))}
    </nav>
  );
}
