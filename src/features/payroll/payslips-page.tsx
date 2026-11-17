import { useMemo, useState } from "react";
import { TextField } from "@/components/ui/field";
import { Icon } from "@/components/icons";
import { BaseMark } from "@/components/ui/person";
import { SectionTabs } from "@/components/ui/section-tabs";
import { payrollTabs } from "@/app/navigation";
import { Avatar, Card, PageHeader, StatusPill } from "@/components/ui/surface";
import { people } from "@/data/people";
import { departmentById } from "@/data/world";
import { formatMoney } from "@/lib/format";

function slip(id: string) {
  const seed = Number(id.slice(1));
  const gross = 1800 + (seed % 17) * 140;
  const net = Math.round(gross * 0.79);
  return { gross, net };
}

export function PayslipsPage() {
  const [query, setQuery] = useState("");
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return people.filter((person) => !q || person.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <>
      <PageHeader
        title="Payslips"
        subtitle="November 2026 · one slip per person, locked once the run is approved."
      />
      <SectionTabs items={payrollTabs} />
      <Card className="p-4 md:p-5" delay={40}>
        <TextField
          aria-label="Search payslips"
          placeholder="Search by name"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          leading={<Icon name="search" className="size-4" />}
          fieldClassName="max-w-sm"
        />
        <div className="mt-4 w-full max-w-full overflow-x-auto">
          <table className="w-full min-w-[680px] text-left">
            <thead className="text-xs font-semibold text-muted">
              <tr>
                {["Person", "Base", "Gross", "Net", "Status"].map((heading) => (
                  <th key={heading} className="px-2 py-2 font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((person) => {
                const money = slip(person.id);
                const held = person.status === "Notice";
                return (
                  <tr key={person.id} className="border-t border-line">
                    <td className="px-2 py-2.5">
                      <span className="flex items-center gap-3">
                        <Avatar name={person.name} tone={departmentById[person.dept].tone} size="sm" />
                        <span>
                          <span className="block text-sm font-semibold">{person.name}</span>
                          <span className="block text-xs text-muted">{person.role}</span>
                        </span>
                      </span>
                    </td>
                    <td className="px-2 py-2.5"><BaseMark id={person.base} /></td>
                    <td className="px-2 py-2.5 text-sm font-semibold tabular-nums">{formatMoney(money.gross)}</td>
                    <td className="px-2 py-2.5 text-sm tabular-nums">{formatMoney(money.net)}</td>
                    <td className="px-2 py-2.5">
                      <StatusPill tone={held ? "warn" : "good"}>{held ? "Held" : "Ready"}</StatusPill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
