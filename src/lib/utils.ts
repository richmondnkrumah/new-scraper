'use server'
import yahooFinance from "yahoo-finance2";

export async function getTickerFromCompanyName(name: string) {
    const result = await yahooFinance.search(name);

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

    console.log("kk from the other side")
    console.log(Object.keys(data))
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