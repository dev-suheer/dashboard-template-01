import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
  delay = 0,
  as: Tag = "section",
}: {
  className?: string;
  children: ReactNode;
  delay?: number;
  as?: "section" | "div" | "article";
}) {
  return (
    <Tag
      className={cn("card rise-in", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex items-start justify-between gap-3 px-4 pt-4 pb-2 md:px-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-sm text-muted">{subtitle}</p> : null}
      </div>
      {action}
    </header>
  );
}

const tones = {
  1: "bg-tile-1",
  2: "bg-tile-2",
  3: "bg-tile-3",
  4: "bg-tile-4",
} as const;

export function KpiTile({
  label,
  value,
  foot,
  tone,
  delay = 0,
}: {
  label: string;
  value: ReactNode;
  foot?: ReactNode;
  tone: keyof typeof tones;
  delay?: number;
}) {
  return (
    <article
      className={cn(
        "rise-in rounded-lg p-4 text-tile-ink",
        tones[tone],
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-sm font-semibold text-tile-muted">{label}</p>
      <p className="mt-2 font-semibold tracking-tight text-[28px] leading-none tabular-nums">
        {value}
      </p>
      {foot ? <p className="mt-2 text-sm text-tile-muted">{foot}</p> : null}
    </article>
  );
}

export function SplitTitle({ children }: { children: string }) {
  const words = children.split(" ");
  let index = 0;

  return (
    <h1
      aria-label={children}
      className="text-[32px] font-semibold leading-[1.04] tracking-[-0.025em] text-ink sm:text-[38px]"
    >
      {words.map((word) => {
        const letters = [...word];
        const start = index;
        index += letters.length;
        return (
          <span
            key={`${word}-${start}`}
            aria-hidden
            className="mr-[0.28em] inline-block overflow-hidden align-bottom leading-[1.15] last:mr-0"
          >
            {letters.map((letter, offset) => (
              <span
                key={offset}
                className="inline-block"
                style={{
                  animation: "letter-in 0.85s var(--ease-out) both",
                  animationDelay: `${(start + offset) * 22}ms`,
                }}
              >
                {letter}
              </span>
            ))}
          </span>
        );
      })}
    </h1>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <SplitTitle>{title}</SplitTitle>
        {subtitle ? (
          <p className="mt-1.5 max-w-2xl text-base text-muted">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function StatusPill({
  tone,
  children,
}: {
  tone: "good" | "info" | "warn" | "bad" | "neutral";
  children: ReactNode;
}) {
  const styles = {
    good: "bg-good-soft text-in-text",
    info: "bg-info-soft text-info",
    warn: "bg-warn-soft text-warn",
    bad: "bg-bad-soft text-bad",
    neutral: "bg-chip text-muted",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        styles[tone],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function Avatar({
  name,
  tone = 1,
  size = "md",
}: {
  name: string;
  tone?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: "sm" | "md";
}) {
  const letters = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-bold text-ink",
        size === "sm" ? "size-8 text-2xs" : "size-9 text-xs",
      )}
      style={{ background: `var(--h${tone})` }}
    >
      {letters}
    </span>
  );
}

export function Meter({
  value,
  tone = "accent",
  label,
}: {
  value: number;
  tone?: "accent" | "good" | "dept";
  label?: string;
  /** 0–1 */
}) {
  const width = `${Math.max(0, Math.min(1, value)) * 100}%`;
  const color =
    tone === "good" ? "var(--good)" : tone === "dept" ? "currentColor" : "var(--accent)";

  return (
    <span
      role="meter"
      aria-label={label}
      aria-valuenow={Math.round(value * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="block h-1.5 overflow-hidden rounded-full bg-side-well"
    >
      <span
        className="block h-full origin-left rounded-full"
        style={{
          width,
          background: color,
          animation: "bar-x 0.9s var(--ease-out) both",
          animationDelay: "150ms",
        }}
      />
    </span>
  );
}
