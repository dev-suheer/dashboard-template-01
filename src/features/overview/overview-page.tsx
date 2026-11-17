import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import { SelectField, TextField } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { FilterChip } from "@/components/ui/search-field";
import { Avatar, Card, CardHeader, KpiTile, Meter, PageHeader, StatusPill } from "@/components/ui/surface";
import { people } from "@/data/people";
import { departments, session } from "@/data/world";
import { useAuth } from "@/features/auth/auth-context";
import { useToast } from "@/lib/toast";
import { useCountUp } from "@/lib/use-count-up";
import { cn } from "@/lib/cn";

const DAY_MINUTES = 16 * 60;
const leaveTypes = ["Annual leave", "Sick", "Parental", "Time off in lieu", "Unpaid", "Compassionate"] as const;

type SailState = "Sailed" | "At sea" | "Due" | "Short";

type Sailing = {
  t: string;
  from: string;
  to: string;
  state: SailState;
  mins: number;
  have: number;
  need: number;
  ship: string;
};

const corran: Sailing[] = [
  { t: "06:40", from: "Skerrow", to: "Inchmor", state: "Sailed", mins: 50, have: 11, need: 11, ship: "MV Corran" },
  { t: "08:20", from: "Inchmor", to: "Skerrow", state: "Sailed", mins: 50, have: 11, need: 11, ship: "MV Corran" },
  { t: "10:20", from: "Skerrow", to: "Inchmor", state: "At sea", mins: 50, have: 11, need: 11, ship: "MV Corran" },
  { t: "12:10", from: "Inchmor", to: "Skerrow", state: "Due", mins: 50, have: 11, need: 11, ship: "MV Corran" },
  { t: "14:10", from: "Skerrow", to: "Inchmor", state: "Due", mins: 50, have: 11, need: 11, ship: "MV Corran" },
  { t: "16:00", from: "Inchmor", to: "Skerrow", state: "Due", mins: 50, have: 11, need: 11, ship: "MV Corran" },
  { t: "17:50", from: "Skerrow", to: "Inchmor", state: "Due", mins: 50, have: 11, need: 11, ship: "MV Corran" },
  { t: "19:40", from: "Inchmor", to: "Skerrow", state: "Due", mins: 50, have: 11, need: 11, ship: "MV Corran" },
];

const brae: Sailing[] = [
  { t: "07:15", from: "Skerrow", to: "Rennay", state: "Sailed", mins: 50, have: 5, need: 5, ship: "MV Brae Lass" },
  { t: "09:00", from: "Rennay", to: "Skerrow", state: "Sailed", mins: 50, have: 5, need: 5, ship: "MV Brae Lass" },
  { t: "11:30", from: "Skerrow", to: "Rennay", state: "Due", mins: 50, have: 5, need: 5, ship: "MV Brae Lass" },
  { t: "13:30", from: "Rennay", to: "Skerrow", state: "Due", mins: 50, have: 5, need: 5, ship: "MV Brae Lass" },
  { t: "15:45", from: "Skerrow", to: "Rennay", state: "Short", mins: 50, have: 4, need: 5, ship: "MV Brae Lass" },
  { t: "18:00", from: "Rennay", to: "Skerrow", state: "Short", mins: 50, have: 4, need: 5, ship: "MV Brae Lass" },
];

const heat = [
  ["Deck", 1, [0.55, 0.9, 0.72, 0.4, 0.7, 0.86, 0.78]],
  ["Engine", 2, [0.48, 0.7, 0.66, 0.34, 0.8, 0.5, 0.62]],
  ["Galley", 3, [0.6, 0.42, 0.4, 0.55, 0.74, 0.22, 0.58]],
  ["Service", 4, [0.7, 0.88, 0.6, 0.76, 0.74, 0.8, 0.46]],
  ["Terminal", 5, [0.5, 0.72, 0.8, 0.5, 0.78, 0.7, 0.76]],
  ["Office", 6, [0.82, 0.9, 0.88, 0.8, 0.8, 0.2, 0.12]],
] as const;

const asks: [string, 1 | 2 | 3 | 4 | 5 | 6, string, string, string][] = [
  ["Molly Kaur", 6, "Time off", "Sick · 2–3 Nov", "Fit note to follow"],
  ["Idris Chen", 4, "Time off", "Time off in lieu · 6 Nov", "Owed from the double crossing"],
  ["Aisha Hughes", 2, "Time off", "Annual leave · 20–26 Nov", "Her sister’s wedding in Galway"],
  ["Kenji Arai", 2, "Swap", "Friday night watch", "Ruby Reid can take it"],
];

const commended = [
  ["Femi Popescu", "Ordinary seaman · Corran", 1, 4.4],
  ["Olumide Bakare", "Chief cook · Corran", 3, 4.3],
  ["Idris Chen", "Café steward · Corran", 4, 4.3],
  ["Molly Kowalski", "Cook · Corran", 3, 4.3],
] as const;

const upcoming = [
  ["Rosa Bennett", "Birthday · Terminal", "Today"],
  ["Freya Achterberg", "Birthday · Deck · Corran", "Tomorrow"],
  ["Isla Popescu", "6 years with us · Café steward", "Tomorrow"],
  ["Rahul Fischer", "Birthday · Engine room", "Thu 5"],
];

function minutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h! * 60 + m!;
}

function place(time: string) {
  return ((minutes(time) - 6 * 60) / DAY_MINUTES) * 100;
}

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

export function OverviewPage() {
  const { user } = useAuth();
  const { push } = useToast();
  const [bookOpen, setBookOpen] = useState(false);
  const [watchOpen, setWatchOpen] = useState(false);
  const [sailing, setSailing] = useState<Sailing | null>(null);
  const [onBreak, setOnBreak] = useState(false);
  const [signedOff, setSignedOff] = useState(false);

  return (
    <>
      <PageHeader
        title={`Good morning, ${user?.name.split(" ")[0] ?? "User"}`}
        subtitle="62 of 64 crew due so far are on duty and 2 didn’t show. 2 sailings are short of minimum crew — the next at 15:45. 6 time-off requests are waiting."
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

      <div className="grid min-w-0 grid-cols-1 items-start gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <Card className="p-4 md:p-5" delay={40}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Today on the water</h2>
              <p className="text-sm text-muted">14 sailings across two ships · 10 still to go</p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs font-semibold text-muted">
              <Legend swatch="bg-out" label="Sailed" />
              <Legend swatch="bg-accent" label="At sea" />
              <Legend swatch="bg-info" label="Boarding" />
              <Legend swatch="bg-bad" label="Short-crewed" />
            </div>
          </div>
          <div className="mt-5 w-full max-w-full overflow-x-auto">
            <div className="relative min-w-[760px] pt-6 lg:min-w-0">
              <div className="absolute top-0 right-0 left-[168px] h-4">
                {["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"].map((tick, index) => (
                  <span
                    key={tick}
                    className="absolute text-2xs font-semibold text-muted"
                    style={{
                      left: `${(index / 8) * 100}%`,
                      transform: index === 0 ? undefined : index === 8 ? "translateX(-100%)" : "translateX(-50%)",
                    }}
                  >
                    {tick}
                  </span>
                ))}
              </div>
              <Lane name="MV Corran" run="Skerrow ⇄ Inchmor" tone={1} sailings={corran} onOpen={setSailing} />
              <Lane name="MV Brae Lass" run="Skerrow ⇄ Rennay" tone={3} sailings={brae} onOpen={setSailing} />
              <span
                className="pointer-events-none absolute bottom-0 z-10 w-0.5 bg-now"
                style={{ top: 24, left: `calc(168px + (100% - 168px) * ${place("10:40") / 100})` }}
              >
                <b
                  className="absolute left-1/2 -translate-x-1/2 rounded-full bg-now px-1.5 py-px text-[10px] leading-4 font-bold whitespace-nowrap text-white"
                  style={{ top: -22 }}
                >
                  10:40
                </b>
              </span>
            </div>
          </div>
          <div className="mt-3.5 grid gap-2.5 md:grid-cols-3">
            {[
              ["10:20", "under way", "Skerrow → Inchmor", "MV Corran", "11/11"],
              ["11:30", "in 50m", "Skerrow → Rennay", "MV Brae Lass", "5/5"],
              ["12:10", "in 1h 30m", "Inchmor → Skerrow", "MV Corran", "11/11"],
            ].map(([time, when, run, ship, crew]) => (
              <button
                key={time}
                type="button"
                onClick={() => setSailing([...corran, ...brae].find((item) => item.t === time && item.ship === ship) ?? null)}
                className="flex cursor-pointer items-center gap-3 rounded-[14px] bg-card px-3 py-2.5 text-left shadow-[inset_0_0_0_1px_var(--line)] hover:bg-panel"
              >
                <span className="flex shrink-0 flex-col border-r border-line pr-3">
                  <b className="text-lg leading-tight font-semibold tracking-tight">{time}</b>
                  <small className="text-xs font-semibold text-muted">{when}</small>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{run}</span>
                  <span className="block truncate text-xs text-muted">{ship}</span>
                </span>
                <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-good-soft px-2 text-xs font-bold text-good">
                  {crew}
                </span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-4 md:p-5" delay={80}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold">My watch</h2>
              <p className="text-sm text-muted">Shore office · 08:00–16:30</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-in-text">
              <span className="relative grid size-2 place-items-center">
                <span className="size-2 rounded-full bg-good" />
                <span className="absolute size-3.5 rounded-full bg-good" style={{ animation: "breathe 2s ease-in-out infinite" }} />
              </span>
              Running
            </span>
          </div>
          <div className="mx-auto mt-4 grid size-40 place-items-center rounded-full" style={{ background: "conic-gradient(var(--accent) 0 110deg, var(--line-2) 110deg 360deg)" }}>
            <div className="grid size-[118px] place-items-center rounded-full bg-card text-center">
              <div>
                <p className="text-2xl font-semibold tabular-nums tracking-tight">02:35:54</p>
                <p className="text-2xs text-muted">of 8.5h today</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              className="flex-1"
              size="sm"
              onClick={() => {
                setOnBreak((current) => !current);
                push(onBreak ? "Came back from a break" : "Went on a break");
              }}
            >
              {onBreak ? "Back on watch" : "Take a break"}
            </Button>
            <Button
              className="flex-1"
              size="sm"
              variant={signedOff ? "primary" : "ink"}
              onClick={() => {
                setSignedOff((current) => !current);
                push(signedOff ? "Signed back on" : "Signed off after 2.6h");
              }}
            >
              {signedOff ? "Sign back on" : "Sign off"}
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted">Average day <b className="text-ink">6.9h</b></p>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Link to="/attendance/timesheets" className="block"><KpiTile tone={1} label="On duty now" value={<><Figure value={62} /> / 83</>} foot="97% of those due are aboard" /></Link>
        <Link to="/attendance/timesheets"><KpiTile tone={2} delay={60} label="Crewed to minimum" value={<><Figure value={8} /> / 10 to go</>} foot="2 short · next 15:45" /></Link>
        <KpiTile tone={3} delay={120} label="Off today" value={<Figure value={7} />} foot="2 sick · 5 planned" />
        <KpiTile tone={4} delay={180} label="Open berths" value={<Figure value={8} />} foot="across 5 roles" />
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        <Card className="xl:col-span-1" delay={80}>
          <CardHeader title="Crew hours this week" subtitle="4,410 hours rostered · by department and day" />
          <div className="px-4 pb-4 md:px-5">
            <div className="mb-2 grid grid-cols-[minmax(0,72px)_repeat(7,minmax(0,1fr))] gap-1 text-center text-2xs font-semibold text-muted">
              <span />
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <span key={day} className={day === "Tue" ? "text-ink" : undefined}>{day}</span>
              ))}
            </div>
            <div className="grid gap-1.5">
              {heat.map(([name, tone, cells]) => (
                <div key={name} className="grid grid-cols-[minmax(0,72px)_repeat(7,minmax(0,1fr))] items-center gap-1">
                  <span className="truncate text-xs font-semibold" style={{ color: `var(--c${tone})` }}>{name}</span>
                  {cells.map((cell, index) => (
                    <span
                      key={index}
                      className="h-6 rounded-[6px]"
                      style={{ background: `color-mix(in srgb, var(--c${tone}) ${Math.round(18 + cell * 72)}%, transparent)` }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card delay={120}>
          <CardHeader title="Waiting on you" subtitle="10 decisions · oldest Sat, 6:02" action={<Link to="/payroll/run" className="text-sm font-semibold text-accent-text">All</Link>} />
          <ul className="grid gap-3 px-4 pb-4 md:px-5">
            {asks.map(([name, tone, type, when, note]) => (
              <li key={name} className="flex items-start gap-3">
                <Avatar name={name} tone={tone} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs text-muted">{type} · {when}</p>
                  <p className="text-xs text-ink-2">“{note}”</p>
                </div>
                <StatusPill tone="warn">{type === "Swap" ? "Swap" : "Leave"}</StatusPill>
              </li>
            ))}
          </ul>
        </Card>

        <Card delay={160}>
          <CardHeader title="Most commended" subtitle="Reviews and shout-outs, this month" action={<Link to="/performance/goals" className="text-sm font-semibold text-accent-text">All</Link>} />
          <ol className="grid gap-3 px-4 pb-4 md:px-5">
            {commended.map(([name, role, tone, score], index) => (
              <li key={name} className="flex items-center gap-3">
                <span className="w-4 text-xs font-bold text-muted">{index + 1}</span>
                <Avatar name={name} tone={tone} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{name}</p>
                  <p className="truncate text-xs text-muted">{role}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums">{score.toFixed(1)}</span>
              </li>
            ))}
          </ol>
          <div className="px-4 pb-5 md:px-5">
            <p className="mb-2 text-xs font-semibold text-muted">November overtime · 363h</p>
            <Meter value={0.72} label="Overtime against the summer peak" />
          </div>
        </Card>
      </div>

      <Card delay={200}>
        <CardHeader title="Coming up" subtitle="The next ten days" />
        <ul className="grid gap-2 px-4 pb-4 sm:grid-cols-2 md:px-5 lg:grid-cols-4">
          {upcoming.map(([name, detail, when]) => (
            <li key={name} className="rounded-md bg-side-well px-3 py-3">
              <p className="text-sm font-semibold">{name}</p>
              <p className="text-xs text-muted">{detail}</p>
              <p className="mt-2 text-xs font-semibold text-accent-text">{when}</p>
            </li>
          ))}
        </ul>
      </Card>

      <BookTimeOff open={bookOpen} onClose={() => setBookOpen(false)} />
      <AddWatch open={watchOpen} onClose={() => setWatchOpen(false)} />
      <SailingDialog sailing={sailing} onClose={() => setSailing(null)} />
    </>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-3 rounded-[3px] ${swatch}`} />
      {label}
    </span>
  );
}

function Lane({
  name,
  run,
  tone,
  sailings,
  onOpen,
}: {
  name: string;
  run: string;
  tone: 1 | 3;
  sailings: Sailing[];
  onOpen: (sailing: Sailing) => void;
}) {
  return (
    <div className="mb-2.5 grid min-h-[76px] grid-cols-[168px_minmax(0,1fr)] items-center">
      <div className="flex min-w-0 items-center gap-2.5 pr-3">
        <span
          className="grid size-9 shrink-0 place-items-center rounded-xl"
          style={{
            color: `color-mix(in oklab, var(--c${tone}) 80%, var(--ink))`,
            background: `color-mix(in oklab, var(--c${tone}) 14%, var(--card))`,
          }}
        >
          <Icon name="ship" className="size-5" />
        </span>
        <span className="min-w-0">
          <b className="block truncate text-sm">{name}</b>
          <small className="block truncate text-xs font-medium text-muted">{run}</small>
        </span>
      </div>
      <div className="relative h-[76px] overflow-hidden rounded-[14px] bg-panel shadow-[inset_0_0_0_1px_var(--line)]">
        {Array.from({ length: 15 }, (_, index) => (
          <i
            key={index}
            className="absolute top-2.5 bottom-2.5 w-px bg-line"
            style={{ left: `${((index + 1) / 16) * 100}%` }}
          />
        ))}
        {sailings.map((sailing) => (
          <button
            key={`${sailing.ship}-${sailing.t}`}
            type="button"
            onClick={() => onOpen(sailing)}
            aria-label={`${sailing.t} ${sailing.from} to ${sailing.to}, ${sailing.state}`}
            className={cn(
              "absolute top-3 bottom-3 flex w-max max-w-[92px] cursor-pointer flex-col justify-center overflow-hidden rounded-[11px] px-2 text-left",
              sailing.state === "Sailed" && "bg-canvas text-ink-2",
              sailing.state === "At sea" && "bg-accent text-accent-ink",
              sailing.state === "Due" && "bg-card shadow-raise ring-1 ring-line-strong",
              sailing.state === "Short" && "bg-card shadow-[inset_0_0_0_1.5px_var(--bad)]",
            )}
            style={{ left: `${place(sailing.t)}%` }}
          >
            {sailing.state === "Short" ? <i className="absolute inset-y-0 left-0 w-1 bg-bad" /> : null}
            <b className="relative text-xs leading-tight font-bold">{sailing.t}</b>
            <small className="relative truncate text-[10px] font-semibold text-current/80">{sailing.to}</small>
            {sailing.state === "Sailed" ? <Icon name="check" className="absolute top-1 right-1 size-3 text-muted" /> : null}
            {sailing.state === "Short" ? (
              <span className="absolute top-1 right-1 grid h-4 min-w-5 place-items-center rounded-full bg-bad px-1 text-[10px] font-bold text-white">
                −{sailing.need - sailing.have}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
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

function SailingDialog({ sailing, onClose }: { sailing: Sailing | null; onClose: () => void }) {
  const short = sailing ? sailing.need - sailing.have : 0;
  return (
    <Modal
      open={sailing !== null}
      title={sailing ? `${sailing.t} ${sailing.from} → ${sailing.to}` : ""}
      description={sailing ? `${sailing.ship} · ${sailing.mins} min crossing · ${sailing.state}` : undefined}
      onClose={onClose}
      footer={<Button onClick={onClose}>Close</Button>}
    >
      {sailing ? (
        <div className="flex items-center gap-4 rounded-[14px] bg-side-well px-4 py-3">
          <p className="text-2xl font-semibold tabular-nums tracking-tight">
            {sailing.have}/{sailing.need}
          </p>
          <div>
            <p className="text-sm font-semibold">
              {short > 0 ? `${short} short of minimum crew` : "Crewed to minimum"}
            </p>
            <p className="text-xs text-muted">{sailing.have} aboard at departure · minimum set by the safe manning certificate</p>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
