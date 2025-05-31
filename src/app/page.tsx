'use client'
import { useState, type FormEvent } from "react";
import CompanyCard from "@/components/CompanyCard";
import { getTickerFromCompanyName, getCompanyData } from "@/lib/utils";
import CompanyBasic from "@/components/CompanyBasic";
import CompanyAdditional from "@/components/CompanyAdditional";


export type _company_data = Awaited<ReturnType<typeof getCompanyData>>

const page = () => {
  const [company1, setCompany1] = useState<string>("");
  const [company2, setCompany2] = useState<string>("");
  const [company1Data, setCompany1Data] = useState<_company_data>(null)
  const [company2Data, setCompany2Data] = useState<_company_data>(null)
  const [loading, setLoading] = useState<boolean>(true)


  const backgroundColors: { [companyName: string]: string } = {};
  if (!company1) backgroundColors["Apple Inc."] = '#60a5fa';
  if (!company2) backgroundColors["Microsoft Corporation"] = '#f87171';

  const getCompetitiveAnalysis = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const company1TickerSymbol = await getTickerFromCompanyName(company1)
    const company2TickerSymbol = await getTickerFromCompanyName(company2)
    console.log(company1TickerSymbol)
    console.log(company2TickerSymbol)
    if (company1TickerSymbol) {
      const company1DataResult = await getCompanyData(company1TickerSymbol)
      setCompany1Data(company1DataResult)
    }
    if (company2TickerSymbol) {
      const company2DataResult = await getCompanyData(company2TickerSymbol)
      setCompany2Data(company2DataResult)
    }
    setLoading(false)
    console.log(company1Data)
    console.log(company2Data)
  }
  return (
    <div className="max-w-7xl mx-auto p-4 flex flex-col min-h-[100dvh]">
      <h1 className="font-bold mb-6 text-center text-4xl">Competitor Comparison</h1>
      <div className="w-full p-4 ">
        <form className="flex gap-5 " onSubmit={getCompetitiveAnalysis}>
          <div className="grow">
            <label className="block text-lg mb-2 font-semibold">Company 1</label>
            <input
              type="text"
              required
              placeholder="Enter company name"
              className="w-full border border-gray-200 p-3 rounded-xl bg-gray-100 outline-none"
              value={company1}
              onChange={e => setCompany1(e.target.value)}
            />
          </div>
          <button className="bg-blue-500 font-semibold w-fit self-end  p-3 rounded-lg text-white">Compare</button>
          <div className="grow">
            <label className="block text-lg mb-2 font-semibold">Company 2</label>
            <input
              type="text"
              required
              placeholder="Enter company name"
              className="w-full border border-gray-200 p-3 rounded-xl bg-gray-100 outline-none"
              value={company2}
              onChange={e => setCompany2(e.target.value)}
            />
          </div>
        </form>

      </div>
      {
        loading && <div className="h-full py-5 grow flex flex-col gap-2 justify-center items-center"> 
          <div className="loader"></div>
          <p className="text-xl font-semibold text-gray-800">Getting Data</p>
        </div>

      }
      {
        (company1Data && company2Data) &&
        <div className="">
          <div className="grid grid-cols-2 p-4 gap-x-[90px] ">
            <CompanyBasic data={company1Data} />
            <CompanyBasic data={company2Data} />
          </div>
          <div className="grid grid-cols-2 p-6 gap-x-[90px]">
            <CompanyAdditional data={company1Data} />
            <CompanyAdditional data={company2Data} />
          </div>
        </div>
      }

    </div>
  )
}

export default page