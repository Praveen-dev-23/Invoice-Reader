import React from "react";
import { Transaction } from "../types";
import { FileDown, Download, CheckCircle, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export function ReportsPage({ all }: { all: Transaction[] }) {
  
  const handleExportCSV = () => {
    if (all.length === 0) {
      toast.error("No transactions to export.");
      return;
    }
    
    const headers = ["Date", "Merchant", "Category", "Amount", "Method", "Type", "ReferenceNum", "Balance", "Original Description"];
    const rows = all.map(t => [
      t.date,
      t.merchant,
      t.category,
      t.amount,
      t.method,
      t.type,
      t.referenceNum || "",
      t.balance || "",
      t.originalDescription || ""
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "bank_statement_analysis.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV report downloaded successfully!");
  };

  const handleExportExcel = () => {
    if (all.length === 0) {
      toast.error("No transactions to export.");
      return;
    }

    const data = all.map(t => ({
      Date: t.date,
      Merchant: t.merchant,
      Category: t.category,
      Amount: t.amount,
      Method: t.method.toUpperCase(),
      Type: t.type.toUpperCase(),
      Reference: t.referenceNum || "",
      Balance: t.balance || "",
      Description: t.originalDescription || ""
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger");
    XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    XLSX.writeFile(workbook, "bank_statement_analysis.xlsx");
    toast.success("Excel report downloaded successfully!");
  };

  const handleExportPDF = () => {
    toast.info("Preparing PDF Document layout...");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="font-['Outfit'] text-3xl font-bold text-white tracking-tight">Export Ledger Reports</h1>
        <p className="text-sm text-[#94a3b8] mt-1.5 font-medium">Export transaction records and calculated balances into shareable formats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PDF Card */}
        <div className="bg-[#131c2e] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col justify-between group hover:border-[#3B82F6]/30 transition-all duration-300">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="font-['Outfit'] font-bold text-white text-base">Printable PDF Summary</h3>
              <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
                Generates a clean visual PDF statement summary suitable for printing or invoicing records.
              </p>
            </div>
          </div>
          <button
            onClick={handleExportPDF}
            className="w-full mt-6 bg-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-white border border-white/10 font-bold py-3 rounded-xl transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <Download size={14} />
            Export PDF
          </button>
        </div>

        {/* Excel Card */}
        <div className="bg-[#131c2e] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col justify-between group hover:border-emerald-500/30 transition-all duration-300">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FileDown size={24} />
            </div>
            <div>
              <h3 className="font-['Outfit'] font-bold text-white text-base">Excel Spreadsheet (.xlsx)</h3>
              <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
                Full-featured data matrix with split worksheets for categorizing debits, credits, and reference columns.
              </p>
            </div>
          </div>
          <button
            onClick={handleExportExcel}
            className="w-full mt-6 bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20 text-white border border-white/10 font-bold py-3 rounded-xl transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <Download size={14} />
            Export Excel
          </button>
        </div>

        {/* CSV Card */}
        <div className="bg-[#131c2e] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col justify-between group hover:border-blue-500/30 transition-all duration-300">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="font-['Outfit'] font-bold text-white text-base">Standard CSV File</h3>
              <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
                Comma-separated file suitable for importing into spreadsheets, accounting software, or databases.
              </p>
            </div>
          </div>
          <button
            onClick={handleExportCSV}
            className="w-full mt-6 bg-white/5 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/20 text-white border border-white/10 font-bold py-3 rounded-xl transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Security Advisory */}
      <div className="p-5 rounded-2xl border border-white/5 bg-[#131c2e]/40 flex items-start gap-3">
        <CheckCircle size={18} className="text-[#10B981] mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Privacy & Security Note</h4>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            All analysis and PDF/XLSX text parsing happen locally in your web browser. No statement data is permanently stored on external servers.
          </p>
        </div>
      </div>
    </div>
  );
}
