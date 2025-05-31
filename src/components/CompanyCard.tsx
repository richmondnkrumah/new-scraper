'use client'
import React, { useState } from 'react'
import type { _company_data } from '@/app/page'
type Props = {
    data: _company_data
}

const CompanyCard = ({ data }: Props) => {
    const [showDetails, setShowDetails] = useState<boolean>(false)
    const summarizedData = {
        "Company Name": data?.price?.longName,
        "Website": data?.summaryProfile?.website,
        "Address": data?.summaryProfile?.address1,
        "City": data?.summaryProfile?.city,
        "State": data?.summaryProfile?.state,
        "Zip": data?.summaryProfile?.zip,
        "Country": data?.summaryProfile?.country,
        "Phone": data?.summaryProfile?.phone,
        "Industry": data?.summaryProfile?.industry,
        "Sector": data?.summaryProfile?.sector,
        "Symbol": data?.price?.symbol,
        "Currency": data?.price?.currency,
        "Full TIme Employees": data?.summaryProfile?.fullTimeEmployees,
        "Business Summary": data?.summaryProfile?.longBusinessSummary,
    }
    const additionalDetailsData = {
        "Market Cap": data?.summaryDetail?.marketCap,
        "Previous Close": data?.summaryDetail?.previousClose,
        "Day Low": data?.summaryDetail?.dayLow,
        "Day High": data?.summaryDetail?.dayHigh,
        "PE Ratio": data?.indexTrend?.peRatio,
        "Debt To Equity": data?.financialData?.debtToEquity,
        "Quick Ratio": data?.financialData?.quickRatio,
        "Current Ratio": data?.financialData?.currentRatio,
        "Short Ratio": data?.defaultKeyStatistics?.shortRatio,
        "PEG Ratio": data?.indexTrend?.pegRatio,
        "Return On Assets": data?.financialData?.returnOnAssets,
        "Return on Equity": data?.financialData?.returnOnEquity,
        "Trailing EPS": data?.defaultKeyStatistics?.trailingEps,
        "Trailing PE": data?.summaryDetail?.trailingPE,
        "Forward PE": data?.summaryDetail?.forwardPE,
        "Volume": data?.summaryDetail?.volume,
        "Average Volume": data?.summaryDetail?.averageVolume,
        "Total Cash": data?.financialData?.totalCash,
        "Total Revenue": data?.financialData?.totalRevenue,
        "Revenue Growth": data?.financialData?.revenueGrowth,
        "Gross Profit": data?.financialData?.grossProfits,
        "Gross Margins": data?.financialData?.grossMargins,
        "Profit Margins": data?.financialData?.profitMargins,
        "Earnings Growth": data?.financialData?.earningsGrowth
    }



    return (
        <div>
            <div className='w-full flex flex-col gap-5  '>
                <div className='h-fit'>
                    <div className="border-gray-200 h-full p-3 rounded-xl bg-gray-100">
                        {Object.entries(summarizedData).map(([key, value]) => (
                            <div key={key} className="flex gap-2">
                                <span className="text-md font-semibold text-gray-600">{key}: </span>
                                <p className="text-base text-black">{String(value)}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <span className="cursor-pointer underline text-blue-500" onClick={() => setShowDetails(prev => !prev)}>click to see more</span>
                {
                    showDetails &&
                    <div className="border-gray-200 p-3 rounded-xl bg-gray-100">
                        <h2 className='text-xl text-gray-600 font-bold'>Additional Details</h2>
                        {Object.entries(additionalDetailsData).map(([key, value]) => (
                            <div key={key} className="flex gap-2">
                                <span className="text-md font-semibold text-gray-600">{key}: </span>
                                <p className="text-base text-black">{String(value)}</p>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>

    )
}

export default CompanyCard