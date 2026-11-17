import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import { Modal } from "@/components/ui/modal";
import { SectionTabs } from "@/components/ui/section-tabs";
import { payrollTabs } from "@/app/navigation";
import { people } from "@/data/people";
import { Card, Meter, PageHeader, StatusPill } from "@/components/ui/surface";
import { formatMoney } from "@/lib/format";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/cn";

const steps = ["Draft", "Review", "Approve", "Paid"] as const;

const departments = [
  ["Deck", 26, 72, 1],
  ["Engine room", 16, 48, 2],
  ["Galley", 12, 27, 3],
  ["Onboard service", 20, 47, 4],
  ["Terminal", 22, 52, 5],
  ["Shore office", 16, 48, 6],
] as const;

const checks = [
  { id: "ot", title: "2 overtime claims not decided", detail: "Dmitri 2.5h · Mei 1.5h", action: "Approve all", done: "Overtime approved" },
  { id: "bank", title: "2 people without bank details", detail: "Elif Hartley and Rosa Okonkwo — pay is held until they add them", action: "Send reminders", done: "Asked for bank details" },
  { id: "leavers", title: "2 leavers to pay off", detail: "Rosa Moreno, Zainab Iqbal — final pay includes holiday they haven’t taken", action: "Confirm final pay", done: "Final pay confirmed, P45s go out with the run" },
  { id: "joiners", title: "No joiners this month", detail: "Nobody to pro-rate in November", action: "Looks right", done: "Pro-rated pay confirmed" },
  { id: "sea", title: "Sea allowance: 1,042 sailings to pay", detail: "Every rating aboard, at £4.10 a sailing from the deck logs", action: "Confirm sailings", done: "Sea allowance confirmed from the deck logs" },
] as const;

export function PayRunPage() {
  const { push } = useToast();
  const [done, setDone] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [confirm, setConfirm] = useState(false);
  const openChecks = checks.length - done.length;

  return (
    <>
      <PageHeader
        title="November pay run"
        subtitle="Pays on Friday 27 November — 24 days. Review it by Monday 23rd."
        actions={
          <>
            <Button icon={<Icon name="download" className="size-4" />} onClick={() => push("Pay run exported")}>Export</Button>
            <Button
              variant="primary"
              magnetic
              icon={<Icon name="check" className="size-4" />}
              disabled={step > 1}
              onClick={() => setConfirm(true)}
            >
              {step > 1 ? "Locked" : "Approve and lock"}
            </Button>
          </>
        }
      />
      <SectionTabs items={payrollTabs} />

      <Card className="p-4 md:p-5" delay={40}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold">PR-2026-11</p>
            <p className="text-sm text-muted">November 2026 · {people.length} people · pay day 27 Nov 2026</p>
          </div>
          <StatusPill tone={step > 1 ? "good" : "warn"}>{step > 1 ? "Approved" : "Review"}</StatusPill>
        </div>
        <ol className="mt-5 grid grid-cols-4 gap-2">
          {steps.map((label, index) => (
            <li key={label}>
              <div className="mb-2 h-1 overflow-hidden rounded-full bg-side-well">
                <div className={cn("h-full rounded-full", index <= step ? "bg-accent" : "bg-transparent")} style={index === step ? { width: "55%" } : { width: index < step ? "100%" : "0%" }} />
              </div>
              <p className={cn("text-xs font-semibold", index === step ? "text-ink" : "text-muted")}>{label}</p>
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Tile label="Gross pay" value={formatMoney(293335)} foot="↑ 10% on October" tone="bg-tile-1" />
        <Tile label="Net to pay" value={formatMoney(231507)} foot="Into every bank account" tone="bg-tile-2" />
        <Tile label="Tax and NI" value={formatMoney(50074)} foot="To HMRC by 22 December" tone="bg-tile-3" />
        <Tile label="Pension" value={formatMoney(11755)} foot="5% from staff, 3% from us" tone="bg-tile-4" />
        <Tile label="Cost to the line" value={formatMoney(339130)} foot="Gross + £45,795 employer NI and pension" tone="bg-card ring-1 ring-line" />
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card delay={80}>
          <header className="px-4 pt-4 md:px-5">
            <h2 className="text-lg font-semibold">Gross by department</h2>
            <p className="text-sm text-muted">Basic, overtime and sea allowance</p>
          </header>
          <ul className="grid gap-3 px-4 py-4 md:px-5">
            {departments.map(([name, count, amount, tone]) => (
              <li key={name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold">{name} <span className="font-medium text-muted">{count} people</span></span>
                  <span className="font-semibold tabular-nums">£{amount}k</span>
                </div>
                <span className="block" style={{ color: `var(--c${tone})` }}>
                  <Meter value={amount / 72} tone="dept" label={`${name} gross`} />
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card delay={120}>
          <header className="px-4 pt-4 md:px-5">
            <h2 className="text-lg font-semibold">Before it goes</h2>
            <p className="text-sm text-muted">{checks.length - done.length} of {checks.length} checks open</p>
          </header>
          <ul className="grid gap-3 px-4 py-4 md:px-5">
            {checks.map((check) => {
              const cleared = done.includes(check.id);
              return (
                <li key={check.id} className="flex items-start gap-3 rounded-md bg-side-well px-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{check.title}</p>
                    <p className="text-xs text-muted">{check.detail}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={cleared ? "ghost" : "secondary"}
                    disabled={cleared}
                    onClick={() => {
                      setDone((current) => [...current, check.id]);
                      push(check.done);
                    }}
                  >
                    {cleared ? "Done" : check.action}
                  </Button>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <Card className="p-4 md:p-5" delay={160}>
        <h2 className="text-lg font-semibold">Where £293,335 goes</h2>
        <p className="text-sm text-muted">From gross pay to what people take home</p>
        <div className="mt-4 flex h-3 overflow-hidden rounded-full">
          <span className="bg-c2" style={{ width: "79%" }} />
          <span className="bg-c1" style={{ width: "12%" }} />
          <span className="bg-c3" style={{ width: "5%" }} />
          <span className="bg-c4" style={{ width: "4%" }} />
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <span><b>{formatMoney(231507)}</b> <span className="text-muted">Take-home · 79%</span></span>
          <span><b>{formatMoney(36331)}</b> <span className="text-muted">Income tax · 12%</span></span>
        </div>
      </Card>
      <Modal
        open={confirm}
        title="Approve November’s run?"
        description={
          openChecks
            ? `${openChecks} ${openChecks === 1 ? "check is" : "checks are"} still open. Approving locks every payslip as it is now.`
            : `It locks ${people.length} payslips at ${formatMoney(293335)} gross. Changes after this go into December.`
        }
        onClose={() => setConfirm(false)}
        footer={
          <>
            <Button onClick={() => setConfirm(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                setStep(2);
                setConfirm(false);
                push("Run approved and locked");
              }}
            >
              Approve and lock
            </Button>
          </>
        }
      />
    </>
  );
}

function Tile({ label, value, foot, tone }: { label: string; value: string; foot: string; tone: string }) {
  return (
    <article className={cn("rise-in rounded-lg p-4", tone)}>
      <p className="text-sm font-semibold text-muted">{label}</p>
      <p className="mt-2 text-[26px] font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="mt-2 text-sm text-muted">{foot}</p>
    </article>
  );
}
