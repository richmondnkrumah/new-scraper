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
    // Include other potential fields from Gemini like finishReason, safetyRatings etc. if needed
  }>;
  promptFeedback?: any; // Define further if you need to inspect this
}

export async function getTickerFromCompanyName(name: string) {
  const result = await yahooFinance.search(name, {}, { validateResult: false });
  // console.log(result)

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
  const response = await fetch(`https://api.logo.dev/search?q=${companyName}`, {
    headers: {
      "Authorization": `Bearer: sk_a4BuH4mFQU-Z0OPNe70CFw`
    }
  })

  const result = await response.json()
  return result[0].logo_url

}

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
    // It's good practice to clean the text if Gemini sometimes adds markdown ```json ... ```
    const cleanedText = rawText.replace(/^```json\s*|```\s*$/g, '').trim();
    const json = JSON.parse(cleanedText);

    if (!json || typeof json.companyA !== 'object' || json.companyA === null) {
      console.error('Parsed JSON does not contain a valid companyA object:', cleanedText);
      throw new Error('Gemini returned JSON in an unexpected structure (missing companyA).');
    }
    // You could add further validation here using a schema library like Zod if needed.
    return json.companyA;

  } catch (err) {
    console.error('Failed to parse Gemini response text as JSON:', err instanceof Error ? err.message : String(err));
    console.error('Raw text from Gemini:', rawText);
    throw new Error('Gemini returned invalid JSON format after parsing the text content.');
  }
}

function generateGeminiPrompt(companyName: string): string {
  return `
Return ONLY the following data in valid JSON format for the company "${companyName}".
Do not include any explanatory text, markdown formatting, or anything else before or after the JSON object.
The entire response should be a single JSON object.
the values should be of the full latest year 2024 - 2025.

The JSON object must have a single top-level key "companyA".

{
  "companyA": {
  "price": {
    "longName": ""
  },
  "summaryProfile": {
    "industry": "",
    "website": "",
    "country": "",
    "sector": "",
    "longBusinessSummary": "",
    "fullTimeEmployees": ""
  },
  "summaryDetail": {
    "marketCap": "",
    "volume": "",
    "averageVolume": "",
    "trailingPE": "",
    "forwardPE": "",
    "priceToSalesTrailing12Months": "",
    "beta": ""
  },
  "financialData": {
    "totalRevenue": "",
    "revenueGrowth": "",
    "earningsGrowth": "",
    "grossProfits": "",
    "grossMargins": "",
    "profitMargins": "",
    "freeCashflow": "",
    "debtToEquity": ""
  },
  "defaultKeyStatistics": {
    "priceToBook": ""
  },
  "majorHoldersBreakdown": {
    "institutionsPercentHeld": "",
    "insidersPercentHeld": ""
  },
  "custom": {
    "logo": "",
    "keyStrengths": ["", ""],
    "products": ["", ""],
    "competitors": ["", ""]
  }
}
}
If any field is unknown, return an empty string ("") for string fields, or an empty array ([]) for array fields. Do not use null or undefined.
;
}`}


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
      .map(item => ({
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