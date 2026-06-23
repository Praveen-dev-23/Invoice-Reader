import { Home, LayoutDashboard, Upload, Search, Lightbulb, FileText, ChevronRight, Menu, X } from "lucide-react";
import { Page } from "../types";
import { useState } from "react";

const NAV: { id: Page; label: string; Icon: any }[] = [
  { id: "landing", label: "Home", Icon: Home },
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "upload", label: "Upload Statements", Icon: Upload },
  { id: "explorer", label: "Ledger Explorer", Icon: Search },
  { id: "insights", label: "AI Insights", Icon: Lightbulb },
  { id: "reports", label: "Export Reports", Icon: FileText },
];

export function Sidebar({ current, onNavigate }: { current: Page, onNavigate: (p: Page) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-white/10 rounded-lg text-foreground"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Content */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#080c18] border-r border-white/5 
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-2 mb-10 px-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg font-['Outfit']">B</span>
            </div>
            <span className="text-lg font-bold font-['Outfit'] tracking-tight text-white">Statement AI</span>
          </div>

          <nav className="flex-1 space-y-1">
            {NAV.map((item) => {
              const isActive = current === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(129,140,248,0.1)]" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03] border border-transparent"}
                  `}
                >
                  <item.Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && <ChevronRight size={14} className="opacity-50" />}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-white/5">
            <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-1">Personal Finance</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Keep track of your spending habits effortlessly.</p>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </>
  );
}
