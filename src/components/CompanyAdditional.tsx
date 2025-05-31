'use client'
import React, { useState } from 'react'
import type { _company_data } from '@/app/page'
type Props = {
    data: _company_data
}

const CompanyAdditional = ({ data }: Props) => {
    const [showDetails, setShowDetails] = useState<boolean>(false)
    const additionalDetailsData = {
        "Full TIme Employees": data?.summaryProfile?.fullTimeEmployees,
        "Market Cap": data?.summaryDetail?.marketCap,
        "Volume": data?.summaryDetail?.volume,
        "Average Volume": data?.summaryDetail?.averageVolume,
        "Total Revenue": data?.financialData?.totalRevenue,
        "Gross Profit": data?.financialData?.grossProfits,
        "Description": data?.summaryProfile?.longBusinessSummary,
        // "Previous Close": data?.summaryDetail?.previousClose,
        // "Day Low": data?.summaryDetail?.dayLow,
        // "Day High": data?.summaryDetail?.dayHigh,
        // "PE Ratio": data?.indexTrend?.peRatio,
        // "Debt To Equity": data?.financialData?.debtToEquity,
        // "Quick Ratio": data?.financialData?.quickRatio,
        // "Current Ratio": data?.financialData?.currentRatio,
        // "Short Ratio": data?.defaultKeyStatistics?.shortRatio,
        // "PEG Ratio": data?.indexTrend?.pegRatio,
        // "Return On Assets": data?.financialData?.returnOnAssets,
        // "Return on Equity": data?.financialData?.returnOnEquity,
        // "Trailing EPS": data?.defaultKeyStatistics?.trailingEps,
        // "Trailing PE": data?.summaryDetail?.trailingPE,
        // "Forward PE": data?.summaryDetail?.forwardPE,
        // "Total Cash": data?.financialData?.totalCash,
        // "Revenue Growth": data?.financialData?.revenueGrowth,
        // "Gross Margins": data?.financialData?.grossMargins,
        // "Profit Margins": data?.financialData?.profitMargins,
        // "Earnings Growth": data?.financialData?.earningsGrowth
    }

    return (
        <div className='h-full flex flex-col gap-5'>
            <span className="cursor-pointer underline text-blue-500" onClick={() => setShowDetails(prev => !prev)}>click to see more</span>
            {
                showDetails &&
                <div className="border-gray-200 p-3 h-full rounded-xl bg-gray-100">
                    <h2 className='text-2xl text-gray-600 font-bold text-center'>Additional Details</h2>
                    {Object.entries(additionalDetailsData).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                            <span className="text-md font-bold text-black">{key}: </span>
                            <p className="text-base text-black">{String(value)}</p>
                        </div>
                    ))}
                </div>
            }
        </div>

    )
}

export default CompanyAdditional