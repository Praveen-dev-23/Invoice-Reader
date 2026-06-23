import { useState } from "react";
import { Toaster } from "sonner";
import { Transaction, Page } from "./types";
import { SEED_DATA } from "./data";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { UploadPage } from "./components/UploadPage";
import { LandingPage } from "./components/LandingPage";
import { TransactionExplorer } from "./components/TransactionExplorer";
import { InsightsPage } from "./components/InsightsPage";
import { ReportsPage } from "./components/ReportsPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [transactions, setTransactions] = useState<Transaction[]>(SEED_DATA);

  const handleAddTransaction = (t: Transaction) => {
    setTransactions((prev) => [t, ...prev]);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={setCurrentPage} />;
      case "dashboard":
        return <Dashboard all={transactions} />;
      case "explorer":
        return <TransactionExplorer all={transactions} />;
      case "insights":
        return <InsightsPage all={transactions} />;
      case "reports":
        return <ReportsPage all={transactions} />;
      case "upload":
        return <UploadPage onAdd={handleAddTransaction} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#080c18] text-foreground font-['Inter'] selection:bg-primary/30">
      <Sidebar current={currentPage} onNavigate={setCurrentPage} />
      
      <main className="flex-1 p-4 lg:p-10 lg:ml-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>

      <Toaster position="top-right" theme="dark" closeButton richColors />
    </div>
  );
}
