import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { Transaction, PaymentMethod, TransactionType } from "../types";

export function ReviewModal({
  transaction,
  onClose,
  onSave
}: {
  transaction: Partial<Transaction>;
  onClose: () => void;
  onSave: (t: Transaction) => void;
}) {
  const [form, setForm] = useState({
    date: transaction.date || new Date().toISOString().slice(0, 10),
    merchant: transaction.merchant || "",
    category: transaction.category || "Other",
    amount: transaction.amount?.toString() || "",
    method: transaction.method || "upi",
    type: transaction.type || "debit",
  });

  const categories = ["Food", "Groceries", "Housing", "Utilities", "Shopping", "Transport", "Health", "Entertainment", "Transfer", "Other"];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.merchant || !form.amount) return;

    onSave({
      id: Math.random().toString(36).substr(2, 9),
      date: form.date,
      merchant: form.merchant,
      category: form.category,
      amount: parseFloat(form.amount),
      method: form.method as PaymentMethod,
      type: form.type as TransactionType,
      items: transaction.items,
      fileName: transaction.fileName
    });
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all";
  const labelCls = "block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 ml-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#0e1525] border border-white/10 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-lg bg-white/5 border border-white/5 transition-colors">
          <X size={18} />
        </button>

        <div className="mb-6">
          <h3 className="font-['Outfit'] text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Check size={20} className="text-emerald-400" />
            Review Parsed Invoice
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Please verify the extracted information before saving it to your records.</p>
        </div>

        {transaction.fileName && (
          <div className="mb-5 p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Source:</span>
            <span className="text-xs text-foreground truncate font-medium">{transaction.fileName}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Amount (₹)</label>
              <input type="number" step="any" placeholder="0.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={inputCls} required />
            </div>
          </div>

          <div>
            <label className={labelCls}>Merchant / Payee</label>
            <input type="text" placeholder="e.g. Amazon, Starbucks" value={form.merchant} onChange={(e) => setForm({ ...form, merchant: e.target.value })} className={inputCls} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Payment Method</label>
              <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value as PaymentMethod })} className={inputCls}>
                <option value="bank">Bank Transfer</option>
                <option value="upi">UPI / GPay</option>
                <option value="card">Card Payment</option>
                <option value="cash">Cash</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Transaction Type</label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "debit" })}
                className={`py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                  form.type === "debit"
                    ? "bg-red-500/10 text-red-400 border-red-500/30"
                    : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10"
                }`}
              >
                Debit (Payment)
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "credit" })}
                className={`py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                  form.type === "credit"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10"
                }`}
              >
                Credit (Refund / Income)
              </button>
            </div>
          </div>

          {transaction.items && transaction.items.length > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Line Items Found ({transaction.items.length})</h4>
              <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                {transaction.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground truncate max-w-[200px]">{item.name}</span>
                    <span className="font-['DM_Mono'] text-foreground">₹{item.amount.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-foreground font-bold py-3.5 rounded-xl transition-all border border-white/10 uppercase tracking-widest text-xs">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 uppercase tracking-widest text-xs">
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
