import type { BaseId, DepartmentId } from "@/types/domain";
import { baseById, departmentById } from "@/data/world";

export function DeptTag({ id }: { id: DepartmentId }) {
  const department = departmentById[id];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold"
      style={{
        color: `var(--c${department.tone})`,
        background: `color-mix(in srgb, var(--c${department.tone}) 14%, transparent)`,
      }}
    >
      {department.short}
    </span>
  );
}

export function BaseMark({ id }: { id: BaseId }) {
  const base = baseById[id];
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2">
      <span className="size-2 rounded-full" style={{ background: `var(--c${base.tone})` }} />
      {base.short}
    </span>
  );
}
