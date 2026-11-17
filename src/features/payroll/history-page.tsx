import { payrollTabs } from "@/app/navigation";
import { SectionTabs } from "@/components/ui/section-tabs";
import { Card, PageHeader, StatusPill } from "@/components/ui/surface";
import { formatMoney } from "@/lib/format";

const runs = [
  { id: "PR-2026-10", month: "October 2026", paid: "28 Oct 2026", gross: 266450, people: 110, status: "Paid" },
  { id: "PR-2026-09", month: "September 2026", paid: "26 Sep 2026", gross: 271120, people: 109, status: "Paid" },
  { id: "PR-2026-08", month: "August 2026", paid: "28 Aug 2026", gross: 289640, people: 114, status: "Paid" },
  { id: "PR-2026-07", month: "July 2026", paid: "28 Jul 2026", gross: 301220, people: 118, status: "Paid" },
];

export function HistoryPage() {
  return (
    <>
      <PageHeader title="History" subtitle="Earlier runs. November is still open on the pay run tab." />
      <SectionTabs items={payrollTabs} />
      <div className="grid gap-3 md:grid-cols-2">
        {runs.map((run, index) => (
          <Card key={run.id} delay={index * 50} className="p-4 md:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">{run.id}</p>
                <p className="text-sm text-muted">{run.month} · paid {run.paid}</p>
              </div>
              <StatusPill tone="good">{run.status}</StatusPill>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <dt className="text-xs font-semibold text-muted">Gross</dt>
                <dd className="text-xl font-semibold tabular-nums">{formatMoney(run.gross)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-muted">People</dt>
                <dd className="text-xl font-semibold tabular-nums">{run.people}</dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>
    </>
  );
}
