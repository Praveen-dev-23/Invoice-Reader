import { Transaction } from "./types";

export const SEED_DATA: Transaction[] = [
  // January
  { id: "1", date: "2026-01-03", merchant: "Swiggy", category: "Food", amount: 340, method: "upi", type: "debit", referenceNum: "TXN10023901", upiId: "swiggy@upi", balance: 44660, originalDescription: "UPI-SWIGGY-GPAY-9012" },
  { id: "2", date: "2026-01-05", merchant: "BESCOM Electricity", category: "Bills", amount: 1850, method: "bank", type: "debit", referenceNum: "TXN10023902", balance: 42810, originalDescription: "NEFT-BESCOM-POWER BILL" },
  { id: "3", date: "2026-01-08", merchant: "Amazon India", category: "Shopping", amount: 2499, method: "card", type: "debit", referenceNum: "TXN10023903", cardNum: "XXXX-XXXX-XXXX-4122", balance: 40311, originalDescription: "CARD-AMZN MKTPLACE-POS" },
  { id: "4", date: "2026-01-10", merchant: "Zomato", category: "Food", amount: 480, method: "upi", type: "debit", referenceNum: "TXN10023904", upiId: "zomato@paytm", balance: 39831, originalDescription: "UPI-ZOMATO-PAYTM-4912" },
  { id: "5", date: "2026-01-12", merchant: "DMart", category: "Shopping", amount: 1240, method: "upi", type: "debit", referenceNum: "TXN10023905", upiId: "dmart@ybl", balance: 38591, originalDescription: "UPI-DMART RETAIL-PHONEPE" },
  { id: "6", date: "2026-01-15", merchant: "House Rent", category: "Bills", amount: 15000, method: "bank", type: "debit", referenceNum: "TXN10023906", balance: 23591, originalDescription: "NEFT-TRANSFER RENT ACC908" },
  { id: "7", date: "2026-01-18", merchant: "HP Petrol Pump", category: "Transportation", amount: 2500, method: "cash", type: "debit", balance: 21091, originalDescription: "CASH-WITHDRAWAL AT ATM" },
  { id: "8", date: "2026-01-20", merchant: "Netflix", category: "Subscriptions", amount: 649, method: "card", type: "debit", referenceNum: "TXN10023908", cardNum: "XXXX-XXXX-XXXX-4122", balance: 20442, originalDescription: "CARD-NETFLIX.COM DIGITAL" },
  { id: "9", date: "2026-01-22", merchant: "BigBasket", category: "Shopping", amount: 870, method: "upi", type: "debit", referenceNum: "TXN10023909", upiId: "bigbasket@ybl", balance: 19572, originalDescription: "UPI-BIGBASKET-PHONEPE-7712" },
  { id: "9b", date: "2026-01-23", merchant: "Salary Credit", category: "Transfer", amount: 45000, method: "bank", type: "credit", referenceNum: "TXN10023910", balance: 64572, originalDescription: "IMPS-INWARD-CORP SALARY CR" },
  { id: "10", date: "2026-01-25", merchant: "Ola Cabs", category: "Transportation", amount: 350, method: "upi", type: "debit", referenceNum: "TXN10023911", upiId: "olacabs@upi", balance: 64222, originalDescription: "UPI-OLA CABS TRAVEL RIDE" },
  { id: "11", date: "2026-01-28", merchant: "Apollo Pharmacy", category: "Healthcare", amount: 560, method: "cash", type: "debit", balance: 63662, originalDescription: "CASH AT PHARMACY COUNTER" },
  { id: "12", date: "2026-01-30", merchant: "ACT Fibernet", category: "Bills", amount: 999, method: "bank", type: "debit", referenceNum: "TXN10023913", balance: 62663, originalDescription: "NEFT-ACT FIBERNET INTERNET" },
  // February
  { id: "13", date: "2026-02-02", merchant: "Zomato", category: "Food", amount: 620, method: "upi", type: "debit", referenceNum: "TXN10023914", upiId: "zomato@paytm", balance: 62043, originalDescription: "UPI-ZOMATO-PAYTM-1102" },
  { id: "14", date: "2026-02-05", merchant: "Jio Postpaid", category: "Bills", amount: 599, method: "bank", type: "debit", referenceNum: "TXN10023915", balance: 61444, originalDescription: "NEFT-RELIANCE JIO BILL" },
  { id: "15", date: "2026-02-08", merchant: "Flipkart", category: "Shopping", amount: 3299, method: "card", type: "debit", referenceNum: "TXN10023916", cardNum: "XXXX-XXXX-XXXX-4122", balance: 58145, originalDescription: "CARD-FLIPKART INTERNET" },
  { id: "15b", date: "2026-02-09", merchant: "Flipkart Refund", category: "Shopping", amount: 1200, method: "card", type: "credit", referenceNum: "TXN10023917", cardNum: "XXXX-XXXX-XXXX-4122", balance: 59345, originalDescription: "REFUND-FLIPKART PAY-CREDIT" },
  { id: "16", date: "2026-02-10", merchant: "Swiggy", category: "Food", amount: 710, method: "upi", type: "debit", referenceNum: "TXN10023918", upiId: "swiggy@upi", balance: 58635, originalDescription: "UPI-SWIGGY-GPAY-4022" },
  { id: "17", date: "2026-02-12", merchant: "Reliance Fresh", category: "Shopping", amount: 1580, method: "upi", type: "debit", referenceNum: "TXN10023919", upiId: "reliance@ybl", balance: 57055, originalDescription: "UPI-RELIANCE FRESH-PHONEPE" },
  { id: "18", date: "2026-02-15", merchant: "House Rent", category: "Bills", amount: 15000, method: "bank", type: "debit", referenceNum: "TXN10023920", balance: 42055, originalDescription: "NEFT-TRANSFER RENT ACC908" },
  { id: "18b", date: "2026-02-16", merchant: "Salary Credit", category: "Transfer", amount: 45000, method: "bank", type: "credit", referenceNum: "TXN10023921", balance: 87055, originalDescription: "IMPS-INWARD-CORP SALARY CR" },
  { id: "19", date: "2026-02-18", merchant: "HP Petrol Pump", category: "Transportation", amount: 3000, method: "cash", type: "debit", balance: 84055, originalDescription: "CASH-WITHDRAWAL AT ATM" },
  { id: "20", date: "2026-02-20", merchant: "Hotstar", category: "Subscriptions", amount: 299, method: "card", type: "debit", referenceNum: "TXN10023923", cardNum: "XXXX-XXXX-XXXX-4122", balance: 83756, originalDescription: "CARD-DISNEY HOTSTAR SUB" },
  { id: "21", date: "2026-02-22", merchant: "Apollo Pharmacy", category: "Healthcare", amount: 1200, method: "upi", type: "debit", referenceNum: "TXN10023924", upiId: "apollo@upi", balance: 82556, originalDescription: "UPI-APOLLO MEDS-GPAY" },
  { id: "22", date: "2026-02-25", merchant: "Rapido", category: "Transportation", amount: 180, method: "upi", type: "debit", referenceNum: "TXN10023925", upiId: "rapido@paytm", balance: 82376, originalDescription: "UPI-RAPIDO BIKE-PAYTM" },
  { id: "23", date: "2026-02-27", merchant: "Local Vegetables", category: "Shopping", amount: 300, method: "cash", type: "debit", balance: 82076, originalDescription: "CASH SPENT AT LOCAL VEGETABLES" },
];
