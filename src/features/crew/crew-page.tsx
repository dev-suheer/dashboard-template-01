import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons";
import { BaseMark, DeptTag } from "@/components/ui/person";
import { FilterChip } from "@/components/ui/search-field";
import { SelectField, TextField } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Avatar, Card, PageHeader, StatusPill } from "@/components/ui/surface";
import { people } from "@/data/people";
import { bases, departmentById, departments } from "@/data/world";
import { formatDate, tenure } from "@/lib/format";
import { useToast } from "@/lib/toast";
import type { BaseId, Contract, DepartmentId } from "@/types/domain";

const contracts: Contract[] = ["Full-time", "Part-time", "Seasonal", "Probation", "Notice"];

const statusTone = {
  Active: "good",
  Probation: "info",
  "Off today": "warn",
  Notice: "bad",
} as const;

export function CrewPage() {
  const { push } = useToast();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"name" | "dept" | "start">("name");
  const [dept, setDept] = useState<DepartmentId | "all">("all");
  const [base, setBase] = useState<BaseId | "all">("all");
  const [contract, setContract] = useState<Contract | "all">("all");
  const [addOpen, setAddOpen] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return people
      .filter((person) => {
        if (dept !== "all" && person.dept !== dept) return false;
        if (base !== "all" && person.base !== base) return false;
        if (contract !== "all" && person.contract !== contract) return false;
        if (!q) return true;
        return `${person.name} ${person.role} ${person.email}`.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        if (sort === "dept") return a.dept.localeCompare(b.dept) || a.name.localeCompare(b.name);
        if (sort === "start") return a.start.localeCompare(b.start);
        return a.name.localeCompare(b.name);
      });
  }, [query, sort, dept, base, contract]);

  return (
    <>
      <PageHeader
        title="Crew"
        subtitle={`${people.length} people across two ships, the terminal and six departments.`}
        actions={
          <>
            <Button icon={<Icon name="download" className="size-4" />} onClick={() => push("Crew list exported")}>
              Export
            </Button>
            <Button variant="primary" magnetic icon={<Icon name="plus" className="size-4" />} onClick={() => setAddOpen(true)}>
              Add a person
            </Button>
          </>
        }
      />

      <Card className="p-4 md:p-5" delay={60}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <TextField
            aria-label="Search by name, job or email"
            placeholder="Search by name, job or email"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            leading={<Icon name="search" className="size-4" />}
            fieldClassName="lg:max-w-sm lg:flex-1"
          />
          <p className="text-sm font-semibold text-muted tabular-nums">
            {rows.length} of {people.length}
          </p>
          <div className="lg:ml-auto lg:w-52">
            <SelectField aria-label="Sort" value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
              <option value="name">Name</option>
              <option value="dept">Department</option>
              <option value="start">Longest serving</option>
            </SelectField>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <FilterChip active={dept === "all"} onClick={() => setDept("all")}>All departments</FilterChip>
          {departments.map((department) => (
            <FilterChip
              key={department.id}
              active={dept === department.id}
              count={people.filter((person) => person.dept === department.id).length}
              onClick={() => setDept(department.id)}
            >
              {department.name}
            </FilterChip>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {bases.map((item) => (
            <FilterChip key={item.id} active={base === item.id} onClick={() => setBase(base === item.id ? "all" : item.id)}>
              {item.short}
            </FilterChip>
          ))}
          {contracts.map((item) => (
            <FilterChip key={item} active={contract === item} onClick={() => setContract(contract === item ? "all" : item)}>
              {item}
            </FilterChip>
          ))}
        </div>

        <div className="mt-4 w-full max-w-full overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="text-xs font-semibold text-muted">
              <tr>
                {["Name", "Department", "Base", "Contract", "Started", "Status"].map((heading) => (
                  <th key={heading} className="px-2 py-2 font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((person, index) => (
                <tr
                  key={person.id}
                  className="row-in border-t border-line"
                  style={{ animationDelay: `${Math.min(index, 12) * 20}ms` }}
                >
                  <td className="px-2 py-2.5">
                    <span className="flex items-center gap-3">
                      <Avatar name={person.name} tone={departmentById[person.dept].tone} />
                      <span>
                        <span className="block text-sm font-semibold">{person.name}</span>
                        <span className="block text-xs text-muted">{person.role}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-2 py-2.5"><DeptTag id={person.dept} /></td>
                  <td className="px-2 py-2.5"><BaseMark id={person.base} /></td>
                  <td className="px-2 py-2.5 text-sm">{person.contract}</td>
                  <td className="px-2 py-2.5">
                    <span className="block text-sm">{formatDate(person.start)}</span>
                    <span className="block text-xs text-muted">{tenure(person.start)}</span>
                  </td>
                  <td className="px-2 py-2.5">
                    <StatusPill tone={statusTone[person.status]}>{person.status}</StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">Nobody matches those filters.</p>
          ) : null}
        </div>
      </Card>
      <AddPerson open={addOpen} onClose={() => setAddOpen(false)} onSaved={(name) => push(`${name.split(" ")[0]} is in. Onboarding checklist started.`)} />
    </>
  );
}

function AddPerson({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: (name: string) => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [dept, setDept] = useState<DepartmentId>("engine");
  const [base, setBase] = useState<BaseId>("corran");
  const [contract, setContract] = useState<Contract>("Full-time");
  const [start, setStart] = useState("2026-11-16");
  const [error, setError] = useState("");

  return (
    <Modal
      open={open}
      title="Add a crew member"
      description="They get a Temp01 invite and a joiner checklist."
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => {
              if (name.trim().split(" ").length < 2) {
                setError("Use a first and last name.");
                return;
              }
              if (role.trim().length < 2) {
                setError("Add the role.");
                return;
              }
              onSaved(name.trim());
              setName("");
              setRole("");
              setError("");
              onClose();
            }}
          >
            Add person
          </Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField label="Full name" fieldClassName="sm:col-span-2" value={name} onChange={(event) => setName(event.target.value)} error={error && name.trim().split(" ").length < 2 ? error : undefined} />
        <TextField label="Role" fieldClassName="sm:col-span-2" value={role} onChange={(event) => setRole(event.target.value)} />
        <SelectField label="Department" value={dept} onChange={(event) => setDept(event.target.value as DepartmentId)}>
          {departments.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </SelectField>
        <SelectField label="Base" value={base} onChange={(event) => setBase(event.target.value as BaseId)}>
          {bases.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </SelectField>
        <SelectField label="Contract" value={contract} onChange={(event) => setContract(event.target.value as Contract)}>
          {contracts.filter((item) => item !== "Notice").map((item) => (
            <option key={item}>{item}</option>
          ))}
        </SelectField>
        <TextField label="Starts" type="date" value={start} onChange={(event) => setStart(event.target.value)} />
      </div>
    </Modal>
  );
}
