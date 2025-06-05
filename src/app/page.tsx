'use client'
import { useEffect, useState, type FormEvent } from "react";
import {  getCompanyData, getCompanyLogo, getCompanyDataFromGemini } from "@/lib/utils";
import CompanyBasic from "@/components/CompanyBasic";
import CompanyAdditional from "@/components/CompanyAdditional";
import ComparisonChart from '@/components/ComparisonChart'
import ChartPie from "@/components/ChartPie";
import TickerSelector from "@/components/TickerSelector";
import type { TickerOption } from "@/lib/utils";
import { getTickerOptions } from "@/lib/utils"; 
import NoTickerFound from "@/components/NoTickerFound";


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
  const [fallbackUsed1, setFallbackUsed1] = useState(false);
  const [fallbackUsed2, setFallbackUsed2] = useState(false);
  const [results1, setResults1] = useState<TickerOption[]>([]);
  const [results2, setResults2] = useState<TickerOption[]>([]);
  const [ticker1, SetTicker1] = useState<string>("")
  const [ticker2, SetTicker2] = useState<string>("")
  const [noTicker1, setNoTicker1] = useState(false);
  const [noTicker2, setNoTicker2] = useState(false);


  const getTickers = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResults1([]);
    setResults2([]);
    setLoading(true);
    setCompany1Data(null);
    setCompany2Data(null);
    const res1 = await getTickerOptions(company1);
    const res2 = await getTickerOptions(company2);
    setNoTicker1(res1.length === 0);
    setNoTicker2(res2.length === 0);
    console.log(company1, company2)
    console.log(res1)
    console.log(res2)
    setResults1(res1);
    setResults2(res2);
    setLoading(false);
  }


  useEffect(() => {
    // Fetch company 1
    if (!ticker1) return;
    console.log("start fetching here", ticker1)
    setFallbackUsed1(false);
    setCompany1Data(null);
    setCompany1Logo("");

    const doAll = async () => {

      let data1 = null, logo1 = "";
      if (ticker1) {
        data1 = await getCompanyData(ticker1);
        logo1 = await getCompanyLogo(company1);

      }
      if (!data1) {
        data1 = await getCompanyDataFromGemini(company1);
        console.log("Using fallback for company 1:", data1);
        setFallbackUsed1(true);
      }
      setCompany1Data(data1);
      setCompany1Logo(logo1);
      console.log("Company 1 Data:", data1);
    }
    doAll()

  }, [ticker1])

  useEffect(() => {
    // Fetch company 1
    if (!ticker2) return;
    console.log("start fetching here", ticker2)
    setFallbackUsed2(false);
    setCompany2Data(null);
    setCompany2Logo("");

    const doAll = async () => {

      let data2 = null, logo2 = "";
      if (ticker2) {
        data2 = await getCompanyData(ticker2);
        logo2 = await getCompanyLogo(company2);
      }
      if (!data2) {
        data2 = await getCompanyDataFromGemini(company2);
        console.log("Using fallback for company 1:", data2);
        setFallbackUsed2(true);
      }
      setCompany2Data(data2);
      setCompany2Logo(logo2);
      console.log("Company 2 Data:", data2);
    }
    doAll()

  }, [ticker2])



  return (
    <div className="max-w-7xl mx-auto p-4 flex flex-col min-h-[100dvh]">
      <h1 className="font-bold mb-6 text-center text-4xl">Competitor Comparison</h1>
      <div className="w-full p-4 ">
        <form className="flex gap-5 " onSubmit={getTickers}>
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
        (fallbackUsed1 || fallbackUsed2) &&
        <div className="p-4 mt-2 text-sm text-yellow-700 bg-yellow-100 rounded-lg">
          <p className="font-semibold mb-1">Note:</p>
          <ul className="list-disc list-inside">
            {fallbackUsed1 && <li>Data for <strong>{company1}</strong> was incomplete or unavailable on Yahoo Finance. Fetched from Gemini AI instead.</li>}
            {fallbackUsed2 && <li>Data for <strong>{company2}</strong> was incomplete or unavailable on Yahoo Finance. Fetched from Gemini AI instead.</li>}
          </ul>
        </div>
      }

      {
        loading && <div className="h-full py-5 grow flex flex-col gap-2 justify-center items-center">
          <div className="loader"></div>
          <p className="text-xl font-semibold text-gray-800">Getting Data</p>
        </div>

      }
      {error && (
        <div className="h-full py-5 grow flex flex-col gap-2 justify-center items-center text-red-600">
          <span className="text-2xl">⚠️</span>
          <p className="text-xl font-semibold">Failed to load comparison data</p>
          <p>{errorMessage}</p>
        </div>
      )}
      {(results1.length > 0 || results2.length > 0) && (
        <div className="grid grid-cols-2 gap-x-10 px-4">
          {results1.length > 0 && (
            <TickerSelector
              results={results1}
              onSelect={(selected) => {
                console.log("Selected Ticker 1:", selected);
                SetTicker1(prev => {
                  if (prev === selected) return ""; 
                  return selected;
                }); setResults1([]);
              }}
            />
          )}
          {results2.length > 0 && (
            <TickerSelector
              results={results2}
              onSelect={(selected) => {
                console.log("Selected Ticker 2:", selected);
                SetTicker2(prev => {
                  if (prev === selected) return ""; 
                  return selected;
                });
                setResults2([]);
              }}
            />
          )}
        </div>
      )}

      {/* Main comparison cards side-by-side */}
      {(company1Data || company2Data || noTicker1 || noTicker2  ) && (
        <div className="flex gap-10 px-4 py-6">
          <div className="w-1/2 flex flex-col justify-between bg-white rounded-xl p-4 shadow">
            {noTicker1 ? (
              <NoTickerFound name={company1} />
            ) : company1Data ? (
              <>
                <CompanyBasic data={company1Data} logo={company1Logo} />
                <CompanyAdditional data={company1Data} />
                <ChartPie data={company1Data} />
              </>
            ) : null}
          </div>

          <div className="w-1/2 flex flex-col justify-between bg-white rounded-xl p-4 shadow">
            {noTicker2 ? (
              <NoTickerFound name={company2} />
            ) : company2Data ? (
              <>
                <CompanyBasic data={company2Data} logo={company2Logo} />
                <CompanyAdditional data={company2Data} />
                <ChartPie data={company2Data} />
              </>
            ) : null}
          </div>

        </div>
      )}

      {/* Final Comparison Chart below both */}
      {company1Data && company2Data && (
        <div className="px-4 py-6">
          <ComparisonChart company1Data={company1Data} company2Data={company2Data} />
        </div>
      )}

    </div >
  )
}

export default page