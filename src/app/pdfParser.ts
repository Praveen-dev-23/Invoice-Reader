import * as pdfjsLib from "pdfjs-dist";
import { Transaction, PaymentMethod, InvoiceItem, TransactionType } from "./types";

// Initialize worker src for client-side execution in Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function parsePdfInvoice(file: File): Promise<Partial<Transaction>> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let textContent = "";
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str);
      textContent += strings.join(" ") + "\n";
    }

    return extractInvoiceDetails(textContent, file.name);
  } catch (error) {
    console.error("Failed to parse PDF invoice:", error);
    throw error;
  }
}

function extractInvoiceDetails(text: string, fileName: string): Partial<Transaction> {
  const normalizedText = text.replace(/\s+/g, " ");

  // 1. Extract Amount
  // Match patterns like "Total: 1,234.56", "Grand Total: INR 500", "Amount: $45.00", "Paid: ₹999.00"
  let amount = 0;
  const amountRegexes = [
    /(?:grand\s+)?total\s*(?:amount)?\s*(?:due)?\s*(?:inr|rs\.?|₹|\$)?\s*([\d,]+\.?\d*)/i,
    /total\s*(?:paid)?\s*(?:inr|rs\.?|₹|\$)?\s*([\d,]+\.?\d*)/i,
    /amount\s*(?:due)?\s*(?:inr|rs\.?|₹|\$)?\s*([\d,]+\.?\d*)/i,
    /paid\s*(?:amount)?\s*(?:inr|rs\.?|₹|\$)?\s*([\d,]+\.?\d*)/i,
    /net\s*(?:payable|amount)\s*(?:inr|rs\.?|₹|\$)?\s*([\d,]+\.?\d*)/i,
    /(?:inr|rs\.?|₹|\$)\s*([\d,]+\.?\d*)/i
  ];

  for (const regex of amountRegexes) {
    const match = normalizedText.match(regex);
    if (match && match[1]) {
      const parsedVal = parseFloat(match[1].replace(/,/g, ""));
      if (!isNaN(parsedVal) && parsedVal > 0) {
        amount = parsedVal;
        break;
      }
    }
  }

  // 2. Extract Date
  // Match formats like YYYY-MM-DD, DD/MM/YYYY, or Month DD, YYYY
  let date = new Date().toISOString().slice(0, 10);
  const dateRegexes = [
    /\b(\d{4})[-/](\d{2})[-/](\d{2})\b/, // YYYY-MM-DD
    /\b(\d{2})[-/](\d{2})[-/](\d{4})\b/, // DD-MM-YYYY or MM-DD-YYYY
    /(?:date|invoice\s+date)\s*:\s*([a-zA-Z]+\s+\d{1,2},?\s+\d{4})/i, // January 15, 2026
    /(\d{1,2}\s+[a-zA-Z]+\s+\d{4})/ // 15 Jan 2026
  ];

  for (const regex of dateRegexes) {
    const match = normalizedText.match(regex);
    if (match) {
      if (match[1] && match[2] && match[3]) {
        // Simple reconstruct
        const first = match[1];
        const second = match[2];
        const third = match[3];
        if (first.length === 4) {
          date = `${first}-${second}-${third}`;
        } else if (third.length === 4) {
          date = `${third}-${second}-${first}`;
        }
        break;
      } else if (match[1]) {
        const parsedDate = Date.parse(match[1]);
        if (!isNaN(parsedDate)) {
          date = new Date(parsedDate).toISOString().slice(0, 10);
          break;
        }
      }
    }
  }

  // 3. Extract Merchant
  // Look for company keywords or common merchants, fallback to fileName base
  let merchant = "";
  const merchantKeywords = [
    "Amazon", "Swiggy", "Zomato", "Uber", "Netflix", "Spotify", "BESCOM", 
    "Airtel", "Jio", "Google", "Apple", "Microsoft", "Steam", "DMart", 
    "Starbucks", "McDonald", "Flipkart", "Myntra"
  ];
  
  for (const keyword of merchantKeywords) {
    if (new RegExp("\\b" + keyword, "i").test(normalizedText)) {
      merchant = keyword;
      break;
    }
  }

  if (!merchant) {
    // Clean up filename as merchant fallback
    merchant = fileName
      .replace(/\.[^/.]+$/, "") // remove extension
      .replace(/[_-]/g, " ") // replace dashes/underscores with space
      .replace(/\d+/g, "") // remove numbers
      .trim();
    if (merchant.length > 25) {
      merchant = merchant.slice(0, 25);
    }
    if (!merchant) merchant = "Unknown Merchant";
  }

  // 4. Extract Payment Method
  let method: PaymentMethod = "upi";
  if (/upi|gpay|google\s*pay|phonepe|paytm|bhim/i.test(normalizedText)) {
    method = "upi";
  } else if (/card|visa|mastercard|amex|rupay|credit\s*card|debit\s*card/i.test(normalizedText)) {
    method = "card";
  } else if (/bank|transfer|neft|rtgs|imps|wire\s*transfer|account/i.test(normalizedText)) {
    method = "bank";
  } else if (/cash|cod|hand/i.test(normalizedText)) {
    method = "cash";
  }

  // 5. Extract Category
  let category = "Other";
  const categoryKeywords: Record<string, string[]> = {
    Food: ["food", "swiggy", "zomato", "restaurant", "dining", "starbucks", "cafe", "eats"],
    Groceries: ["groceries", "supermarket", "dmart", "bigbasket", "reliance fresh", "vegetables", "fruits", "market"],
    Housing: ["rent", "lease", "housing", "landlord", "maintenance", "pg"],
    Utilities: ["electricity", "water", "gas", "bescom", "internet", "fibernet", "wifi", "bill", "postpaid", "broadband"],
    Shopping: ["shopping", "amazon", "flipkart", "myntra", "ajio", "clothing", "apparel", "store"],
    Transport: ["transport", "cab", "uber", "ola", "rapido", "auto", "petrol", "fuel", "diesel", "hp", "ride"],
    Health: ["health", "pharmacy", "apollo", "doctor", "medical", "medicine", "hospital", "clinic"],
    Entertainment: ["entertainment", "netflix", "spotify", "hotstar", "prime", "movie", "cinema", "show"],
    Transfer: ["transfer", "salary", "added", "refund", "remittance", "wire"]
  };

  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(kw => new RegExp("\\b" + kw, "i").test(normalizedText))) {
      category = cat;
      break;
    }
  }

  // 6. Extract Debit / Credit type
  let type: TransactionType = "debit";
  if (/refund|refunded|credit|credited|received|income|salary|cashback/i.test(normalizedText)) {
    type = "credit";
  }

  // 7. Extract Invoice line items (rough heuristic by finding lines with prices)
  const items: InvoiceItem[] = [];
  const lineItemRegex = /([a-zA-Z0-9\s]+?)\s+(?:inr|rs\.?|₹|\$)?\s*([\d,]+\.\d{2})\b/gi;
  let lineMatch;
  let count = 0;
  while ((lineMatch = lineItemRegex.exec(text)) !== null && count < 5) {
    const itemName = lineMatch[1].trim();
    const itemAmount = parseFloat(lineMatch[2].replace(/,/g, ""));
    // Filter out common totals
    if (
      itemName && 
      !isNaN(itemAmount) && 
      itemAmount < amount && 
      !/total|tax|subtotal|vat|discount|gst/i.test(itemName) &&
      itemName.length > 2
    ) {
      items.push({ name: itemName, amount: itemAmount });
      count++;
    }
  }

  return {
    merchant,
    amount,
    date,
    method,
    category,
    type,
    items: items.length > 0 ? items : undefined,
    fileName
  };
}
