import { useState } from "react";
import Papa from "papaparse";
import { Upload, X, Check, FileText, AlertCircle, Loader2 } from "lucide-react";
import { Transaction, PaymentMethod } from "../types";
import { toast } from "sonner";

export function UploadPage({
  onAdd,
}: { onAdd: (t: Transaction) => void }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    merchant: "",
    category: "Food",
    amount: "",
    method: "upi" as PaymentMethod,
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const categories = ["Food", "Groceries", "Housing", "Utilities", "Shopping", "Transport", "Health", "Entertainment", "Transfer", "Other"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.merchant || !form.amount) {
      toast.error("Please fill in all required fields.");
      return;
    }
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      date: form.date,
      merchant: form.merchant,
      category: form.category,
      amount: parseFloat(form.amount),
      method: form.method,
    });
    toast.success("Transaction added successfully!");
    setForm({ 
      date: new Date().toISOString().slice(0, 10), 
      merchant: "", 
      category: "Food", 
      amount: "", 
      method: "upi" 
    });
  };

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a valid CSV file.");
      return;
    }

    setIsUploading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsUploading(false);
        const data = results.data as any[];
        let addedCount = 0;

        data.forEach((row) => {
          // Expected columns: date, merchant, category, amount, method
          const amount = parseFloat(row.amount);
          if (row.merchant && !isNaN(amount)) {
            onAdd({
              id: Math.random().toString(36).substr(2, 9),
              date: row.date || new Date().toISOString().slice(0, 10),
              merchant: row.merchant,
              category: row.category || "Other",
              amount: amount,
              method: (row.method?.toLowerCase() as PaymentMethod) || "upi",
            });
            addedCount++;
          }
        });

        if (addedCount > 0) {
          toast.success(`Successfully imported ${addedCount} transactions!`);
        } else {
          toast.error("No valid transactions found in the CSV. Check your columns (date, merchant, category, amount, method).");
        }
      },
      error: (err) => {
        setIsUploading(false);
        toast.error("Error parsing CSV: " + err.message);
      }
    });
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all";
  const labelCls = "block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 ml-1";

  return (
    <div className="space-y-10 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Outfit'] text-3xl font-bold text-foreground tracking-tight">Add Data</h1>
          <p className="text-sm text-muted-foreground mt-1.5 font-medium">Log your spending manually or bulk import via CSV</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Manual Form */}
        <div className="rounded-2xl border border-white/5 bg-[#0e1525] p-6 shadow-xl">
          <h3 className="font-['Outfit'] font-bold text-foreground tracking-tight mb-6 flex items-center gap-2">
            <Check size={18} className="text-primary" />
            Manual Entry
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Amount (₹)</label>
                <input type="number" placeholder="0.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Merchant / Payee</label>
              <input type="text" placeholder="e.g. Amazon, Starbucks" value={form.merchant} onChange={(e) => setForm({ ...form, merchant: e.target.value })} className={inputCls} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Method</label>
                <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value as PaymentMethod })} className={inputCls}>
                  <option value="bank">Bank Transfer</option>
                  <option value="upi">UPI / GPay</option>
                  <option value="card">Card Payment</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] mt-4 uppercase tracking-widest text-xs">
              Save Transaction
            </button>
          </form>
        </div>

        {/* CSV Upload */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border-2 border-dashed border-white/10 bg-[#0e1525]/50 p-8 flex flex-col items-center justify-center text-center group transition-all hover:border-primary/30 hover:bg-[#0e1525]"
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFileUpload(file);
            }}
          >
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 transition-all duration-300 ${dragging ? "bg-primary scale-110" : "bg-white/5 group-hover:bg-primary/10"}`}>
              {isUploading ? <Loader2 className="text-primary animate-spin" size={32} /> : <Upload className={`${dragging ? "text-primary-foreground" : "text-primary"}`} size={32} />}
            </div>
            <h3 className="font-['Outfit'] font-bold text-foreground text-lg mb-2">Import CSV Data</h3>
            <p className="text-sm text-muted-foreground max-w-[240px] leading-relaxed mb-6">
              Drag and drop your bank statement or CSV file here to bulk import
            </p>
            <label className="bg-white/5 hover:bg-white/10 text-foreground text-xs font-bold py-3 px-8 rounded-xl cursor-pointer transition-all border border-white/10 uppercase tracking-widest">
              Choose File
              <input type="file" className="hidden" accept=".csv" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }} />
            </label>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0e1525]/30 p-6">
            <h4 className="font-bold text-xs text-foreground flex items-center gap-2 mb-4 uppercase tracking-widest">
              <AlertCircle size={14} className="text-amber-400" />
              CSV Format Guide
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Your CSV should include these headers: <code className="text-primary-foreground/80 bg-primary/20 px-1.5 py-0.5 rounded">date</code>, <code className="text-primary-foreground/80 bg-primary/20 px-1.5 py-0.5 rounded">merchant</code>, <code className="text-primary-foreground/80 bg-primary/20 px-1.5 py-0.5 rounded">category</code>, <code className="text-primary-foreground/80 bg-primary/20 px-1.5 py-0.5 rounded">amount</code>, and <code className="text-primary-foreground/80 bg-primary/20 px-1.5 py-0.5 rounded">method</code>.
            </p>
            <div className="p-3 bg-black/30 rounded-lg font-['DM_Mono'] text-[10px] text-muted-foreground overflow-x-auto whitespace-nowrap">
              date,merchant,category,amount,method<br/>
              2026-06-18,Apple Store,Shopping,89000,card
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
