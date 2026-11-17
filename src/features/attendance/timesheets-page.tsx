import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import { SelectField, TextField } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { BaseMark, DeptTag } from "@/components/ui/person";
import { Avatar, Card, KpiTile, PageHeader, StatusPill } from "@/components/ui/surface";
import { people } from "@/data/people";
import { departments } from "@/data/world";
import { useToast } from "@/lib/toast";
import type { DepartmentId } from "@/types/domain";

const days = [
  { key: "mon", label: "Mon 26" },
  { key: "tue", label: "Tue 27" },
  { key: "wed", label: "Wed 28" },
  { key: "thu", label: "Thu 29" },
  { key: "fri", label: "Fri 30" },
  { key: "sat", label: "Sat 31" },
  { key: "sun", label: "Sun 1" },
];

function hoursFor(id: string, day: number) {
  const seed = Number(id.slice(1)) + day * 17;
  if (seed % 11 === 0) return 0;
  return 6 + (seed % 4);
}

export function TimesheetsPage() {
  const { push } = useToast();
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState<DepartmentId | "all">("all");
  const [confirm, setConfirm] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return people
      .filter((person) => (dept === "all" || person.dept === dept) && (!q || person.name.toLowerCase().includes(q)))
      .map((person) => {
        const hours = days.map((_, index) => hoursFor(person.id, index));
        const total = hours.reduce((sum, value) => sum + value, 0);
        const pending = Number(person.id.slice(1)) % 9 === 0;
        return { person, hours, total, pending };
      });
  }, [query, dept]);

  const approved = rows.filter((row) => !row.pending);
  const pending = rows.length - approved.length;
  const totalHours = rows.reduce((sum, row) => sum + row.total, 0);

  return (
    <>
      <PageHeader
        title="Timesheets"
        subtitle="Week of 26 Oct – 1 Nov. Approved hours go into November’s pay."
        actions={
          <Button variant="primary" magnetic icon={<Icon name="check" className="size-4" />} onClick={() => setConfirm(true)}>
            Approve week
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <KpiTile tone={1} label="Hours this week" value={totalHours.toLocaleString("en-GB")} foot="Across the filtered crew" />
        <KpiTile tone={2} delay={60} label="Approved" value={approved.length} foot="Ready for the pay run" />
        <KpiTile tone={4} delay={120} label="Still open" value={pending} foot="Needs a signature" />
      </div>

      <Card className="p-4 md:p-5" delay={80}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <TextField
            aria-label="Search timesheets"
            placeholder="Search by name"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            leading={<Icon name="search" className="size-4" />}
            fieldClassName="md:max-w-sm"
          />
          <div className="md:w-56">
            <SelectField aria-label="Department" value={dept} onChange={(event) => setDept(event.target.value as typeof dept)}>
              <option value="all">All departments</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>{department.name}</option>
              ))}
            </SelectField>
          </div>
          <p className="text-sm font-semibold text-muted md:ml-auto">{rows.length} sheets</p>
        </div>

        <div className="mt-4 w-full max-w-full overflow-x-auto">
          <table className="w-full min-w-[880px] text-left">
            <thead className="text-xs font-semibold text-muted">
              <tr>
                <th className="px-2 py-2 font-semibold">Person</th>
                {days.map((day) => (
                  <th key={day.key} className="px-2 py-2 text-right font-semibold">{day.label}</th>
                ))}
                <th className="px-2 py-2 text-right font-semibold">Total</th>
                <th className="px-2 py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.person.id} className="border-t border-line">
                  <td className="px-2 py-2.5">
                    <span className="flex items-center gap-3">
                      <Avatar name={row.person.name} tone={departments.find((item) => item.id === row.person.dept)?.tone ?? 1} size="sm" />
                      <span>
                        <span className="block text-sm font-semibold">{row.person.name}</span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-2">
                          <DeptTag id={row.person.dept} />
                          <BaseMark id={row.person.base} />
                        </span>
                      </span>
                    </span>
                  </td>
                  {row.hours.map((value, index) => (
                    <td key={days[index]!.key} className="px-2 py-2.5 text-right text-sm tabular-nums text-ink-2">
                      {value === 0 ? "—" : `${value}h`}
                    </td>
                  ))}
                  <td className="px-2 py-2.5 text-right text-sm font-semibold tabular-nums">{row.total}h</td>
                  <td className="px-2 py-2.5">
                    <StatusPill tone={row.pending ? "warn" : "good"}>{row.pending ? "Pending" : "Approved"}</StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal
        open={confirm}
        title="Approve this week?"
        description="Approved hours go into November’s pay. Pending rows stay open until someone signs them."
        onClose={() => setConfirm(false)}
        footer={
          <>
            <Button onClick={() => setConfirm(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                setConfirm(false);
                push("Approved hours locked for November");
              }}
            >
              Approve week
            </Button>
          </>
        }
      />
    </>
  );
}
