import React from "react";
import { LayoutDashboard, FileSpreadsheet, Eye, Brain, Shield, ChevronRight } from "lucide-react";
import { Page } from "../types";

export function LandingPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-12 animate-in fade-in duration-700">
      {/* Brand Badge */}
      <div className="inline-flex items-center gap-2 bg-[#1d293d]/50 border border-white/10 rounded-full px-4 py-1.5 text-xs font-semibold text-primary mb-8 tracking-wide">
        <Shield size={14} />
        Secure Client-Side MERN Extraction
      </div>

      {/* Hero Headline */}
      <h1 className="font-['Outfit'] text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.15] mb-6">
        Bank Statement Analyzer <br/>
        <span className="bg-gradient-to-r from-blue-400 via-primary to-indigo-400 bg-clip-text text-transparent">
          Zero Manual Entry. Instant Insights.
        </span>
      </h1>

      {/* Sub-headline */}
      <p className="text-sm md:text-lg text-[#94a3b8] max-w-xl leading-relaxed mb-10">
        Automatically parse, clean, categorize, and extract transaction records from PDF, CSV, or Excel statements directly in your browser.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-16 justify-center">
        <button
          onClick={() => onNavigate("upload")}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] uppercase tracking-widest text-xs"
        >
          Get Started
          <ChevronRight size={14} />
        </button>
        <button
          onClick={() => onNavigate("dashboard")}
          className="flex items-center justify-center gap-2 bg-[#131c2e] hover:bg-[#131c2e]/80 text-white font-bold px-8 py-4 rounded-xl transition-all border border-white/5 uppercase tracking-widest text-xs"
        >
          View Demo Dashboard
        </button>
      </div>

      {/* Grid of Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        <div className="bg-[#131c2e]/50 border border-white/5 rounded-2xl p-6 text-left hover:border-white/10 transition-all duration-300 backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
            <FileSpreadsheet size={20} />
          </div>
          <h3 className="font-['Outfit'] font-bold text-white text-base mb-2">Multi-Format Parsing</h3>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            Drag-and-drop support for standard banking PDFs, transaction CSVs, and Excel sheets. Works instantly.
          </p>
        </div>

        <div className="bg-[#131c2e]/50 border border-white/5 rounded-2xl p-6 text-left hover:border-white/10 transition-all duration-300 backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
            <Brain size={20} />
          </div>
          <h3 className="font-['Outfit'] font-bold text-white text-base mb-2">Automated Heuristics</h3>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            Extracts transaction dates, descriptions, balances, and detects credit/debit indicators using smart filters.
          </p>
        </div>

        <div className="bg-[#131c2e]/50 border border-white/5 rounded-2xl p-6 text-left hover:border-white/10 transition-all duration-300 backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
            <Eye size={20} />
          </div>
          <h3 className="font-['Outfit'] font-bold text-white text-base mb-2">Rich Visualization</h3>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            Beautiful graphs for monthly distributions, card vs cash ratios, category limits, and net savings.
          </p>
        </div>
      </div>
    </div>
  );
}
