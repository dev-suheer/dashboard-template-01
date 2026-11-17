const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const gbpExact = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const day = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatMoney(value: number, exact = false) {
  return (exact ? gbpExact : gbp).format(value);
}

export function formatDate(iso: string) {
  return day.format(new Date(iso));
}

export function tenure(iso: string, now = new Date(2026, 10, 3)) {
  const start = new Date(iso);
  const months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());
  if (months < 12) return `${Math.max(1, months)} mo`;
  const years = months / 12;
  return `${years.toFixed(years < 10 ? 1 : 0)} yrs`;
}

export function initials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]![0] : "";
  return (first + last).toUpperCase();
}
