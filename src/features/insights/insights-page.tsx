import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import { TextField } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { Card, KpiTile, PageHeader } from "@/components/ui/surface";
import { useCountUp } from "@/lib/use-count-up";
import { useToast } from "@/lib/toast";

const metrics = [
  { id: "headcount", label: "Headcount", value: 112, unit: "", foot: "People on the books at month end", higher: true },
  { id: "turnover", label: "Turnover", value: 27, unit: "%", foot: "Leavers over the rolling year", higher: false },
  { id: "absence", label: "Absence rate", value: 4, unit: "%", foot: "Unplanned hours against rostered", higher: false },
  { id: "overtime", label: "Overtime", value: 363, unit: "h", foot: "Paid hours in November", higher: false },
  { id: "cost", label: "Labour cost", value: 298, unit: "k", foot: "Gross plus employer on-costs", higher: false },
  { id: "hire", label: "Time to hire", value: 19, unit: "d", foot: "From advert to a signed contract", higher: false },
] as const;

const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

const headcountByDept = [
  ["Deck", 26],
  ["Engine", 16],
  ["Galley", 12],
  ["Service", 20],
  ["Terminal", 22],
  ["Office", 16],
] as const;

const series: Record<string, { thisYear: number[]; lastYear: number[] }> = {
  headcount: {
    thisYear: [104, 106, 108, 111, 116, 120, 123, 126, 121, 116, 114, 114],
    lastYear: [103, 105, 107, 109, 114, 118, 122, 125, 122, 117, 114, 113],
  },
  turnover: {
    thisYear: [18, 19, 21, 22, 24, 30, 32, 31, 28, 27, 27, 27],
    lastYear: [16, 17, 18, 20, 22, 26, 29, 28, 25, 24, 23, 22],
  },
  absence: {
    thisYear: [3.2, 3.4, 3.8, 3.6, 3.1, 2.8, 2.6, 2.9, 3.4, 3.8, 4.1, 4],
    lastYear: [3.6, 3.8, 4.2, 4, 3.5, 3.1, 2.9, 3.2, 3.8, 4.1, 4.4, 4.2],
  },
  overtime: {
    thisYear: [210, 240, 260, 280, 310, 420, 460, 440, 390, 360, 340, 363],
    lastYear: [190, 220, 240, 250, 280, 390, 430, 410, 360, 330, 310, 320],
  },
  cost: {
    thisYear: [250, 255, 260, 268, 274, 290, 302, 306, 300, 296, 294, 298],
    lastYear: [236, 240, 244, 250, 258, 272, 284, 288, 280, 276, 272, 270],
  },
  hire: {
    thisYear: [28, 26, 24, 22, 21, 18, 16, 17, 19, 20, 21, 19],
    lastYear: [32, 30, 28, 27, 25, 22, 20, 21, 23, 24, 24, 23],
  },
};

export function InsightsPage() {
  const { push } = useToast();
  const [metricId, setMetricId] = useState<(typeof metrics)[number]["id"]>("headcount");
  const [view, setView] = useState<"month" | "dept">("month");
  const [saved, setSaved] = useState<string[]>(["Summer overtime", "Absence by team"]);
  const [name, setName] = useState("");
  const metric = metrics.find((item) => item.id === metricId) ?? metrics[0];
  const data = series[metricId] ?? series.headcount!;
  const shown = useCountUp(metric.value, 900);

  const chart = useMemo(() => toLines(data.thisYear, data.lastYear), [data]);

  return (
    <>
      <PageHeader
        title="Crew insights"
        subtitle="Twelve months of the Skerrow Line in numbers. Pick a metric, read it by month or by team."
        actions={
          <Button icon={<Icon name="download" className="size-4" />} onClick={() => push(`Exported temp01-${metricId}-by-${view}`)}>
            Export CSV
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((item, index) => (
          <button key={item.id} type="button" onClick={() => setMetricId(item.id)} className="cursor-pointer text-left">
            <KpiTile
              tone={((index % 4) + 1) as 1 | 2 | 3 | 4}
              delay={index * 40}
              label={item.label}
              value={
                item.id === metricId ? (
                  <>
                    {item.unit === "k" ? "£" : ""}
                    {Math.round(shown)}
                    {item.unit === "%" || item.unit === "h" || item.unit === "d" ? item.unit : item.unit === "k" ? "k" : ""}
                  </>
                ) : (
                  <>
                    {item.unit === "k" ? "£" : ""}
                    {item.value}
                    {item.unit === "k" ? "k" : item.unit}
                  </>
                )
              }
              foot={item.foot}
            />
          </button>
        ))}
      </div>

      <Card className="p-4 md:p-5" delay={80}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{metric.label} by {view === "month" ? "month" : "department"}</h2>
            <p className="text-sm text-muted">This year against last, Dec – Nov</p>
          </div>
          <div className="inline-flex items-center rounded-full bg-chip p-1">
            <button
              type="button"
              aria-pressed={view === "month"}
              onClick={() => setView("month")}
              className={cn("h-8 cursor-pointer rounded-full px-3.5 text-xs font-semibold", view === "month" ? "bg-ink text-card" : "text-ink-2")}
            >
              By month
            </button>
            <button
              type="button"
              aria-pressed={view === "dept"}
              onClick={() => setView("dept")}
              className={cn("h-8 cursor-pointer rounded-full px-3.5 text-xs font-semibold", view === "dept" ? "bg-ink text-card" : "text-ink-2")}
            >
              By department
            </button>
          </div>
        </div>
        {view === "month" ? (
          <svg viewBox="0 0 640 240" className="mt-2 h-64 w-full" role="img" aria-label={`${metric.label} by month`}>
            {chart.grid.map((y) => (
              <line key={y} x1="28" x2="612" y1={y} y2={y} stroke="var(--line-2)" strokeDasharray="0" />
            ))}
            <polyline fill="none" stroke="var(--out)" strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" points={chart.lastYear} />
            <polyline fill="none" stroke="var(--accent)" strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" points={chart.thisYear} />
            {months.map((month, index) => (
              <text
                key={month}
                x={chart.xs[index]}
                y="228"
                textAnchor="middle"
                fill="var(--muted)"
                fontSize="12"
                fontWeight="600"
                fontFamily="Urbanist, sans-serif"
              >
                {month}
              </text>
            ))}
          </svg>
        ) : (
          <div className="mt-6 grid h-64 grid-cols-6 items-end gap-3 px-2" role="img" aria-label={`${metric.label} by department`}>
            {headcountByDept.map(([name, value]) => (
              <div key={name} className="flex h-full flex-col justify-end gap-2">
                <div className="mx-auto w-full max-w-10 rounded-t-md bg-accent" style={{ height: `${(value / 26) * 100}%` }} />
                <span className="text-center text-2xs font-semibold text-muted">{name}</span>
              </div>
            ))}
          </div>
        )}
        <div className="mt-1 flex gap-4 text-xs font-semibold text-muted">
          <span className="inline-flex items-center gap-1.5"><i className="size-2 rounded-full bg-accent" /> This year</span>
          {view === "month" ? (
            <span className="inline-flex items-center gap-1.5"><i className="size-2 rounded-full bg-out" /> Last year</span>
          ) : null}
        </div>
      </Card>

      <Card className="p-4 md:p-5" delay={120}>
        <h2 className="text-lg font-semibold">Saved views</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {saved.map((item) => (
            <button
              key={item}
              type="button"
              className="inline-flex h-8 items-center gap-2 rounded-full bg-chip px-3 text-xs font-semibold"
              onClick={() => {
                setSaved((current) => current.filter((viewName) => viewName !== item));
                push("View removed");
              }}
            >
              {item}
              <Icon name="close" className="size-3.5" />
            </button>
          ))}
        </div>
        <form
          className="mt-4 flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            const next = name.trim();
            if (!next) return;
            setSaved((current) => [...current, next]);
            setName("");
            push(`Saved “${next}”`);
          }}
        >
          <TextField
            aria-label="View name"
            placeholder={`${metric.label} by ${view}`}
            value={name}
            onChange={(event) => setName(event.target.value)}
            fieldClassName="sm:max-w-xs"
          />
          <Button type="submit" variant="primary">Save view</Button>
        </form>
      </Card>
    </>
  );
}

function toLines(thisYear: number[], lastYear: number[]) {
  const all = [...thisYear, ...lastYear];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const span = max - min || 1;
  const yMin = min - span * 0.55;
  const yMax = max + span * 0.45;
  const left = 28;
  const right = 612;
  const top = 28;
  const bottom = 188;
  const xAt = (index: number) => left + (index / (thisYear.length - 1)) * (right - left);
  const yAt = (value: number) => top + (1 - (value - yMin) / (yMax - yMin)) * (bottom - top);
  const points = (values: number[]) => values.map((value, index) => `${xAt(index)},${yAt(value)}`).join(" ");
  return {
    thisYear: points(thisYear),
    lastYear: points(lastYear),
    xs: thisYear.map((_, index) => xAt(index)),
    grid: [0, 1, 2, 3].map((row) => top + (row / 3) * (bottom - top)),
  };
}
