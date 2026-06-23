import { Transaction, PaymentMethod, MonthlyData } from "./types";

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
export const MONTH_KEYS = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"];

export const fmt = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export const monthKey = (date: string) => date.slice(0, 7);

export function buildMonthlyData(txns: Transaction[]): MonthlyData[] {
  return MONTH_KEYS.map((mk, i) => {
    const slice = txns.filter((t) => monthKey(t.date) === mk);
    return {
      month: MONTHS[i],
      total: slice.reduce((s, t) => s + (t.type === "credit" ? -t.amount : t.amount), 0),
      debit: slice.filter((t) => t.type === "debit").reduce((s, t) => s + t.amount, 0),
      credit: slice.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0),
      bank: slice.filter((t) => t.method === "bank").reduce((s, t) => s + t.amount, 0),
      upi: slice.filter((t) => t.method === "upi").reduce((s, t) => s + t.amount, 0),
      card: slice.filter((t) => t.method === "card").reduce((s, t) => s + t.amount, 0),
      cash: slice.filter((t) => t.method === "cash").reduce((s, t) => s + t.amount, 0),
    };
  });
}

export const CATEGORY_COLORS: Record<string, string> = {
  Food: "#f87171",
  Shopping: "#c084fc",
  Transportation: "#fb923c",
  Bills: "#60a5fa",
  Healthcare: "#f472b6",
  Entertainment: "#fbbf24",
  Travel: "#38bdf8",
  Education: "#a855f7",
  Investments: "#34d399",
  Subscriptions: "#f472c6",
  Miscellaneous: "#64748b",
  Transfer: "#94a3b8",
  Other: "#64748b",
};
