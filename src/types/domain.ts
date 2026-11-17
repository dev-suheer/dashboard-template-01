export type DepartmentId =
  | "deck"
  | "engine"
  | "galley"
  | "cafe"
  | "terminal"
  | "office";

export type BaseId = "corran" | "brae" | "terminal";

export type Contract =
  | "Full-time"
  | "Part-time"
  | "Seasonal"
  | "Probation"
  | "Notice";

export type PersonStatus = "Active" | "Probation" | "Off today" | "Notice";

export type Person = {
  id: string;
  name: string;
  role: string;
  dept: DepartmentId;
  base: BaseId;
  contract: Contract;
  status: PersonStatus;
  start: string;
  email: string;
};

export type Department = {
  id: DepartmentId;
  name: string;
  short: string;
  /** 1–6, maps to --cN and --hN */
  tone: 1 | 2 | 3 | 4 | 5 | 6;
  blurb: string;
};

export type Base = {
  id: BaseId;
  name: string;
  short: string;
  run: string;
  tone: 1 | 3 | 5;
};
