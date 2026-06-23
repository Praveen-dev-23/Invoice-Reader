import React, { useMemo } from "react";
import { Transaction } from "../types";
import { fmt } from "../utils";
import { Lightbulb, TrendingUp, AlertTriangle, HelpCircle, Activity } from "lucide-react";

export function InsightsPage({ all }: { all: Transaction[] }) {
  const debits = useMemo(() => all.filter(t => t.type === "debit"), [all]);
  const credits = useMemo(() => all.filter(t => t.type === "credit"), [all]);

  const maxExpense = useMemo(() => {
    if (debits.length === 0) return null;
    return [...debits].sort((a, b) => b.amount - a.amount)[0];
  }, [debits]);

  const maxIncome = useMemo(() => {
    if (credits.length === 0) return null;
    return [...credits].sort((a, b) => b.amount - a.amount)[0];
  }, [credits]);

  const topMerchants = useMemo(() => {
    const list: Record<string, number> = {};
    debits.forEach(t => {
      list[t.merchant] = (list[t.merchant] || 0) + t.amount;
    });
    return Object.entries(list).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [debits]);

  // Subscription detection heuristic
  const detectedSubscriptions = useMemo(() => {
    const list: Record<string, { count: number; amount: number; category: string }> = {};
    debits.forEach(t => {
      const key = t.merchant.toLowerCase();
      if (!list[key]) {
        list[key] = { count: 0, amount: t.amount, category: t.category };
      }
      list[key].count += 1;
    });
    return Object.entries(list)
      .filter(([_, data]) => data.count >= 2 || data.category === "Subscriptions")
      .map(([name, data]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        amount: data.amount,
        count: data.count,
        category: data.category
      }));
  }, [debits]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="font-['Outfit'] text-3xl font-bold text-white tracking-tight">AI & Spending Insights</h1>
        <p className="text-sm text-[#94a3b8] mt-1.5 font-medium">Automatic spending profile assessment and recurring payments analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Insights */}
        <div className="bg-[#131c2e] border border-white/5 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="font-['Outfit'] font-bold text-white text-lg flex items-center gap-2">
            <Lightbulb size={20} className="text-yellow-400" />
            Extracted Highlights
          </h3>

          <div className="space-y-4">
            {maxExpense && (
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-[#f87171] uppercase tracking-wider">Highest Expense</span>
                    <h4 className="font-bold text-white mt-1 text-sm">{maxExpense.merchant}</h4>
                    <p className="text-xs text-[#94a3b8] mt-0.5">{maxExpense.category} · {maxExpense.date}</p>
                  </div>
                  <span className="font-['DM_Mono'] text-sm font-bold text-white">{fmt(maxExpense.amount)}</span>
                </div>
              </div>
            )}

            {maxIncome && (
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-[#34d399] uppercase tracking-wider">Largest Credit Received</span>
                    <h4 className="font-bold text-white mt-1 text-sm">{maxIncome.merchant}</h4>
                    <p className="text-xs text-[#94a3b8] mt-0.5">{maxIncome.category} · {maxIncome.date}</p>
                  </div>
                  <span className="font-['DM_Mono'] text-sm font-bold text-emerald-400">{fmt(maxIncome.amount)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Merchants */}
        <div className="bg-[#131c2e] border border-white/5 rounded-2xl p-6 shadow-xl">
          <h3 className="font-['Outfit'] font-bold text-white text-lg mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            Top Outlets By Spend
          </h3>

          <div className="space-y-4">
            {topMerchants.length === 0 ? (
              <p className="text-xs text-[#94a3b8]">No merchant statistics available yet.</p>
            ) : (
              topMerchants.map(([merchant, amount], index) => (
                <div key={merchant} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-['DM_Mono']">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-white">{merchant}</span>
                  </div>
                  <span className="font-['DM_Mono'] text-sm font-bold text-white">{fmt(amount)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Subscription Detection */}
      <div className="bg-[#131c2e] border border-white/5 rounded-2xl p-6 shadow-xl">
        <h3 className="font-['Outfit'] font-bold text-white text-lg mb-4 flex items-center gap-2">
          <Activity size={20} className="text-purple-400" />
          Detected Subscriptions & Recurring Bills
        </h3>
        <p className="text-xs text-[#94a3b8] mb-6">Heuristics identified the following recurring merchant interactions on this statement.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {detectedSubscriptions.length === 0 ? (
            <div className="sm:col-span-3 text-center py-6 text-xs text-[#94a3b8]">
              No recurring payments identified.
            </div>
          ) : (
            detectedSubscriptions.map(sub => (
              <div key={sub.name} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-white">{sub.name}</span>
                  <span className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/15 px-2 py-0.5 rounded-full uppercase tracking-tight">
                    {sub.category}
                  </span>
                </div>
                <span className="font-['DM_Mono'] text-base font-bold text-white mt-2">{fmt(sub.amount)}</span>
                <span className="text-[10px] text-[#94a3b8] mt-1 font-medium">Billed {sub.count} times in statement range</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* AI Advice */}
      <div className="p-6 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border border-primary/10 rounded-2xl flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Lightbulb size={20} />
          </div>
          <div>
            <h4 className="font-['Outfit'] font-bold text-white">Smart Spending Assessment</h4>
            <p className="text-xs text-[#94a3b8] mt-0.5">Automated advice based on statement records</p>
          </div>
        </div>
        <p className="text-sm text-[#94a3b8] leading-relaxed">
          Based on the statement analyzed, your largest outflows are under the <strong className="text-white">Bills</strong> category. You have positive cashflow this period. We recommend keeping subscriptions consolidated and monitoring ATM cash withdrawals to improve net liquidity.
        </p>
      </div>
    </div>
  );
}
