import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Popover({
  label,
  trigger,
  children,
  align = "right",
  panelClassName,
}: {
  label: string;
  trigger: (open: boolean) => ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  panelClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        {trigger(open)}
      </div>
          {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={label}
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("button, a")) setOpen(false);
          }}
          className={cn(
            "absolute top-[calc(100%+8px)] z-40 rounded-lg bg-card p-3 text-ink shadow-pop ring-1 ring-line",
            panelClassName ?? "w-[min(100vw-2rem,320px)]",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
