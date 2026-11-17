import { useEffect, type ReactNode } from "react";
import { Icon } from "@/components/icons";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  useEffect(() => {
    document.title = `${title} — Temp01`;
  }, [title]);

  return (
    <div className="grid min-h-dvh place-items-center bg-canvas px-4 py-10">
      <div className="w-full max-w-[440px]">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-[13px] bg-accent text-accent-ink shadow-[inset_0_1px_0_#ffffff4d]">
            <Icon name="mark" className="size-[22px]" />
          </span>
          <div>
            <p className="text-[20px] leading-none font-bold tracking-tight">Temp01</p>
            <p className="mt-1 text-[11px] font-semibold text-muted">Skerrow Line crew desk</p>
          </div>
        </div>
        <section className="card p-6 sm:p-7">
          <h1 className="text-[28px] leading-none font-semibold tracking-tight text-ink">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </section>
      </div>
    </div>
  );
}
