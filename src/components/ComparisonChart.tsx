import React from 'react';
import type { _company_data } from '@/app/page'

type CompanyMetrics = Record<string, number | undefined>;

type ComparisonChartProps = {
    company1Data: _company_data;
    company2Data: _company_data;
}

export const ComparisonChart = ({
    company1Data,
    company2Data
}: ComparisonChartProps) => {
    // 1. Define categories and their metrics (keys must match company1Metrics/company2Metrics)
    const company1Name = company1Data?.price?.symbol!
    const company2Name = company2Data?.price?.symbol!
    const company1Metrics: CompanyMetrics = {
        "marketCap": company1Data?.summaryDetail?.marketCap,
        "totalRevenue": company1Data?.financialData?.totalRevenue,
        "grossMargins": company1Data?.financialData?.grossMargins,
        "profitMargins": company1Data?.financialData?.profitMargins,
        "freeCashflow": company1Data?.financialData?.freeCashflow,
        "trailingPE": company1Data?.summaryDetail?.trailingPE,
        "forwardPE": company1Data?.summaryDetail?.forwardPE,
        "priceToSales": company1Data?.summaryDetail?.priceToSalesTrailing12Months,
        "priceToBook": company1Data?.defaultKeyStatistics?.priceToBook,
        "debtToEquity": company1Data?.financialData?.debtToEquity,
        "beta": company1Data?.summaryDetail?.beta,
        "heldPercentInstitutions": company1Data?.majorHoldersBreakdown?.institutionsPercentHeld,
        "insidersPercentHeld": company1Data?.majorHoldersBreakdown?.insidersPercentHeld,
        "grossprofit": company1Data?.financialData?.grossProfits,
        "employees": company1Data?.summaryProfile?.fullTimeEmployees,
        "averageVolume": company1Data?.summaryDetail?.averageVolume,
        "volume": company1Data?.summaryDetail?.volume,

    };
    const company2Metrics: CompanyMetrics = {
        "marketCap": company2Data?.summaryDetail?.marketCap,
        "totalRevenue": company2Data?.financialData?.totalRevenue,
        "grossMargins": company2Data?.financialData?.grossMargins,
        "profitMargins": company2Data?.financialData?.profitMargins,
        "freeCashflow": company2Data?.financialData?.freeCashflow,
        "trailingPE": company2Data?.summaryDetail?.trailingPE,
        "forwardPE": company2Data?.summaryDetail?.forwardPE,
        "priceToSales": company2Data?.summaryDetail?.priceToSalesTrailing12Months,
        "priceToBook": company2Data?.defaultKeyStatistics?.priceToBook,
        "debtToEquity": company2Data?.financialData?.debtToEquity,
        "beta": company2Data?.summaryDetail?.beta,
        "heldPercentInstitutions": company2Data?.majorHoldersBreakdown?.institutionsPercentHeld,
        "insidersPercentHeld": company2Data?.majorHoldersBreakdown?.insidersPercentHeld,
        "grossprofit": company2Data?.financialData?.grossProfits,
        "employees": company2Data?.summaryProfile?.fullTimeEmployees,
        "averageVolume": company2Data?.summaryDetail?.averageVolume,
        "volume": company2Data?.summaryDetail?.volume,
    }

    console.log(company1Name,company1Metrics)
    console.log(company2Name,company2Metrics)

    const categories: {
        heading: string;
        metrics: { key: string; label: string }[];
    }[] = [
            {
                heading: 'Financial Metrics',
                metrics: [
                    { key: 'marketCap', label: 'Market Cap' },
                    { key: 'totalRevenue', label: 'Total Revenue' },
                    { key: 'grossMargins', label: 'Gross Margin' },
                    { key: 'grossProfit', label: 'Gross Profit' },
                    { key: 'profitMargins', label: 'Profit Margin' },
                    { key: 'freeCashflow', label: 'Free Cash Flow' },
                ],
            },
            {
                heading: 'Valuation Metrics',
                metrics: [
                    { key: 'trailingPE', label: 'Trailing P/E' },
                    { key: 'forwardPE', label: 'Forward P/E' },
                    { key: 'priceToSales', label: 'Price to Sales' },
                    { key: 'priceToBook', label: 'Price to Book' },
                    { key: 'debtToEquity', label: 'Debt to Equity' },
                ],
            },
            {
                heading: 'Growth & Stability',
                metrics: [
                    { key: 'employees', label: 'Employees' },
                    { key: 'volume', label: 'Volume' },
                    { key: 'averageVolume', label: 'Average Volume' },
                ],
            },
            {
                heading: 'Ownership & Sentiment',
                metrics: [
                    { key: 'heldPercentInstitutions', label: 'Institutional Holdings (%)' },
                    { key: 'insidersPercentHeld', label: 'Insider Holdings (%)' },
                ],
            },
        ];

    // normalize two values to percentage relative to their max
    //first version
    // function normalizePair(a: number, b: number): [number, number] {
    //     const max = Math.max(a, b);
    //     if (max === 0) return [0, 0];
    //     // Round to integer percent
    //     return [Math.round((a / max) * 100), Math.round((b / max) * 100)];
    // }
    // // second version
    // function normalizePair(a: number, b: number): [number, number] {
    //     const max = Math.max(a, b);
    //     const min = Math.min(a, b)
    //     let res1 = 0;
    //     let res2 = 0;

    //     if (max === 0) return [res1, res2];

    //     if (min < 0 && max > 0) {
    //         // check for one negative and one positive values
    //         res1 = 1
    //         res2 = Math.round((max / max) * 100)
    //     } else if (min < 0 && max < 0) {
    //         // check for both negative and calculate the absolute values and reverse them
    //         res1 = Math.abs(Math.round((max / min) * 100))
    //         res2 = Math.abs(Math.round((min / min) * 100))
    //     } else {
    //         // they are both positive so no need
    //         res1 = Math.round((a / max) * 100)
    //         res2 = Math.round((b / max) * 100)
    //     }
    //     return [min === a ? res1 : res2, max === a ? res1 : res2];
    // }
    //third version
    function normalizePair(a: number, b: number): [number, number] {
        // If values have different signs
        if ((a >= 0 && b < 0) || (a < 0 && b >= 0)) {
            return [
                a >= 0 ? 100 : 1,
                b >= 0 ? 100 : 1
            ];
        }

        // If both values are negative
        if (a < 0 && b < 0) {
            const max = Math.max(a, b); 
            return [
                Math.round((a / max) * 100),
                Math.round((b / max) * 100)
            ];
        }

        // If both values are positive or zero
        const max = Math.max(a, b);
        if (max === 0) return [0, 0];

        return [
            Math.round((a / max) * 100),
            Math.round((b / max) * 100)
        ];
    }


    // format numbers compactly (e.g. 2.5B, 1.2M, or decimals as-is)
    function formatValue(v: number): string {
        // If v is a percentage (0–100 range for growth, etc.), show as is
        // Otherwise, use compact notation for large numbers
        if (Math.abs(v) < 1000) {
            return v.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
            });
        }
        return new Intl.NumberFormat(undefined, {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 2,
        }).format(v);
    }

    // 4. Compute overall wins
    let company1Wins = 0;
    let company2Wins = 0;
    let totalComparisons = 0;

    categories.forEach(cat => {
        cat.metrics.forEach(({ key }) => {
            const a = company1Metrics[key];
            const b = company2Metrics[key];
            console.log(a)
            // Skip metrics that are missing for both
            if (a === undefined || b === undefined) return;
            console.log('yes')
            if (a > b) company1Wins++;
            else if (b > a) company2Wins++;
            totalComparisons++;
        });
    });
    const filteredCategories = categories.map((cat) => {
        const filteredMetrics = cat.metrics.filter(({ key }) => {
            const a = company1Metrics[key];
            const b = company2Metrics[key];
            // Keep this metric only if BOTH sides have a defined number
            return a !== undefined && b !== undefined;
        });
        return { heading: cat.heading, metrics: filteredMetrics };
    }).filter((cat) => cat.metrics.length > 0);
    // 3) Also drop any category that now has zero metrics

    const overallVerdict =
        company1Wins > company2Wins
            ? `${company1Name} outperforms ${company2Name}`
            : company2Wins > company1Wins
                ? `${company2Name} outperforms ${company1Name}`
                : `Both companies are evenly matched`;

    return (
        <div className="space-y-6 mb-10">
            <h1 className="font-bold mb-6 text-center text-4xl">{company1Name} vs {company2Name}</h1>

            {/* Comparison Table */}
            <div className="space-y-8">
                {filteredCategories.map((category) => (
                    <div key={category.heading} className="space-y-4">
                        {/* Category Heading */}
                        <h2 className="text-xl text-center font-semibold">{category.heading}</h2>
                        <div className="flex justify-center space-x-4">
                            <div className="flex items-center space-x-1">
                                <div className="w-4 h-4 bg-blue-500 rounded" />
                                <span className="text-sm font-medium">{company1Name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-4 h-4 bg-orange-500 rounded" />
                                <span className="text-sm font-medium">{company2Name}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {category.metrics.map(({ key, label }) => {
                                const valA = company1Metrics[key] ?? 0;
                                const valB = company2Metrics[key] ?? 0;
                                const [pctA, pctB] = normalizePair(valA, valB);

                                // Determine winner for this metric
                                let rowWinner: string | null = null;
                                if (valA > valB) rowWinner = company1Name;
                                else if (valB > valA) rowWinner = company2Name;
                                else rowWinner = 'Tie';

                                return (
                                    <div
                                        key={key}
                                        className="flex gap-5 items-center py-2"
                                    >
                                        {/* Metric Label */}
                                        <div className="text-md w-[400px] font-medium text-gray-700">{label}</div>

                                        {/* Company 1 Bar */}
                                        <div className="w-full h-10 flex gap-10 rounded">
                                            <div className="relative w-full bg-gray-200">
                                                <div
                                                    className="absolute left-0 top-0 h-10 bg-blue-500 rounded"
                                                    style={{ width: `${pctA}%` }}
                                                >
                                                </div>
                                            </div>
                                            <span className="self-center text-lg font-semibold text-black">
                                                {formatValue(valA)}
                                            </span>
                                        </div>

                                        {/* Company 2 Bar */}
                                        <div className=" w-full h-10 flex gap-10  rounded">
                                            <div className="relative grow bg-gray-200">
                                                <div
                                                    className="absolute left-0 top-0 h-10 bg-orange-500 rounded"
                                                    style={{ width: `${pctB}%` }}
                                                >
                                                </div>
                                            </div>
                                            <span className="text-lg self-center  font-semibold text-black">
                                                {formatValue(valB)}
                                            </span>
                                        </div>

                                        {/* Winner Indicator */}
                                        <div className="text-lg w-[300px] font-semibold text-center">
                                            {rowWinner === 'Tie' ? '⚖️ Tie' : `🏆 ${rowWinner}`}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Overall Analysis */}
            <div className="space-y-2 text-center">
                <h2 className="text-2xl text-center font-semibold">Overall Analysis</h2>
                <p className="text-lg text-gray-800">
                    {overallVerdict}. ({company1Name} won {company1Wins} out of{' '}
                    {totalComparisons}, {company2Name} won {company2Wins} out of{' '}
                    {totalComparisons})
                </p>
            </div>
        </div>
    );
};


export default ComparisonChart