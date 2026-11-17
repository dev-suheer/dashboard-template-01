import type { BaseId, Contract, DepartmentId, Person, PersonStatus } from "@/types/domain";

type Row = [
  name: string,
  role: string,
  dept: DepartmentId,
  base: BaseId,
  contract: Contract,
  status: PersonStatus,
  start: string,
];

const rows: Row[] = [
  ["Ade Mensah", "Café steward", "cafe", "corran", "Full-time", "Active", "2022-10-28"],
  ["Agnieszka Lund", "Finance assistant", "office", "terminal", "Full-time", "Active", "2023-12-25"],
  ["Aisha Barker", "Vehicle marshal", "terminal", "terminal", "Part-time", "Active", "2021-04-04"],
  ["Aisha Hughes", "Motorman", "engine", "corran", "Full-time", "Active", "2023-01-07"],
  ["Ama Owusu", "Chief mate", "deck", "brae", "Full-time", "Off today", "2022-10-12"],
  ["Arjun Rahman", "Café steward", "cafe", "corran", "Full-time", "Active", "2020-03-03"],
  ["Arjun Yusuf", "Terminal supervisor", "terminal", "terminal", "Full-time", "Active", "2025-04-30"],
  ["Beatriz Achterberg", "Second engineer", "engine", "brae", "Full-time", "Active", "2026-07-06"],
  ["Bilal Fraser", "Purser’s assistant", "cafe", "corran", "Full-time", "Active", "2024-07-17"],
  ["Bilal Kowalski", "Café steward", "cafe", "brae", "Seasonal", "Probation", "2026-08-09"],
  ["Carmen Ibáñez", "Onboard service manager", "cafe", "corran", "Full-time", "Active", "2021-07-17"],
  ["Chiara Kaur", "Able seaman", "deck", "brae", "Full-time", "Active", "2022-05-11"],
  ["Clara Byrne", "Engine rating", "engine", "corran", "Full-time", "Active", "2023-06-02"],
  ["Daisy Novak", "Motorman", "engine", "brae", "Full-time", "Active", "2021-11-19"],
  ["Dev Sharma", "Crewing coordinator", "office", "terminal", "Full-time", "Active", "2022-02-14"],
  ["Dmitri Rahman", "Ordinary seaman", "deck", "corran", "Full-time", "Active", "2024-01-09"],
  ["Elif Hartley", "Able seaman", "deck", "corran", "Full-time", "Active", "2023-08-21"],
  ["Esme Rahman", "Second engineer", "engine", "corran", "Full-time", "Active", "2020-09-01"],
  ["Euan Moffat", "Master", "deck", "corran", "Full-time", "Active", "2016-04-18"],
  ["Fatima Achterberg", "Engine rating", "engine", "brae", "Full-time", "Active", "2024-03-12"],
  ["Fatima Iqbal", "Fleet fitter", "office", "terminal", "Full-time", "Active", "2019-05-06"],
  ["Femi Achterberg", "Ordinary seaman", "deck", "brae", "Full-time", "Active", "2025-02-02"],
  ["Femi Malik", "Ticket agent", "terminal", "terminal", "Full-time", "Off today", "2021-08-30"],
  ["Femi Popescu", "Ordinary seaman", "deck", "corran", "Full-time", "Active", "2023-09-14"],
  ["Fergus Mair", "Master", "deck", "brae", "Full-time", "Active", "2015-03-22"],
  ["Freya Ahmed", "Motorman", "engine", "corran", "Full-time", "Active", "2022-06-08"],
  ["Freya Achterberg", "Able seaman", "deck", "corran", "Full-time", "Active", "2024-11-04"],
  ["Harriet Yusuf", "Able seaman", "deck", "corran", "Full-time", "Active", "2020-12-01"],
  ["Hollie Kaur", "Able seaman", "deck", "corran", "Full-time", "Active", "2023-04-16"],
  ["Idris Chen", "Café steward", "cafe", "corran", "Full-time", "Active", "2022-01-20"],
  ["Idris Iqbal", "Able seaman", "deck", "corran", "Full-time", "Active", "2021-10-11"],
  ["Isla Macrae", "Head of Crewing", "office", "terminal", "Full-time", "Active", "2018-01-08"],
  ["Jamal Murray", "Ordinary seaman", "deck", "corran", "Full-time", "Active", "2024-06-03"],
  ["Kenji Arai", "Chief engineer", "engine", "corran", "Full-time", "Active", "2017-09-12"],
  ["Kofi Nakamura", "Motorman", "engine", "brae", "Full-time", "Active", "2023-03-27"],
  ["Kwame Walsh", "Linkspan operator", "terminal", "terminal", "Full-time", "Off today", "2022-07-19"],
  ["Luca Hughes", "Ticket agent", "terminal", "terminal", "Full-time", "Off today", "2020-02-11"],
  ["Marek Doyle", "Able seaman", "deck", "corran", "Full-time", "Active", "2023-05-15"],
  ["Mateus Novak", "Vehicle marshal", "terminal", "terminal", "Full-time", "Off today", "2019-11-02"],
  ["Maya Kowalski", "Crewing assistant", "office", "terminal", "Full-time", "Active", "2024-09-01"],
  ["Mei Adeyemi", "Ordinary seaman", "deck", "corran", "Full-time", "Active", "2025-01-13"],
  ["Mei Novak", "Motorman", "engine", "corran", "Full-time", "Active", "2022-08-23"],
  ["Molly Kaur", "Finance assistant", "office", "terminal", "Full-time", "Off today", "2023-02-06"],
  ["Molly Kowalski", "Cook", "galley", "corran", "Full-time", "Active", "2021-06-14"],
  ["Nadia Farouk", "Finance manager", "office", "terminal", "Full-time", "Active", "2018-10-01"],
  ["Nell Doyle", "Crewing assistant", "office", "terminal", "Full-time", "Active", "2025-03-18"],
  ["Olumide Bakare", "Chief cook", "galley", "corran", "Full-time", "Active", "2017-04-04"],
  ["Patrick Byrne", "Engine rating", "engine", "brae", "Full-time", "Active", "2024-08-12"],
  ["Patrick Lindqvist", "Marine superintendent", "office", "terminal", "Full-time", "Active", "2014-06-01"],
  ["Precious Iqbal", "Fleet fitter", "office", "terminal", "Full-time", "Active", "2023-11-20"],
  ["Rahul Fischer", "Electro-technical officer", "engine", "corran", "Full-time", "Active", "2019-01-28"],
  ["Ravi O'Neill", "Bookings advisor", "office", "terminal", "Full-time", "Active", "2022-09-05"],
  ["Rory Lindsay", "Operations director", "office", "terminal", "Full-time", "Active", "2012-05-14"],
  ["Rosa Bennett", "Ticket agent", "terminal", "terminal", "Full-time", "Active", "2024-02-19"],
  ["Rosa Moreno", "Motorman", "engine", "brae", "Notice", "Notice", "2018-03-09"],
  ["Ruby Reid", "Second engineer", "engine", "corran", "Full-time", "Active", "2020-07-22"],
  ["Sami Fraser", "Crewing assistant", "office", "terminal", "Full-time", "Active", "2025-06-02"],
  ["Saoirse Laurent", "Shop assistant", "cafe", "brae", "Part-time", "Off today", "2023-10-16"],
  ["Saoirse Novak", "Crewing assistant", "office", "terminal", "Full-time", "Active", "2024-04-08"],
  ["Siobhan Kowalski", "Ticket agent", "terminal", "terminal", "Full-time", "Off today", "2019-08-26"],
  ["Stefan Conti", "Fleet fitter", "office", "terminal", "Full-time", "Active", "2021-12-13"],
  ["Tessa Brodie", "Terminal manager", "terminal", "terminal", "Full-time", "Active", "2016-11-07"],
  ["Zainab Iqbal", "Galley hand", "galley", "brae", "Notice", "Notice", "2020-01-15"],
];

function emailFor(name: string) {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]+/g, ".");
  return `${slug}@skerrowline.co.uk`;
}

export const people: Person[] = rows.map((row, index) => {
  const [name, role, dept, base, contract, status, start] = row;
  return {
    id: `E${String(1001 + index)}`,
    name,
    role,
    dept,
    base,
    contract,
    status,
    start,
    email: emailFor(name),
  };
});

export function personById(id: string) {
  return people.find((person) => person.id === id);
}
