'use client'
import React, { useState } from 'react'
import type { _company_data } from '@/app/page'
import { formatValue } from '@/lib/helper';

type Props = {
    data: _company_data
}

const CompanyAdditional = ({ data }: Props) => {
    const [showDetails, setShowDetails] = useState<boolean>(false)


    const additionalDetailsData = {
        "Market Cap (USD)": formatValue(data?.summaryDetail?.marketCap!),
        "Volume": formatValue(data?.summaryDetail?.volume!),
        "Average Volume": formatValue(data?.summaryDetail?.averageVolume!),
        "Total Revenue (USD)": formatValue(data?.financialData?.totalRevenue!),
        "revenueGrowth (%)": data?.financialData?.revenueGrowth,
        "earningsGrowth (%)": data?.financialData?.earningsGrowth,
        "Gross Profit (USD)": formatValue(data?.financialData?.grossProfits!),
        // "Description": data?.summaryProfile?.longBusinessSummary,
    }
    const description = data?.summaryProfile?.longBusinessSummary!.split('.');
    // console.log(additionalDetailsData,"Additional")


    return (
        <div className=' h-full flex flex-col gap-5'>
            <span className="pl-3 cursor-pointer underline text-blue-500" onClick={() => setShowDetails(prev => !prev)}>{!showDetails ? "click to see more": "click to hide more"}</span>
            {
                showDetails &&
                <div className="border-gray-200 p-3 h-full rounded-xl bg-gray-100">
                    <h2 className='text-xl sm:text-2xl text-black mb-2 font-bold text-center'>Additional Details</h2>
                    {Object.entries(additionalDetailsData).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                            <span className="text-sm sm:text-md font-bold text-black">{key}: </span>
                            <p className="text-sm sm:text-base text-black">{String(value)}</p>
                        </div>
                    ))}
                    {
                        (description && description.length > 0) && (
                            <>
                                <h2 className='text-xl text-center text-black mt-3 font-bold'>Description</h2>
                                <ul className="list-disc pl-5 mt-1 flex flex-col gap-2">
                                    {
                                        description.map((line, index) => (
                                            line.trim() &&
                                            <li key={index} className="text-sm sm:text-base text-black">
                                                {line.trim() + (index < description.length - 1 ? '.' : '')}
                                            </li>
                                        ))
                                    }
                                </ul>
                            </>
                        )
                    }
                </div>
            }
        </div>

    )
}

export default CompanyAdditional