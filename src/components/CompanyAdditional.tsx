'use client'
import React, { useState } from 'react'
import type { _company_data } from '@/app/page'
type Props = {
    data: _company_data
}

const CompanyAdditional = ({ data }: Props) => {
    const [showDetails, setShowDetails] = useState<boolean>(false)
    const additionalDetailsData = {
        "Market Cap": data?.summaryDetail?.marketCap,
        "Volume": data?.summaryDetail?.volume,
        "Average Volume": data?.summaryDetail?.averageVolume,
        "Total Revenue": data?.financialData?.totalRevenue,
        "revenueGrowth (%)": data?.financialData?.revenueGrowth,
        "earningsGrowth (%)": data?.financialData?.earningsGrowth,
        "Gross Profit": data?.financialData?.grossProfits,
        "Description": data?.summaryProfile?.longBusinessSummary,
        
    }
    console.log(additionalDetailsData,"Additional")
    

    return (
        <div className=' h-full flex flex-col gap-5'>
            <span className="cursor-pointer underline text-blue-500" onClick={() => setShowDetails(prev => !prev)}>click to see more</span>
            {
                showDetails &&
                <div className="border-gray-200 p-3 h-full rounded-xl bg-gray-100">
                    <h2 className='text-2xl text-black mb-2 font-bold text-center'>Additional Details</h2>
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