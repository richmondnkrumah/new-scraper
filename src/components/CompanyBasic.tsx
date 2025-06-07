'use client'
import React, { useState } from 'react'
import type { _company_data } from '@/app/page'
import { parse } from 'tldts';
import Image from 'next/image'
type Props = {
    data: _company_data,
    logo: string
}

const CompanyBasic = ({ data, logo }: Props) => {
    const summarizedData = {
        "Company Name": data?.price?.longName,
        "Industry": data?.summaryProfile?.industry,
        "Website": data?.summaryProfile?.website,
        "Country": data?.summaryProfile?.country,
        "Sector": data?.summaryProfile?.sector,
    }

    return (
        <div className="border-gray-200 p-3 rounded-xl bg-gray-100">
            <div className='flex items-center justify-between'>
                <h2 className="text-xl font-bold text-blue-800">{data?.price?.symbol}</h2>
                <img className="w-20 h-20" src={`https://cdn.brandfetch.io/${parse(summarizedData?.Website!).domain}/w/400/h/400?c=1id_2I0zC2VtTcLOq9q`} alt="Company Logo" />
            </div>
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