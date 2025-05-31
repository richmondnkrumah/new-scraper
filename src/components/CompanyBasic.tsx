'use client'
import React, { useState } from 'react'
import type { _company_data } from '@/app/page'
type Props = {
    data: _company_data
}

const CompanyBasic = ({ data }: Props) => {
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



    return (
        <div className="border-gray-200 h-full p-3 rounded-xl bg-gray-100">
            {Object.entries(summarizedData).map(([key, value]) => (
                <div key={key} className="flex gap-2">
                    <span className="text-md font-bold text-black">{key}: </span>
                    <p className="text-base text-black">{String(value)}</p>
                </div>
            ))}
        </div>

    )
}

export default CompanyBasic