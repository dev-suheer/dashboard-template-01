import type { Base, Department } from "@/types/domain";

export const departments: Department[] = [
  {
    id: "deck",
    name: "Deck",
    short: "Deck",
    tone: 1,
    blurb: "Masters, mates, bosuns and able seamen",
  },
  {
    id: "engine",
    name: "Engine room",
    short: "Engine",
    tone: 2,
    blurb: "Engineers, motormen and electro-technical officers",
  },
  {
    id: "galley",
    name: "Galley",
    short: "Galley",
    tone: 3,
    blurb: "Cooks and galley hands, crew and passenger meals",
  },
  {
    id: "cafe",
    name: "Onboard service",
    short: "Service",
    tone: 4,
    blurb: "The café, the shop and the passenger lounge",
  },
  {
    id: "terminal",
    name: "Terminal",
    short: "Terminal",
    tone: 5,
    blurb: "Tickets, the linkspan and vehicle marshalling",
  },
  {
    id: "office",
    name: "Shore office",
    short: "Office",
    tone: 6,
    blurb: "Crewing, finance, fleet maintenance and bookings",
  },
];

export const bases: Base[] = [
  {
    id: "corran",
    name: "MV Corran",
    short: "Corran",
    run: "Skerrow ⇄ Inchmor",
    tone: 1,
  },
  {
    id: "brae",
    name: "MV Brae Lass",
    short: "Brae Lass",
    run: "Skerrow ⇄ Rennay",
    tone: 3,
  },
  {
    id: "terminal",
    name: "Skerrow terminal",
    short: "Terminal",
    run: "Port Skerrow",
    tone: 5,
  },
];

export const departmentById = Object.fromEntries(
  departments.map((department) => [department.id, department]),
) as Record<Department["id"], Department>;

export const baseById = Object.fromEntries(
  bases.map((base) => [base.id, base]),
) as Record<Base["id"], Base>;

/** Demo clock. The reference desk is frozen on this morning. */
export const NOW = new Date(2026, 10, 3, 10, 40, 0);

export const session = {
  name: "Isla Macrae",
  role: "Head of Crewing",
  initials: "IM",
  place: "Shore office, Port Skerrow",
};
