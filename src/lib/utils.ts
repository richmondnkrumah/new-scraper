'use server'
import { _company_data } from "@/app/page";
import yahooFinance from "yahoo-finance2";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason: string,
    safetyRatings: any[]
  }>;
  promptFeedback?: any;
}

export async function getTickerFromCompanyName(name: string) {
  const result = await yahooFinance.search(name, {}, { validateResult: false });
  return (result.quotes[0] as { symbol: string } | undefined)?.symbol;

}

export async function getCompanyData(companyName: string) {
  const ticker = await getTickerFromCompanyName(companyName);
  const data = await yahooFinance.quoteSummary(ticker!, {
    modules: [
      'price',
      'summaryDetail',
      'financialData',
      'defaultKeyStatistics',
      'earnings',
      'incomeStatementHistory',
      'cashflowStatementHistory',
      'assetProfile',
      'summaryProfile',
      'majorHoldersBreakdown'
    ],
  });

  if (Object.keys(data).length === 0) {
    return null
  }
  return data
}

export const getCompanyLogo = async (companyName: string) => {
  try {
    const response = await fetch(`https://api.logo.dev/search?q=${companyName}`, {
      headers: {
        "Authorization": `Bearer: sk_a4BuH4mFQU-Z0OPNe70CFw`
      }
    });

    const result = await response.json();
    const logoUrl = result[0]?.logo_url;

    if (logoUrl) {
      return logoUrl;
    } else {
      // Use first 2 letters as placeholder text
      const initials = companyName.slice(0, 2).toUpperCase();
      const response2 = `https://placehold.jp/ffffff/000000/100x100.png?text=${initials}`
      return response2
    }
  } catch (error) {
    // Fallback if the API call fails
    const initials = companyName.slice(0, 2).toUpperCase();
    const response2 = `https://placehold.jp/ffffff/000000/100x100.png?text=${initials}`
    return response2
  }
};


const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent';

export async function getCompanyDataFromGemini(companyName: string) {
  const prompt = generateGeminiPrompt(companyName);

  let response: Response;
  try {
    response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7, // Consider adjusting for more deterministic JSON
          maxOutputTokens: 8192,
          topP: 1,
          topK: 1,
        }
      })
    });
  } catch (error) {
    console.error('Network error or fetch failed:', error);
    throw new Error('Failed to connect to Gemini API.');
  }

  if (!response.ok) {
    let errorBody = 'Could not read error body';
    try {
      errorBody = await response.text();
    } catch (e) { /* ignore */ }
    console.error(`Gemini API error: ${response.status} ${response.statusText}`, errorBody);
    throw new Error(`Gemini API request failed with status ${response.status}: ${errorBody}`);
  }

  let data: GeminiResponse;
  try {
    data = await response.json();
  } catch (error) {
    console.error('Failed to parse Gemini API response as JSON:', error);
    throw new Error('Gemini API returned non-JSON response.');
  }

  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    console.error('Gemini response is empty, malformed, or text part is missing:', JSON.stringify(data, null, 2));
    // Check for safety ratings or finish reasons if available
    const finishReason = data?.candidates?.[0]?.finishReason;
    const safetyRatings = data?.candidates?.[0]?.safetyRatings;
    if (finishReason === 'SAFETY' || (safetyRatings && safetyRatings.some(r => r.blocked))) {
      throw new Error('Gemini response blocked due to safety reasons. Check prompt or content.');
    }
    throw new Error('Gemini response is empty or malformed (no text found).');
  }

  try {

    const cleanedText = rawText.replace(/^```json\s*|```\s*$/g, '').trim();
    const json = JSON.parse(cleanedText);

    if (!json || typeof json !== 'object' || json === null) {
      console.error('Parsed JSON does not contain a valid object:', cleanedText);
      throw new Error('Gemini returned JSON in an unexpected structure (missing companyA).');
    }
    return json;

  } catch (err) {
    console.error('Failed to parse Gemini response text as JSON:', err instanceof Error ? err.message : String(err));
    console.error('Raw text from Gemini:', rawText);
    throw new Error('Gemini returned invalid JSON format after parsing the text content.');
  }
}
function generateGeminiPrompt(companyName: string): string {
  return `
Analyze the company "${companyName}". Your entire response MUST be a single, valid JSON object.
Do not include any text, explanations, markdown formatting, or code fences before or after the JSON.

**Instructions & Rules:**
1.  **Data Timeframe:** Use the most current data available. Financial metrics (like revenue, P/E) should be for the Trailing Twelve Months (TTM) unless specified otherwise.
2.  **Ticker Symbol:** The 'symbol' property must be the company's official stock ticker.
3.  **Data Types:**
    - For any **unknown or N/A string field** (e.g., website, industry), return an empty string \`""\`.
    - For any **unknown or N/A numerical field** (e.g., marketCap, trailingPE), return \`null\`. Do not use \`0\` or \`""\`.
4.  **Company Not Found:** If you cannot confidently identify the company, return the following specific JSON error object and nothing else: \`{ "error": "Company not found", "companyName": "${companyName}" }\`

**Required JSON Structure:**

{
"price":{
  "longName": "",
  "symbol": "",
  },
  "summaryProfile": {
    "industry": "",
    "website": "",
    "country": "",
    "sector": "",
    "longBusinessSummary": "",
    "fullTimeEmployees": null
  },
  "summaryDetail": {
    "marketCap": null,
    "volume": null,
    "averageVolume": null,
    "trailingPE": null,
    "forwardPE": null,
    "priceToSalesTrailing12Months": null,
    "beta": null
  },
  "financialData": {
    "totalRevenue": null,
    "revenueGrowth": null,
    "earningsGrowth": null,
    "grossProfits": null,
    "grossMargins": null,
    "profitMargins": null,
    "freeCashflow": null,
    "debtToEquity": null
  },
  "defaultKeyStatistics": {
    "priceToBook": null
  },
  "majorHoldersBreakdown": {
    "institutionsPercentHeld": null,
    "insidersPercentHeld": null
  }
}
`;
}


export type TickerOption = {
  symbol: string;
  name: string;
  exchange: string;
  quoteType: string;
  longname?: string;
};

export async function getTickerOptions(query: string): Promise<TickerOption[]> {
  try {
    const result = await yahooFinance.search(query, {}, { validateResult: false });
    const filtered = (result.quotes || [])
      .map((item: { symbol: any; shortname: any; longname: any; exchange: any; quoteType: any; }) => ({
        symbol: item.symbol,
        name: item.shortname || item.longname || item.symbol,
        exchange: item.exchange,
        quoteType: item.quoteType,
        longname: item.longname,
      }));
    return filtered;
  } catch (err) {
    console.error("Error searching ticker:", err);
    return [];
  }

}
const EXCHANGERATE_API_KEY = process.env.EXCHANGERATE_API_KEY!;
const BASE_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGERATE_API_KEY}`;

export async function convertCurrency(amount: number, from: string, to: string): Promise<number> {
  const res = await fetch(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`);
  const data = await res.json();
  // const data = JSON.parse(convert)
  const amounte = (data?.rates?.[to] * amount).toFixed(2);
  console.log("Currency conversion response:", data,amounte);
  return Number(amounte) || amount ;
}

export async function normalizeCompanyCurrency(companyData_: _company_data, from: string, to = "USD") {
  // console.log("Normalizing company data currency from", from, "to", to);
   const companyData = structuredClone(companyData_)

  if (companyData?.financialData?.totalRevenue) {
    const raw = companyData.financialData.totalRevenue || null;
    if (raw !== null) {
      const converted = await convertCurrency(raw, from, to);
      companyData.financialData.totalRevenue = converted ? converted : companyData.financialData.totalRevenue;
    }
  }
  if (companyData?.financialData?.freeCashflow) {
    const rawFreeCashflow = companyData.financialData.freeCashflow || null;
    if (rawFreeCashflow !== null) {
      const convertedFreeCashflow = await convertCurrency(rawFreeCashflow, from, to);
      companyData.financialData.freeCashflow = convertedFreeCashflow ? convertedFreeCashflow : companyData.financialData.freeCashflow;
    }
  }
  if (companyData?.financialData?.grossProfits) {
    const rawGrossProfits = companyData.financialData.grossProfits || null;
    if (rawGrossProfits !== null) {
      const convertedGrossProfits = await convertCurrency(rawGrossProfits, from, to);
      companyData.financialData.grossProfits = convertedGrossProfits ? convertedGrossProfits : companyData.financialData.grossProfits;
    }
  }
  if (companyData?.summaryDetail?.marketCap) {
    const rawMarketCap = companyData.summaryDetail.marketCap || null;
    if (rawMarketCap !== null) {
      const convertedMarketCap = await convertCurrency(rawMarketCap, from, to);
      companyData.summaryDetail.marketCap = convertedMarketCap ? convertedMarketCap : companyData.summaryDetail.marketCap;
    }
  }
  if (companyData?.summaryDetail?.currency) {
    companyData.summaryDetail.currency = to;
  }
  // console.log("Normalized company data:", companyData);
  return companyData;
}
