export type PaymentMethod = "bank" | "upi" | "card" | "cash";
export type Page = "landing" | "dashboard" | "upload" | "explorer" | "insights" | "reports";
export type TransactionType = "debit" | "credit";

export interface InvoiceItem {
  name: string;
  amount: number;
}

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  method: PaymentMethod;
  type: TransactionType;
  items?: InvoiceItem[];
  fileName?: string;
  referenceNum?: string;
  balance?: number;
  upiId?: string;
  cardNum?: string;
  originalDescription?: string;
}

export interface MonthlyData {
  month: string;
  total: number;
  debit: number;
  credit: number;
  bank: number;
  upi: number;
  card: number;
  cash: number;
}

