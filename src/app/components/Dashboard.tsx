import { useMemo } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp, Building2, Smartphone, CreditCard, ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";
import { Transaction, PaymentMethod } from "../types";
import { buildMonthlyData, fmt, CATEGORY_COLORS } from "../utils";
import { TxnRow, CustomTooltip, METHOD_CFG } from "./common";

function StatCard({
  label, value, sub, color, Icon, delta,
}: {
  label: string; value: string; sub: string; color: string;
  Icon: any; delta?: number;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0e1525] p-5 flex flex-col gap-3 hover:border-white/10 transition-all duration-300 group shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{label}</span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors group-hover:bg-opacity-30" style={{ background: color + "15" }}>
          <Icon size={16} style={{ color }} strokeWidth={2.5} />
        </div>
      </div>
      <div>
        <p className="font-['DM_Mono'] text-2xl font-semibold text-foreground tracking-tight">{value}</p>
        <p className="text-[11px] text-muted-foreground mt-1 font-medium">{sub}</p>
      </div>
      {delta !== undefined && (
        <div className={`flex items-center gap-1.5 text-[11px] font-bold ${delta >= 0 ? "text-red-400" : "text-emerald-400"}`}>
          <div className={`p-0.5 rounded-full ${delta >= 0 ? "bg-red-400/10" : "bg-emerald-400/10"}`}>
            {delta >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          </div>
          {Math.abs(delta).toFixed(1)}% vs last month
        </div>
      )}
    </div>
  );
}

import { useState } from "react";

export function Dashboard({ all }: { all: Transaction[] }) {
  const [selectedMonth, setSelectedMonth] = useState<string>("All");

  // Determine available months from data
  const monthsList = useMemo(() => {
    const months = new Set<string>();
    all.forEach(t => {
      const match = t.date.match(/^(\d{4}-\d{2})/);
      if (match) months.add(match[1]);
    });
    return Array.from(months).sort();
  }, [all]);

  // Filter transactions based on selection
  const filtered = useMemo(() => {
    if (selectedMonth === "All") return all;
    return all.filter(t => t.date.startsWith(selectedMonth));
  }, [all, selectedMonth]);

  const monthly = useMemo(() => buildMonthlyData(filtered), [filtered]);

  // Statistics
  const totalDebit = useMemo(() => 
    filtered.filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0),
    [filtered]
  );

  const totalCredit = useMemo(() => 
    filtered.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0),
    [filtered]
  );

  const netSavings = totalCredit - totalDebit;

  const byMethod = (m: PaymentMethod) => 
    filtered.filter((t) => t.method === m && t.type === "debit").reduce((s, t) => s + t.amount, 0);

  const debitTotal = filtered.filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0) || 1;

  const pieData = (["bank", "upi", "card", "cash"] as PaymentMethod[]).map((m) => ({
    name: METHOD_CFG[m].label,
    value: byMethod(m),
    color: METHOD_CFG[m].color,
  }));

  const catTotals = Object.entries(
    filtered.filter(t => t.type === "debit").reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const recent = [...filtered].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  // Month-over-month calculation for Debits (Payments)
  const lastMonthDebit = useMemo(() => {
    if (selectedMonth !== "All") {
      const idx = monthsList.indexOf(selectedMonth);
      if (idx > 0) {
        const prevMonth = monthsList[idx - 1];
        return all.filter(t => t.date.startsWith(prevMonth) && t.type === "debit").reduce((s, t) => s + t.amount, 0);
      }
    }
    return monthly[monthly.length - 2]?.debit || 0;
  }, [all, selectedMonth, monthsList, monthly]);

  const thisMonthDebit = useMemo(() => {
    if (selectedMonth !== "All") {
      return all.filter(t => t.date.startsWith(selectedMonth) && t.type === "debit").reduce((s, t) => s + t.amount, 0);
    }
    return monthly[monthly.length - 1]?.debit || 0;
  }, [all, selectedMonth, monthly]);

  const delta = lastMonthDebit ? ((thisMonthDebit - lastMonthDebit) / lastMonthDebit) * 100 : 0;

  const formatMonthName = (yrMo: string) => {
    if (yrMo === "All") return "All Time";
    const [yr, mo] = yrMo.split("-");
    const d = new Date(parseInt(yr), parseInt(mo) - 1, 1);
    return d.toLocaleString("default", { month: "short", year: "numeric" });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Outfit'] text-3xl font-bold text-foreground tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground mt-1.5 font-medium flex items-center gap-2">
            Spending & income analysis
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            {selectedMonth === "All" ? "6-month summary" : formatMonthName(selectedMonth)}
          </p>
        </div>

        {/* Month Selector Filter */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5 self-start sm:self-center">
          <button
            onClick={() => setSelectedMonth("All")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              selectedMonth === "All"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Time
          </button>
          {monthsList.map(m => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                selectedMonth === m
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {formatMonthName(m).split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Debits (Spent)" value={fmt(totalDebit)} sub="Payments & charges" color="#f87171" Icon={TrendingUp} delta={delta} />
        <StatCard label="Total Credits (Received)" value={fmt(totalCredit)} sub="Refunds & income credits" color="#34d399" Icon={Building2} />
        <StatCard 
          label="Net Savings / Balance" 
          value={(netSavings >= 0 ? "" : "-") + fmt(Math.abs(netSavings))} 
          sub={netSavings >= 0 ? "Surplus remaining" : "Deficit this period"} 
          color={netSavings >= 0 ? "#60a5fa" : "#f87171"} 
          Icon={CreditCard} 
        />
        <StatCard label="UPI Payments" value={fmt(byMethod("upi"))} sub={`${((byMethod("upi") / debitTotal) * 100).toFixed(0)}% of total debit`} color="#c084fc" Icon={Smartphone} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#0e1525] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-['Outfit'] font-bold text-foreground tracking-tight font-medium">Monthly Debits vs Credits</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Debits</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Credits</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="grad-debit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="grad-credit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
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
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="debit" name="Debits" stroke="#f87171" strokeWidth={2.5} fill="url(#grad-debit)" />
              <Area type="monotone" dataKey="credit" name="Credits" stroke="#34d399" strokeWidth={2.5} fill="url(#grad-credit)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0e1525] p-6 shadow-xl flex flex-col">
          <h3 className="font-['Outfit'] font-bold text-foreground tracking-tight mb-6">Spend Distribution (Debits)</h3>
          <div className="flex-1 flex flex-col justify-center items-center">
            {pieData.every(d => d.value === 0) ? (
              <p className="text-sm text-muted-foreground text-center py-12">No debit data in this month.</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pieData.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                      {pieData.filter(d => d.value > 0).map((entry, i) => (
                        <Cell key={i} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="w-full space-y-3 mt-6">
                  {pieData.map((d) => (
                    <div key={d.name} className="flex items-center justify-between group">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: d.color }} />
                        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{d.name}</span>
                      </div>
                      <span className="font-['DM_Mono'] text-xs font-semibold text-foreground">{fmt(d.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        <div className="rounded-2xl border border-white/5 bg-[#0e1525] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-['Outfit'] font-bold text-foreground tracking-tight">Spending by Category</h3>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Top 6</span>
          </div>
          <div className="space-y-5">
            {catTotals.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">No categorized debit data.</p>
            ) : (
              catTotals.map(([cat, amt]) => {
                const pct = (amt / debitTotal) * 100;
                const color = CATEGORY_COLORS[cat] || "#94a3b8";
                return (
                  <div key={cat} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-semibold text-foreground/90">{cat}</span>
                      <span className="font-['DM_Mono'] text-xs font-bold text-foreground">{fmt(amt)} <span className="text-[10px] text-muted-foreground ml-1">({pct.toFixed(1)}%)</span></span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.03] overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}dd, ${color})` }} 
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0e1525] p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-['Outfit'] font-bold text-foreground tracking-tight">Recent Activity</h3>
          </div>
          <div className="flex-1 overflow-y-auto pr-1">
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">No recent activity.</p>
            ) : (
              recent.map((t) => <TxnRow key={t.id} t={t} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
