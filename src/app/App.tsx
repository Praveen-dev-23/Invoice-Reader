import { useState } from "react";
import { Toaster } from "sonner";
import { Transaction, Page } from "./types";
import { SEED_DATA } from "./data";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { MethodPage } from "./components/MethodPage";
import { UploadPage } from "./components/UploadPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [transactions, setTransactions] = useState<Transaction[]>(SEED_DATA);

  const handleAddTransaction = (t: Transaction) => {
    setTransactions((prev) => [t, ...prev]);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard all={transactions} />;
      case "bank":
        return <MethodPage method="bank" all={transactions} />;
      case "upi":
        return <MethodPage method="upi" all={transactions} />;
      case "card":
        return <MethodPage method="card" all={transactions} />;
      case "cash":
        return <MethodPage method="cash" all={transactions} />;
      case "upload":
        return <UploadPage onAdd={handleAddTransaction} />;
      default:
        return <Dashboard all={transactions} />;
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
