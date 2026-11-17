import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import { SelectField, TextField } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { FilterChip } from "@/components/ui/search-field";
import { Avatar, Card, Meter, PageHeader, StatusPill } from "@/components/ui/surface";
import { useToast } from "@/lib/toast";
import { departmentById, departments } from "@/data/world";
import type { DepartmentId } from "@/types/domain";

const goals = [
  { id: "G1", title: "Cut no-shows on the Brae Lass morning watch", owner: "Fergus Mair", dept: "deck" as const, due: "30 Nov", progress: 0.62, status: "On track" },
  { id: "G2", title: "Every ENG1 renewed before the winter timetable", owner: "Kenji Arai", dept: "engine" as const, due: "12 Dec", progress: 0.4, status: "At risk" },
  { id: "G3", title: "Galley overtime under 40 hours a week", owner: "Olumide Bakare", dept: "galley" as const, due: "30 Nov", progress: 0.78, status: "On track" },
  { id: "G4", title: "Day-30 reviews for this month’s joiners", owner: "Isla Macrae", dept: "office" as const, due: "3 Dec", progress: 0.25, status: "Started" },
  { id: "G5", title: "Linkspan drills logged for every operator", owner: "Tessa Brodie", dept: "terminal" as const, due: "21 Nov", progress: 0.9, status: "On track" },
  { id: "G6", title: "Café waste under 8% of covers", owner: "Carmen Ibáñez", dept: "cafe" as const, due: "30 Nov", progress: 0.55, status: "On track" },
  { id: "G7", title: "Buddy assigned before a joiner’s first sailing", owner: "Dev Sharma", dept: "office" as const, due: "15 Nov", progress: 1, status: "Done" },
  { id: "G8", title: "Second mate ticket pipeline filled", owner: "Euan Moffat", dept: "deck" as const, due: "31 Jan", progress: 0.15, status: "Started" },
];

const tone = {
  "On track": "good",
  "At risk": "warn",
  Started: "info",
  Done: "good",
} as const;

export function GoalsPage() {
  const { push } = useToast();
  const [dept, setDept] = useState<DepartmentId | "all">("all");
  const [status, setStatus] = useState<string>("all");
  const [items, setItems] = useState(goals);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("Isla Macrae");
  const [goalDept, setGoalDept] = useState<DepartmentId>("deck");
  const rows = useMemo(
    () => items.filter((goal) => (dept === "all" || goal.dept === dept) && (status === "all" || goal.status === status)),
    [items, dept, status],
  );

  return (
    <>
      <PageHeader
        title="Goals"
        subtitle="What the departments are holding themselves to this quarter. Autumn reviews sit with the managers."
        actions={
          <Button variant="primary" magnetic icon={<Icon name="plus" className="size-4" />} onClick={() => setOpen(true)}>
            New goal
          </Button>
        }
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          <FilterChip active={status === "all"} onClick={() => setStatus("all")}>All</FilterChip>
          {["On track", "At risk", "Started", "Done"].map((item) => (
            <FilterChip key={item} active={status === item} onClick={() => setStatus(item)}>{item}</FilterChip>
          ))}
        </div>
        <div className="sm:ml-auto sm:w-56">
          <SelectField aria-label="Department" value={dept} onChange={(event) => setDept(event.target.value as typeof dept)}>
            <option value="all">All departments</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>{department.name}</option>
            ))}
          </SelectField>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map((goal, index) => (
          <Card key={goal.id} delay={index * 40} className="p-4 md:p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold tracking-tight">{goal.title}</h2>
              <StatusPill tone={tone[goal.status as keyof typeof tone]}>{goal.status}</StatusPill>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Avatar name={goal.owner} tone={departmentById[goal.dept].tone} size="sm" />
              <div>
                <p className="text-sm font-semibold">{goal.owner}</p>
                <p className="text-xs text-muted">{departmentById[goal.dept].name} · due {goal.due}</p>
              </div>
              <p className="ml-auto text-xl font-semibold tabular-nums">{Math.round(goal.progress * 100)}%</p>
            </div>
            <div className="mt-3" style={{ color: `var(--c${departmentById[goal.dept].tone})` }}>
              <Meter value={goal.progress} tone="dept" label={goal.title} />
            </div>
          </Card>
        ))}
      </div>
      {rows.length === 0 ? <p className="text-sm text-muted">No goals in that slice.</p> : null}
      <Modal
        open={open}
        title="New goal"
        description="A target the department can see on this board."
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                const next = title.trim();
                if (next.length < 3) return;
                setItems((current) => [
                  { id: `G${current.length + 1}`, title: next, owner, dept: goalDept, due: "31 Dec", progress: 0, status: "Started" },
                  ...current,
                ]);
                setTitle("");
                setOpen(false);
                push("Goal added");
              }}
            >
              Add goal
            </Button>
          </>
        }
      >
        <div className="grid gap-3">
          <TextField label="Goal" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What should be true by the due date" />
          <TextField label="Owner" value={owner} onChange={(event) => setOwner(event.target.value)} />
          <SelectField label="Department" value={goalDept} onChange={(event) => setGoalDept(event.target.value as DepartmentId)}>
            {departments.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </SelectField>
        </div>
      </Modal>
    </>
  );
}
