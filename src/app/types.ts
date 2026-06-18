export type PaymentMethod = "bank" | "upi" | "card" | "cash";
export type Page = "dashboard" | "bank" | "upi" | "card" | "cash" | "upload";

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  method: PaymentMethod;
}

export interface MonthlyData {
  month: string;
  total: number;
  bank: number;
  upi: number;
  card: number;
  cash: number;
}
