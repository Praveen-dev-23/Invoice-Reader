import * as XLSX from "xlsx";
import { Transaction, PaymentMethod, TransactionType } from "./types";

export async function parseExcelStatement(file: File): Promise<Partial<Transaction>[]> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  
  // Get first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert worksheet to JSON (array of arrays)
  const rows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
  
  const transactions: Partial<Transaction>[] = [];
  
  // Look for header row to identify column indexes
  let headerIndex = -1;
  let colMap: Record<string, number> = {
    date: -1,
    merchant: -1,
    category: -1,
    amount: -1,
    method: -1,
    type: -1
  };
  
  for (let i = 0; i < Math.min(rows.length, 15); i++) {
    const row = rows[i];
    if (!Array.isArray(row)) continue;
    
    const stringRow = row.map(cell => String(cell).toLowerCase().trim());
    
    // Check if we find standard keywords
    const dateIdx = stringRow.findIndex(cell => cell.includes("date") || cell.includes("txn date"));
    const merchantIdx = stringRow.findIndex(cell => cell.includes("merchant") || cell.includes("description") || cell.includes("payee") || cell.includes("particulars"));
    const amountIdx = stringRow.findIndex(cell => cell.includes("amount") || cell.includes("value") || cell.includes("amount (inr)") || cell.includes("amount (rs)"));
    
    if (dateIdx !== -1 && merchantIdx !== -1 && amountIdx !== -1) {
      headerIndex = i;
      colMap.date = dateIdx;
      colMap.merchant = merchantIdx;
      colMap.amount = amountIdx;
      
      // Optional columns
      colMap.category = stringRow.findIndex(cell => cell.includes("category"));
      colMap.method = stringRow.findIndex(cell => cell.includes("method") || cell.includes("mode") || cell.includes("payment"));
      colMap.type = stringRow.findIndex(cell => cell.includes("type") || cell.includes("dr/cr") || cell.includes("debit/credit"));
      break;
    }
  }
  
  // If no clear headers found, try mapping by position (Date: 0, Description: 1, Amount: 2)
  const startRow = headerIndex !== -1 ? headerIndex + 1 : 0;
  const useColMap = headerIndex !== -1;
  
  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i];
    if (!Array.isArray(row) || row.length < 3) continue;
    
    let dateStr = "";
    let merchantStr = "";
    let amountVal = 0;
    let categoryStr = "Other";
    let methodVal: PaymentMethod = "upi";
    let typeVal: TransactionType = "debit";
    
    if (useColMap) {
      dateStr = String(row[colMap.date] || "").trim();
      merchantStr = String(row[colMap.merchant] || "").trim();
      amountVal = parseFloat(String(row[colMap.amount] || "0").replace(/,/g, ""));
      
      if (colMap.category !== -1 && row[colMap.category]) {
        categoryStr = String(row[colMap.category]).trim();
      }
      if (colMap.method !== -1 && row[colMap.method]) {
        methodVal = (String(row[colMap.method]).toLowerCase().trim() as PaymentMethod) || "upi";
      }
      if (colMap.type !== -1 && row[colMap.type]) {
        const typeStr = String(row[colMap.type]).toLowerCase().trim();
        if (typeStr.includes("credit") || typeStr.includes("cr") || typeStr === "c" || typeStr.includes("received")) {
          typeVal = "credit";
        }
      }
    } else {
      // Direct position assumptions
      dateStr = String(row[0] || "").trim();
      merchantStr = String(row[1] || "").trim();
      amountVal = parseFloat(String(row[2] || "0").replace(/,/g, ""));
      if (row[3]) categoryStr = String(row[3]).trim();
      if (row[4]) methodVal = (String(row[4]).toLowerCase().trim() as PaymentMethod) || "upi";
      if (row[5]) {
        const typeStr = String(row[5]).toLowerCase().trim();
        if (typeStr.includes("credit") || typeStr.includes("cr") || typeStr === "c") typeVal = "credit";
      }
    }
    
    if (dateStr && merchantStr && !isNaN(amountVal) && amountVal > 0) {
      // Parse Excel dates if stored as serial numbers
      if (/^\d{5}(\.\d+)?$/.test(dateStr)) {
        const serial = parseFloat(dateStr);
        const dateObj = new Date((serial - 25569) * 86400 * 1000);
        dateStr = dateObj.toISOString().slice(0, 10);
      }
      
      // Regularize date format if needed
      if (dateStr.includes("/") || dateStr.includes("-")) {
        // Just extract date
        const matches = dateStr.match(/(\d{2,4})[-/](\d{2})[-/](\d{2,4})/);
        if (matches) {
          const first = matches[1];
          const second = matches[2];
          const third = matches[3];
          if (first.length === 4) {
            dateStr = `${first}-${second}-${third}`;
          } else if (third.length === 4) {
            dateStr = `${third}-${second}-${first}`;
          }
        }
      } else {
        dateStr = new Date().toISOString().slice(0, 10);
      }
      
      // Auto classify categories if not provided
      if (categoryStr === "Other") {
        const desc = merchantStr.toLowerCase();
        if (/swiggy|zomato|food|restaurant|eats|cafe/i.test(desc)) categoryStr = "Food";
        else if (/amazon|flipkart|myntra|ajio|shopping/i.test(desc)) categoryStr = "Shopping";
        else if (/uber|ola|rapido|cab|petrol|fuel|hp/i.test(desc)) categoryStr = "Transportation";
        else if (/electricity|water|bescom|internet|fibernet|bill|telecom|postpaid/i.test(desc)) categoryStr = "Bills";
        else if (/doctor|medical|pharmacy|apollo|hospital/i.test(desc)) categoryStr = "Healthcare";
        else if (/netflix|spotify|hotstar|prime|youtube|entertainment/i.test(desc)) categoryStr = "Entertainment";
        else if (/salary|credited|remittance/i.test(desc)) {
          categoryStr = "Transfer";
          typeVal = "credit";
        }
      }
      
      // Auto detect type
      if (merchantStr.toLowerCase().includes("refund") || merchantStr.toLowerCase().includes("credited") || merchantStr.toLowerCase().includes("salary") || merchantStr.toLowerCase().includes("added")) {
        typeVal = "credit";
      }
      
      // Auto detect method
      if (/upi|gpay|phonepe/i.test(merchantStr.toLowerCase())) methodVal = "upi";
      else if (/card|visa|master/i.test(merchantStr.toLowerCase())) methodVal = "card";
      
      transactions.push({
        id: Math.random().toString(36).substr(2, 9),
        date: dateStr,
        merchant: merchantStr,
        category: categoryStr,
        amount: amountVal,
        method: methodVal,
        type: typeVal,
        fileName: file.name
      });
    }
  }
  
  return transactions;
}
