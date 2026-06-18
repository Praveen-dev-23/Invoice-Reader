import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Transaction, PaymentMethod } from "../types";
import { buildMonthlyData, fmt, CATEGORY_COLORS } from "../utils";
import { TxnRow, CustomTooltip, METHOD_CFG, SearchBar } from "./common";

export function MethodPage({
  method, all,
}: { method: PaymentMethod; all: Transaction[] }) {
  const [search, setSearch] = useState("");
  const cfg = METHOD_CFG[method];
  const txns = all.filter((t) => t.method === method);
  const monthly = buildMonthlyData(txns);
  const total = txns.reduce((s, t) => s + t.amount, 0);
  const avgMonthly = total / 6;

  const filtered = txns.filter(
    (t) =>
      search === "" ||
      t.merchant.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => b.date.localeCompare(a.date));

  const catTotals = Object.entries(
    txns.reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: cfg.color + "20" }}>
          <cfg.Icon size={22} style={{ color: cfg.color }} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-['Outfit'] text-3xl font-bold text-foreground tracking-tight">{cfg.label}</h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">Spending analytics for your {cfg.label.toLowerCase()}s</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-white/5 bg-[#0e1525] p-5 shadow-lg">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">Total Volume</p>
          <p className="font-['DM_Mono'] text-2xl font-bold" style={{ color: cfg.color }}>{fmt(total)}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#0e1525] p-5 shadow-lg">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">Count</p>
          <p className="font-['DM_Mono'] text-2xl font-bold text-foreground">{txns.length} <span className="text-sm text-muted-foreground font-medium">txns</span></p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#0e1525] p-5 shadow-lg">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">Monthly Average</p>
          <p className="font-['DM_Mono'] text-2xl font-bold text-foreground">{fmt(avgMonthly)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#0e1525] p-6 shadow-xl">
          <h3 className="font-['Outfit'] font-bold text-foreground tracking-tight mb-8">Monthly Volume</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`bar-grad-${method}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={cfg.gradFrom} stopOpacity={1} />
                  <stop offset="100%" stopColor={cfg.gradTo} stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#6b7494", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis 
                tick={{ fill: "#6b7494", fontSize: 10, fontFamily: "DM Mono", fontWeight: 500 }} 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey={method} name={cfg.label} fill={`url(#bar-grad-${method})`} radius={[8, 8, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0e1525] p-6 shadow-xl">
          <h3 className="font-['Outfit'] font-bold text-foreground tracking-tight mb-6">Category Breakdown</h3>
          <div className="space-y-5">
            {catTotals.length === 0 ? (
               <p className="text-sm text-muted-foreground text-center py-8">No data available.</p>
            ) : (
              catTotals.map(([cat, amt]) => {
                const pct = (amt / total) * 100;
                const color = CATEGORY_COLORS[cat] || "#94a3b8";
                return (
                  <div key={cat} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-semibold text-foreground/90">{cat}</span>
                      <span className="font-['DM_Mono'] text-xs font-bold text-foreground">{fmt(amt)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.03] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-[#0e1525] p-6 shadow-xl pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="font-['Outfit'] font-bold text-foreground tracking-tight">Transaction History</h3>
            <p className="text-xs text-muted-foreground mt-1 font-medium">{filtered.length} entries matching current view</p>
          </div>
          <div className="w-full sm:w-72">
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No transactions found for this period.</p>
          ) : (
            filtered.map((t) => <TxnRow key={t.id} t={t} />)
          )}
        </div>
      </div>
    </div>
  );
}
