import React, { useState, useMemo } from "react";
import { SearchBar } from "./common";
import { fmt } from "../utils";
import { Transaction, PaymentMethod } from "../types";
import { Search, SlidersHorizontal } from "lucide-react";

export function TransactionExplorer({ all }: { all: Transaction[] }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "debit" | "credit">("all");
  const [methodFilter, setMethodFilter] = useState<"all" | PaymentMethod>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = useMemo(() => {
    const list = new Set<string>();
    all.forEach(t => {
      if (t.category) list.add(t.category);
    });
    return Array.from(list);
  }, [all]);

  const filtered = useMemo(() => {
    return all.filter(t => {
      const matchSearch = search === "" || 
        t.merchant.toLowerCase().includes(search.toLowerCase()) ||
        (t.originalDescription && t.originalDescription.toLowerCase().includes(search.toLowerCase())) ||
        (t.upiId && t.upiId.toLowerCase().includes(search.toLowerCase())) ||
        (t.referenceNum && t.referenceNum.toLowerCase().includes(search.toLowerCase()));
      
      const matchType = typeFilter === "all" || t.type === typeFilter;
      const matchMethod = methodFilter === "all" || t.method === methodFilter;
      const matchCategory = categoryFilter === "all" || t.category === categoryFilter;

      return matchSearch && matchType && matchMethod && matchCategory;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [all, search, typeFilter, methodFilter, categoryFilter]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="font-['Outfit'] text-3xl font-bold text-white tracking-tight">Transaction Explorer</h1>
        <p className="text-sm text-[#94a3b8] mt-1.5 font-medium">Search, filter, and inspect parsed statement transactions</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#131c2e] border border-white/5 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-primary uppercase tracking-widest">
          <SlidersHorizontal size={14} />
          Filter Settings
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2">Search Query</label>
            <SearchBar value={search} onChange={setSearch} />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2">Transaction Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
            >
              <option value="all">All Types</option>
              <option value="debit">Debits (Payments)</option>
              <option value="credit">Credits (Income)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2">Payment Method</label>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value as any)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
            >
              <option value="all">All Methods</option>
              <option value="upi">UPI / GPay</option>
              <option value="card">Cards</option>
              <option value="bank">Bank Transfers</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2">Spend Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transaction List Table */}
      <div className="bg-[#131c2e] border border-white/5 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-['Outfit'] font-bold text-white text-base">Statement Ledger</h3>
          <span className="text-xs text-[#94a3b8] font-medium">{filtered.length} transactions found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider bg-white/[0.01]">
                <th className="p-4">Date</th>
                <th className="p-4">Merchant / Payee</th>
                <th className="p-4">Description</th>
                <th className="p-4">Method / Details</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-[#94a3b8]">
                    No transactions match your search filters.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const isCredit = t.type === "credit";
                  return (
                    <tr key={t.id} className="hover:bg-white/[0.01] transition-colors text-sm">
                      <td className="p-4 font-medium text-white">{t.date}</td>
                      <td className="p-4 font-semibold text-white">
                        {t.merchant}
                        {t.fileName && (
                          <span className="block text-[9px] text-[#94a3b8] font-normal font-sans">
                            {t.fileName}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-xs text-[#94a3b8] max-w-xs truncate">
                        {t.originalDescription || "Parsed Transaction"}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-semibold uppercase text-[#3B82F6]">{t.method}</span>
                          {t.upiId && <span className="text-[10px] text-[#94a3b8]">{t.upiId}</span>}
                          {t.cardNum && <span className="text-[10px] text-[#94a3b8]">{t.cardNum}</span>}
                          {t.referenceNum && <span className="text-[9px] text-muted-foreground">Ref: {t.referenceNum}</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-xs bg-white/5 border border-white/5 px-2.5 py-1 rounded-full font-medium">
                          {t.category}
                        </span>
                      </td>
                      <td className={`p-4 text-right font-['DM_Mono'] font-bold ${isCredit ? "text-[#10B981]" : "text-white"}`}>
                        {isCredit ? "+" : "-"}{fmt(t.amount)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
