import type { ComponentProps, ReactNode } from "react";
import { Icon } from "@/components/icons";
import { TextField } from "@/components/ui/field";
import { cn } from "@/lib/cn";

export function SearchField({
  className,
  shortcut,
  ...props
}: {
  className?: string;
  shortcut?: string;
} & Omit<ComponentProps<typeof TextField>, "leading" | "trailing">) {
  return (
    <TextField
      type="search"
      leading={<Icon name="search" className="size-4" />}
      trailing={
        shortcut ? (
          <kbd className="rounded-md bg-side-well px-1.5 py-0.5 font-sans text-2xs font-bold tracking-wide text-muted">
            {shortcut}
          </kbd>
        ) : null
      }
      className={cn("h-10", className)}
      {...props}
    />
  );
}

export function FilterChip({
  active,
  count,
  children,
  onClick,
}: {
  active?: boolean;
  count?: number;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors",
        active ? "bg-ink text-card" : "bg-chip text-chip-ink hover:bg-side-hover",
      )}
    >
      {children}
      {count !== undefined ? (
        <span className={cn("tabular-nums", active ? "text-card/70" : "text-muted")}>
          {count}
        </span>
      ) : null}
    </button>
  );
}
