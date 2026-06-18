import { Search, Building2, Smartphone, CreditCard, Wallet } from "lucide-react";
import { Transaction, PaymentMethod } from "../types";
import { fmt, CATEGORY_COLORS } from "../utils";

export const METHOD_CFG: Record<PaymentMethod, {
  label: string; color: string; gradFrom: string; gradTo: string;
  Icon: any; pill: string; dot: string;
}> = {
  bank: {
    label: "Bank Transfer", color: "#60a5fa", gradFrom: "#60a5fa", gradTo: "#3b82f6",
    Icon: Building2, pill: "bg-blue-500/15 text-blue-300 border border-blue-500/25",
    dot: "bg-blue-400",
  },
  upi: {
    label: "UPI / GPay", color: "#c084fc", gradFrom: "#c084fc", gradTo: "#a855f7",
    Icon: Smartphone, pill: "bg-purple-500/15 text-purple-300 border border-purple-500/25",
    dot: "bg-purple-400",
  },
  card: {
    label: "Card Payment", color: "#fb923c", gradFrom: "#fb923c", gradTo: "#f97316",
    Icon: CreditCard, pill: "bg-orange-500/15 text-orange-300 border border-orange-500/25",
    dot: "bg-orange-400",
  },
  cash: {
    label: "Cash", color: "#fbbf24", gradFrom: "#fbbf24", gradTo: "#f59e0b",
    Icon: Wallet, pill: "bg-amber-500/15 text-amber-300 border border-amber-500/25",
    dot: "bg-amber-400",
  },
};

export function TxnRow({ t }: { t: Transaction }) {
  const cfg = METHOD_CFG[t.method];
  const catColor = CATEGORY_COLORS[t.category] || "#94a3b8";
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors rounded-lg px-2 -mx-2 group">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
        style={{ background: catColor + "20" }}
      >
        <span style={{ color: catColor }} className="text-xs font-bold font-['DM_Mono']">
          {t.merchant.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{t.merchant}</p>
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{t.category} · {t.date}</p>
      </div>
      <span className={`text-[10px] px-2 py-0.5 rounded-full ${cfg.pill} font-medium flex-shrink-0 hidden sm:block uppercase tracking-tight`}>
        {cfg.label}
      </span>
      <span className="font-['DM_Mono'] text-sm font-medium text-foreground flex-shrink-0">
        {fmt(t.amount)}
      </span>
    </div>
  );
}

export function SearchBar({
  value, onChange,
}: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search transactions…"
        className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
      />
    </div>
  );
}

export function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0e1525] border border-white/10 rounded-xl p-3 shadow-2xl backdrop-blur-md">
      <p className="text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-widest">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 text-xs py-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-['DM_Mono'] font-medium text-foreground ml-auto">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}
