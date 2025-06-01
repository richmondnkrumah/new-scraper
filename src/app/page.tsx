'use client'
import { useState, type FormEvent } from "react";
import CompanyCard from "@/components/CompanyCard";
import { getTickerFromCompanyName, getCompanyData, getCompanyLogo } from "@/lib/utils";
import CompanyBasic from "@/components/CompanyBasic";
import CompanyAdditional from "@/components/CompanyAdditional";
import ComparisonChart from '@/components/ComparisonChart'


export type _company_data = Awaited<ReturnType<typeof getCompanyData>>

const page = () => {
  const [company1, setCompany1] = useState<string>("");
  const [company2, setCompany2] = useState<string>("");
  const [company1Logo, setCompany1Logo] = useState<string>("");
  const [company2Logo, setCompany2Logo] = useState<string>("");
  const [company1Data, setCompany1Data] = useState<_company_data>(null)
  const [company2Data, setCompany2Data] = useState<_company_data>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")



  const getCompetitiveAnalysis = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCompany1Data(null)
    setCompany2Data(null)
    setLoading(true)
    try {

      const company1TickerSymbol = await getTickerFromCompanyName(company1)
      const company2TickerSymbol = await getTickerFromCompanyName(company2)
      console.log(company1TickerSymbol)
      console.log(company2TickerSymbol)
      if (company1TickerSymbol) {
        const company1DataResult = await getCompanyData(company1TickerSymbol)
        const company1LogoResult = await getCompanyLogo(company1)
        setCompany1Logo(company1LogoResult)
        setCompany1Data(company1DataResult)
      }
      if (company2TickerSymbol) {
        const company2DataResult = await getCompanyData(company2TickerSymbol)
        const company2LogoResult = await getCompanyLogo(company2)
        setCompany2Logo(company2LogoResult)
        setCompany2Data(company2DataResult)
      }
    }
    catch (err) {
      setError(true)
      setErrorMessage(err as string)
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
        error && <div className="h-full py-5 grow flex flex-col gap-2 justify-center items-center">
          <div className="loader"></div>
          <p className="text-xl font-semibold text-gray-800">Additinoal Details: {errorMessage}</p>
        </div>

      }
      {
        (company1Data && company2Data) &&
        <div className="">
          <div className="grid grid-cols-2 p-4 gap-x-10 ">
            <CompanyBasic data={company1Data} logo={company1Logo} />
            <CompanyBasic data={company2Data} logo={company2Logo} />
          </div>
          <div className="grid grid-cols-2 px-4 pb-10 gap-x-10">
            <CompanyAdditional data={company1Data} />
            <CompanyAdditional data={company2Data} />
          </div>
          <ComparisonChart company1Data={company1Data} company2Data={company2Data} />
        </div>
      }

    </div>
  )
}

export default page