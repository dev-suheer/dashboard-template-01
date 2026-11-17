import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/icons";
import { SelectField, TextField } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { FilterChip } from "@/components/ui/search-field";
import { Avatar, Card, CardHeader, PageHeader, StatusPill } from "@/components/ui/surface";
import { people } from "@/data/people";
import { departments, session } from "@/data/world";
import { useAuth } from "@/features/auth/auth-context";
import { useToast } from "@/lib/toast";
import { useCountUp } from "@/lib/use-count-up";
import { cn } from "@/lib/cn";

const leaveTypes = ["Annual leave", "Sick", "Parental", "Time off in lieu", "Unpaid", "Compassionate"] as const;

const dutyTrend = [94, 95, 93, 96, 94, 97, 96, 98, 97, 96, 95, 97];
const dutyMonths = ["Dec", "Feb", "Apr", "Jun", "Aug", "Nov"];

const crewMix = [
  ["Deck", 26],
  ["Engine", 16],
  ["Galley", 12],
  ["Service", 20],
  ["Terminal", 22],
  ["Office", 16],
] as const;

type Tone = 1 | 2 | 3 | 4 | 5 | 6;

const sources: { name: string; hours: number; share: number; icon: IconName; tone: Tone }[] = [
  { name: "Deck", hours: 1014, share: 23, icon: "ship", tone: 1 },
  { name: "Engine room", hours: 617, share: 14, icon: "settings", tone: 2 },
  { name: "Galley", hours: 485, share: 11, icon: "clock", tone: 3 },
  { name: "Onboard service", hours: 794, share: 18, icon: "crew", tone: 4 },
  { name: "Terminal", hours: 882, share: 20, icon: "calendar", tone: 5 },
  { name: "Shore office", hours: 618, share: 14, icon: "mail", tone: 6 },
];

type MetricId = "duty" | "sailings" | "short" | "leave";

const metrics: {
  id: MetricId;
  label: string;
  value: number;
  delta: string;
  down?: boolean;
  foot: string;
  icon: IconName;
  spark: number[];
  series: number[];
  title: string;
}[] = [
  {
    id: "duty",
    label: "On duty",
    value: 62,
    delta: "4%",
    foot: "aboard now",
    icon: "crew",
    spark: [54, 58, 51, 60, 62, 57, 63, 61, 64, 59, 62],
    series: [58, 60, 54, 48, 61, 63, 62, 59, 61, 64, 55, 49, 62, 62],
    title: "On duty · last 14 days",
  },
  {
    id: "sailings",
    label: "Sailings",
    value: 14,
    delta: "8%",
    foot: "across two ships",
    icon: "ship",
    spark: [10, 12, 11, 14, 13, 9, 14, 12, 14, 11, 14],
    series: [12, 14, 13, 10, 14, 14, 14, 13, 14, 14, 11, 8, 14, 14],
    title: "Sailings · last 14 days",
  },
  {
    id: "short",
    label: "Short-crewed",
    value: 2,
    delta: "33%",
    down: true,
    foot: "next at 15:45",
    icon: "clock",
    spark: [3, 2, 4, 1, 2, 3, 1, 2, 0, 3, 2],
    series: [1, 0, 2, 3, 1, 0, 1, 2, 1, 0, 2, 1, 3, 2],
    title: "Short sailings · last 14 days",
  },
  {
    id: "leave",
    label: "Time off",
    value: 6,
    delta: "2",
    foot: "waiting on you",
    icon: "calendar",
    spark: [3, 4, 2, 5, 6, 4, 7, 5, 6, 3, 6],
    series: [4, 5, 3, 2, 6, 7, 5, 4, 6, 8, 3, 2, 5, 6],
    title: "Time-off requests · last 14 days",
  },
];

const dayLabels = ["21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "1", "2", "3"];

const requests: {
  name: string;
  tone: Tone;
  kind: string;
  when: string;
  note: string;
  pill: "good" | "info" | "warn";
}[] = [
  { name: "Molly Kaur", tone: 6, kind: "Leave", when: "Sick · 2–3 Nov", note: "Fit note to follow", pill: "good" },
  { name: "Idris Chen", tone: 4, kind: "Leave", when: "Time off in lieu · 6 Nov", note: "Owed from the double crossing", pill: "good" },
  { name: "Aisha Hughes", tone: 2, kind: "Leave", when: "Annual leave · 20–26 Nov", note: "Her sister’s wedding in Galway", pill: "good" },
  { name: "Kenji Arai", tone: 2, kind: "Swap", when: "Friday night watch", note: "Ruby Reid can take it", pill: "info" },
  { name: "Nia Fraser", tone: 1, kind: "Overtime", when: "Saturday double", note: "Two extra hours on the late sailing", pill: "warn" },
];

const commended: { name: string; role: string; tone: Tone; score: number }[] = [
  { name: "Femi Popescu", role: "Ordinary seaman · Corran", tone: 1, score: 4.4 },
  { name: "Olumide Bakare", role: "Chief cook · Corran", tone: 3, score: 4.3 },
  { name: "Idris Chen", role: "Café steward · Corran", tone: 4, score: 4.3 },
  { name: "Molly Kowalski", role: "Cook · Corran", tone: 3, score: 4.2 },
  { name: "Rosa Bennett", role: "Ticket agent · Terminal", tone: 5, score: 4.1 },
];

const upcoming: {
  name: string;
  tone: Tone;
  detail: string;
  when: string;
  pill: "good" | "info" | "neutral" | "warn";
}[] = [
  { name: "Rosa Bennett", tone: 5, detail: "Birthday · Terminal", when: "Today", pill: "good" },
  { name: "Freya Achterberg", tone: 1, detail: "Birthday · Deck · Corran", when: "Tomorrow", pill: "info" },
  { name: "Isla Popescu", tone: 4, detail: "6 years with us · Café steward", when: "Tomorrow", pill: "info" },
  { name: "Rahul Fischer", tone: 2, detail: "Birthday · Engine room", when: "Thu 5", pill: "neutral" },
  { name: "Dev Sharma", tone: 6, detail: "First solo watch · Shore office", when: "Fri 6", pill: "warn" },
];

function workingDays(from: string, to: string) {
  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  if (Number.isNaN(start.getTime()) || end < start) return 0;
  let count = 0;
  for (const day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
    const weekday = day.getDay();
    if (weekday !== 0 && weekday !== 6) count += 1;
  }
  return count;
}

function Figure({ value }: { value: number }) {
  const current = useCountUp(value, 900);
  return <>{Math.round(current)}</>;
}

function points(values: number[], width: number, height: number, pad = 2) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - pad - ((value - min) / span) * (height - pad * 2);
    return [x, y] as const;
  });
}

function Sparkline({ values }: { values: number[] }) {
  const line = points(values, 78, 32)
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  return (
    <svg viewBox="0 0 78 32" className="h-8 w-[78px]" aria-hidden>
      <path d={line} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function TrendChart({ values }: { values: number[] }) {
  const width = 640;
  const height = 112;
  const plotted = points(values, width, height, 8);
  const line = plotted.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const ticks = [100, 96, 92];
  return (
    <div className="mt-5 grid grid-cols-[32px_minmax(0,1fr)] gap-2">
      <div className="flex h-28 flex-col justify-between text-2xs font-semibold text-muted">
        {ticks.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
      <div>
        <svg viewBox={`0 0 ${width} ${height}`} className="h-28 w-full" role="img" aria-label="Duty score from December to November">
          {[0.2, 0.5, 0.8].map((row) => (
            <line key={row} x1="0" x2={width} y1={height * row} y2={height * row} stroke="var(--line-2)" />
          ))}
          <path d={area} fill="var(--accent)" opacity="0.16" />
          <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
        <div className="mt-1 flex justify-between text-2xs font-semibold text-muted">
          {dutyMonths.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function BarChart({ values }: { values: number[] }) {
  const peak = Math.max(...values, 1);
  const top = Math.max(2, Math.ceil(peak / 2) * 2);
  const ticks = [top, top / 2, 0];

  return (
    <div className="grid h-full min-h-48 flex-1 grid-cols-[2rem_minmax(0,1fr)] grid-rows-[minmax(9rem,1fr)_auto] gap-x-3">
      <div className="relative row-start-1 text-right text-2xs font-semibold text-muted">
        {ticks.map((tick, index) => (
          <span
            key={tick}
            className="absolute right-0 leading-none"
            style={{
              top: `${(index / (ticks.length - 1)) * 100}%`,
              transform: index === 0 ? undefined : index === ticks.length - 1 ? "translateY(-100%)" : "translateY(-50%)",
            }}
          >
            {tick}
          </span>
        ))}
      </div>
      <div className="row-start-1 flex min-h-0 items-end gap-1.5 border-b border-line">
        {values.map((value, index) => (
          <div key={dayLabels[index]} className="flex h-full min-w-0 flex-1 items-end">
            <div
              className={cn("w-full rounded-t-[4px]", index === values.length - 1 ? "bg-accent" : "bg-ink/20")}
              style={{ height: `${(value / top) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="col-start-2 row-start-2 mt-2 flex gap-1.5">
        {dayLabels.map((label, index) => (
          <span key={`${label}-${index}`} className="min-w-0 flex-1 text-center text-2xs font-semibold text-muted">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function OverviewPage() {
  const { user } = useAuth();
  const { push } = useToast();
  const [bookOpen, setBookOpen] = useState(false);
  const [watchOpen, setWatchOpen] = useState(false);
  const [metricId, setMetricId] = useState<MetricId>("duty");
  const metric = metrics.find((item) => item.id === metricId) ?? metrics[0]!;

  return (
    <>
      <PageHeader
        title={`Good morning, ${user?.name.split(" ")[0] ?? "User"}`}
        subtitle="6 requests are waiting for a decision and 2 sailings are short of crew. Duty is up for the fourth week running."
        actions={
          <>
            <Button icon={<Icon name="calendar" className="size-4" />} onClick={() => setBookOpen(true)}>
              Book time off
            </Button>
            <Button variant="primary" magnetic icon={<Icon name="plus" className="size-4" />} onClick={() => setWatchOpen(true)}>
              Add a watch
            </Button>
          </>
        }
      />

      <div className="grid items-stretch gap-3 xl:grid-cols-6">
        <section className="card flex h-full flex-col p-4 md:p-5 xl:col-span-4" aria-label="Duty score">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-xs font-semibold text-muted">Duty score · November</p>
              <p className="mt-2 text-[52px] leading-none font-semibold tracking-tight text-ink tabular-nums">
                <Figure value={97} />
                <span className="ml-1 text-lg font-semibold text-muted">%</span>
              </p>
              <p className="mt-2 text-sm">
                <span className="font-semibold text-good">↑ 2.1%</span>
                <span className="text-muted"> vs October</span>
              </p>
            </div>
            <dl className="grid grid-cols-3 gap-4 sm:gap-6">
              {[
                ["On duty", "62", "aboard now"],
                ["Sailings", "14", "two ships"],
                ["Short", "2", "next 15:45"],
              ].map(([label, value, foot]) => (
                <div key={label}>
                  <dt className="text-xs font-semibold text-muted">{label}</dt>
                  <dd className="mt-1 text-2xl font-semibold tracking-tight text-ink tabular-nums">{value}</dd>
                  <dd className="text-xs text-muted">{foot}</dd>
                </div>
              ))}
            </dl>
          </div>
          <TrendChart values={dutyTrend} />
        </section>

        <Card className="flex h-full flex-col p-4 md:p-5 xl:col-span-2" delay={60}>
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-semibold">The crew</h2>
            <p className="text-sm text-muted">112 people</p>
          </div>
          <ul className="mt-4 grid flex-1 content-center gap-2.5">
            {crewMix.map(([name, count]) => (
              <li key={name} className="grid grid-cols-[72px_minmax(0,1fr)_36px] items-center gap-2">
                <span className="text-sm font-semibold">{name}</span>
                <span className="block h-1.5 overflow-hidden rounded-full bg-side-well">
                  <span
                    className="block h-full rounded-full bg-ink"
                    style={{ width: `${Math.round((count / 112) * 100)}%` }}
                  />
                </span>
                <span className="text-right text-xs font-semibold tabular-nums text-muted">
                  {Math.round((count / 112) * 100)}%
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-center gap-2 rounded-md bg-side-well px-3 py-2 text-sm text-ink-2">
            <span className="size-1.5 shrink-0 rounded-full bg-good" />
            97% of those due are aboard.
          </p>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" role="group" aria-label="Pick what the chart shows">
        {metrics.map((item) => {
          const active = item.id === metricId;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setMetricId(item.id)}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg p-4 text-left shadow-card",
                active ? "bg-accent-soft ring-2 ring-accent" : "bg-card",
              )}
            >
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <Icon name={item.icon} className="size-4 text-muted" />
                  {item.label}
                </span>
                <span className="mt-2 block text-[32px] leading-none font-semibold tracking-tight text-ink tabular-nums">
                  <Figure value={item.value} />
                </span>
                <span className="mt-2 block text-xs">
                  <span className={cn("font-semibold", item.down ? "text-bad" : "text-good")}>
                    {item.down ? "↓" : "↑"} {item.delta}
                  </span>
                  <span className="text-muted"> {item.foot}</span>
                </span>
              </span>
              <Sparkline values={item.spark} />
            </button>
          );
        })}
      </div>

      <div className="grid items-stretch gap-3 xl:grid-cols-6">
        <Card className="flex h-full flex-col xl:col-span-4" delay={40}>
          <CardHeader title={metric.title} subtitle="21 Oct – today · pick a tile above to switch" />
          <div className="flex min-h-0 flex-1 flex-col px-4 pt-1 pb-4 md:px-5 md:pb-5">
            <BarChart values={metric.series} />
          </div>
        </Card>

        <Card className="flex h-full flex-col xl:col-span-2" delay={80}>
          <CardHeader
            title="Waiting on you"
            subtitle="Oldest first, so nothing sits past a day"
            action={
              <Link to="/payroll/run" className="text-sm font-semibold text-accent-text">
                All 6
              </Link>
            }
          />
          <ul>
            {requests.map((request) => (
              <li key={request.name} className="border-t border-line first:border-t-0">
                <button
                  type="button"
                  onClick={() => push(`Opened ${request.name.split(" ")[0]}’s ${request.kind.toLowerCase()} request`)}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left hover:bg-side-hover md:px-5"
                >
                  <Avatar name={request.name} tone={request.tone} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{request.note}</span>
                    <span className="block truncate text-xs text-muted">
                      {request.name} · {request.when}
                    </span>
                  </span>
                  <StatusPill tone={request.pill}>{request.kind}</StatusPill>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="flex h-full flex-col xl:col-span-2" delay={80}>
          <CardHeader title="Where the hours are" subtitle="4,410 hours rostered this week, by department" />
          <div className="flex flex-1 flex-col px-4 pb-4 md:px-5 md:pb-5">
            <div className="flex h-2 overflow-hidden rounded-full">
              {sources.map((source) => (
                <span key={source.name} style={{ width: `${source.share}%`, background: `var(--c${source.tone})` }} />
              ))}
            </div>
            <ul className="mt-3 grid">
              {sources.map((source) => (
                <li key={source.name} className="flex items-center gap-3 border-t border-line py-2.5 first:border-t-0">
                  <span
                    className="grid size-8 place-items-center rounded-full"
                    style={{ background: `var(--h${source.tone})`, color: `var(--c${source.tone})` }}
                  >
                    <Icon name={source.icon} className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-semibold">{source.name}</span>
                  <span className="text-sm font-semibold tabular-nums">{source.hours.toLocaleString("en-GB")}</span>
                  <span className="w-10 text-right text-xs font-semibold text-muted">{source.share}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="flex h-full flex-col xl:col-span-2" delay={120}>
          <CardHeader
            title="Most commended"
            subtitle="Three shout-outs or more, this month"
            action={
              <Link to="/crew" className="text-sm font-semibold text-accent-text">
                Directory
              </Link>
            }
          />
          <ol>
            {commended.map((person, index) => (
              <li key={person.name} className="flex items-center gap-3 border-t border-line px-4 py-2.5 first:border-t-0 md:px-5">
                <span className="w-4 text-xs font-bold text-muted">{index + 1}</span>
                <Avatar name={person.name} tone={person.tone} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{person.name}</span>
                  <span className="block truncate text-xs text-muted">{person.role}</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2 py-1 text-xs font-bold text-card tabular-nums">
                  <Icon name="target" className="size-3" />
                  {person.score.toFixed(2)}
                </span>
              </li>
            ))}
          </ol>
        </Card>

        <Card className="flex h-full flex-col xl:col-span-2" delay={160}>
          <CardHeader title="Coming up" subtitle="The next ten days on the desk" />
          <ul className="flex-1">
            {upcoming.map((item) => (
              <li key={item.name} className="flex items-center gap-3 border-t border-line px-4 py-2.5 first:border-t-0 md:px-5">
                <Avatar name={item.name} tone={item.tone} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{item.name}</span>
                  <span className="block truncate text-xs text-muted">{item.detail}</span>
                </span>
                <StatusPill tone={item.pill}>{item.when}</StatusPill>
              </li>
            ))}
          </ul>
          <p className="mx-4 mt-auto mb-4 flex items-center gap-2 rounded-md bg-side-well px-3 py-2.5 text-sm text-ink-2 md:mx-5">
            <Icon name="calendar" className="size-4 text-muted" />
            6 requests still waiting for a decision
          </p>
        </Card>
      </div>

      <BookTimeOff open={bookOpen} onClose={() => setBookOpen(false)} />
      <AddWatch open={watchOpen} onClose={() => setWatchOpen(false)} />
    </>
  );
}

function BookTimeOff({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { push } = useToast();
  const [who, setWho] = useState(session.name);
  const [type, setType] = useState<(typeof leaveTypes)[number]>("Annual leave");
  const [from, setFrom] = useState("2026-11-11");
  const [to, setTo] = useState("2026-11-13");
  const [note, setNote] = useState("");
  const days = workingDays(from, to);
  const person = people.find((item) => item.name === who);

  return (
    <Modal
      open={open}
      title="Book time off"
      description="For yourself or someone on your crew."
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => {
              if (days < 1) return;
              push(who === session.name ? "Time off request sent" : `Booked ${type.toLowerCase()} for ${who.split(" ")[0]}`);
              onClose();
            }}
          >
            {who === session.name ? "Send request" : "Book it"}
          </Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <SelectField label="Who" fieldClassName="sm:col-span-2" value={who} onChange={(event) => setWho(event.target.value)}>
          {people.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name} — {item.role}
            </option>
          ))}
        </SelectField>
        <div className="sm:col-span-2">
          <p className="mb-1.5 text-sm font-semibold text-ink-2">Type</p>
          <div className="flex flex-wrap gap-2">
            {leaveTypes.map((item) => (
              <FilterChip key={item} active={type === item} onClick={() => setType(item)}>
                {item}
              </FilterChip>
            ))}
          </div>
        </div>
        <TextField label="From" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
        <TextField label="To" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
        <p className="text-xs text-muted sm:col-span-2">
          {days} working day{days === 1 ? "" : "s"}
          {person ? ` · ${person.name.split(" ")[0]} has 22 of 28 left` : ""}
        </p>
        <TextField
          label="Note (optional)"
          fieldClassName="sm:col-span-2"
          placeholder="Shows on the request"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </div>
    </Modal>
  );
}

function AddWatch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { push } = useToast();
  const [dept, setDept] = useState(departments[1]?.id ?? "engine");
  const [day, setDay] = useState("Tue 3 Nov");
  const [who, setWho] = useState("");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const crew = people.filter((person) => person.dept === dept);

  return (
    <Modal
      open={open}
      title="Add a watch"
      description="Leave “Who” empty to post it as an open watch anyone in the department can pick up."
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => {
              if (end <= start) return;
              const name = who ? people.find((person) => person.id === who)?.name.split(" ")[0] : null;
              push(name ? `${name} is on ${start}–${end}` : "Open shift posted. The department gets a ping.");
              onClose();
            }}
          >
            Add watch
          </Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <SelectField label="Department" value={dept} onChange={(event) => { setDept(event.target.value as typeof dept); setWho(""); }}>
          {departments.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </SelectField>
        <SelectField label="Day" value={day} onChange={(event) => setDay(event.target.value)}>
          {["Mon 2 Nov", "Tue 3 Nov", "Wed 4 Nov", "Thu 5 Nov", "Fri 6 Nov", "Sat 7 Nov", "Sun 8 Nov"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </SelectField>
        <SelectField label="Who" fieldClassName="sm:col-span-2" value={who} onChange={(event) => setWho(event.target.value)}>
          <option value="">Open watch</option>
          {crew.map((person) => (
            <option key={person.id} value={person.id}>{person.name} — {person.role}</option>
          ))}
        </SelectField>
        <TextField label="Start" type="time" value={start} onChange={(event) => setStart(event.target.value)} />
        <TextField label="End" type="time" value={end} onChange={(event) => setEnd(event.target.value)} />
      </div>
    </Modal>
  );
}
