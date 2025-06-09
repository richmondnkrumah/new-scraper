'use client'
import { useEffect, useState, type FormEvent } from "react";
import { getCompanyData, getCompanyLogo, getCompanyDataFromGemini, normalizeCompanyCurrency } from "@/lib/utils";
import CompanyBasic from "@/components/CompanyBasic";
import CompanyAdditional from "@/components/CompanyAdditional";
import ComparisonChart from '@/components/ComparisonChart'
import ChartPie from "@/components/ChartPie";
import TickerSelector from "@/components/TickerSelector";
import type { TickerOption } from "@/lib/utils";
import { getTickerOptions } from "@/lib/utils";
import NoTickerFound from "@/components/NoTickerFound";
import Image from "next/image";


export type _company_data = Awaited<ReturnType<typeof getCompanyData>>

const page = () => {
  const [company1, setCompany1] = useState<string>("");
  const [company2, setCompany2] = useState<string>("");
  const [company1Symbol, setCompany1Symbol] = useState<string>("");
  const [company2Symbol, setCompany2Symbol] = useState<string>("");
  const [company1Logo, setCompany1Logo] = useState<string>("");
  const [company2Logo, setCompany2Logo] = useState<string>("");
  const [company1Data, setCompany1Data] = useState<_company_data>(null)
  const [company2Data, setCompany2Data] = useState<_company_data>(null)
  const [globalLoading, setGlobalLoading] = useState<boolean>(false)
  const [error1, setError1] = useState<boolean>(false)
  const [error2, setError2] = useState<boolean>(false)
  const [loading1, setLoading1] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [fallbackUsed1, setFallbackUsed1] = useState(false);
  const [fallbackUsed2, setFallbackUsed2] = useState(false);
  const [results1, setResults1] = useState<TickerOption[]>([]);
  const [results2, setResults2] = useState<TickerOption[]>([]);
  const [ticker1, SetTicker1] = useState<string>("")
  const [ticker2, SetTicker2] = useState<string>("")
  const [noTicker1, setNoTicker1] = useState(false);
  const [noTicker2, setNoTicker2] = useState(false);
  const [noTickerName1, setNoTickerName1] = useState("");
  const [noTickerName2, setNoTickerName2] = useState("");

  const getTickers = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResults1([]);
    setResults2([]);
    setGlobalLoading(true);
    setCompany1Data(null);
    setCompany2Data(null);
    const res1 = await getTickerOptions(company1);
    const res2 = await getTickerOptions(company2);
    if (res1.length === 0) {
      setNoTicker1(true);
      setNoTickerName1(company1); // freeze current input
    } else {
      setNoTicker1(false);
      setNoTickerName1("");
    }

    if (res2.length === 0) {
      setNoTicker2(true);
      setNoTickerName2(company2);
    } else {
      setNoTicker2(false);
      setNoTickerName2("");
    }
    // console.log(company1, company2)
    // console.log(res1)
    // console.log(res2)
    setResults1(res1);
    setResults2(res2);
    setGlobalLoading(false);
  }


  useEffect(() => {
    // Fetch company 1
    if (!ticker1) return;
    setLoading1(true);
    setError1(false);
    setFallbackUsed1(false);
    setCompany1Data(null);
    setCompany1Logo("");
    // console.log("start fetching here", ticker1)

    const doAll = async () => {
      try {
        let data1 = null, logo1 = "";
        if (ticker1) {
          data1 = await getCompanyData(ticker1);
          // console.log(company1Symbol, "Company 1 Symbol")
          logo1 = await getCompanyLogo(company1Symbol);
          // console.log("Company 1 Logo:", logo1);
        }
        if (!data1 || Object.keys(data1?.summaryProfile!).length < 6) {
          setFallbackUsed1(true);
          data1 = await getCompanyDataFromGemini(company1Symbol);
          // console.log("Using fallback for company 1:", data1);
        }
        if (data1?.summaryDetail.currency && data1.summaryDetail.currency !== "USD") {
          data1 = await normalizeCompanyCurrency(data1, data1.summaryDetail.currency, "USD");
          // console.log("Normalized company 1 data:", data1);
        }
        setCompany1Data(data1);
        setCompany1Logo(logo1);
        // console.log("Company 1 Data:", data1);
      }
      catch (error) {
        console.error("Error fetching company 1 data:", error);
        setError1(true);
      }
      setLoading1(false);
    }
    doAll()

  }, [ticker1])

  useEffect(() => {
    // Fetch company 1
    if (!ticker2) return;
    setLoading2(true);
    setError2(false);
    setFallbackUsed2(false);
    setCompany2Data(null);
    setCompany2Logo("");
    // console.log("start fetching here", ticker2)

    const doAll = async () => {
      try {

        let data2 = null, logo2 = "";
        if (ticker2) {
          data2 = await getCompanyData(ticker2);
          // console.log(company2Symbol, "Company 2 Symbol")
          logo2 = await getCompanyLogo(company2Symbol);
        }
        if (!data2 || Object.keys(data2?.summaryProfile!).length < 6) {
          setFallbackUsed2(true);
          data2 = await getCompanyDataFromGemini(company2Symbol);
          // console.log("Using fallback for company 1:", data2);
        }
        if (data2?.summaryDetail.currency && data2.summaryDetail.currency !== "USD") {
          data2 = await normalizeCompanyCurrency(data2, data2.summaryDetail.currency, "USD");
        }
        setCompany2Data(data2);
        setCompany2Logo(logo2);
        // console.log("Company 2 Data:", data2);
      }
      catch (error) {
        // console.error("Error fetching company 2 data:", error);
        setError2(true);
      }
      setLoading2(false);
    }
    doAll()

  }, [ticker2])

  return (
    <div className="max-w-7xl gap-2  mx-auto p-2 sm:p-4 flex flex-col min-h-[100dvh]">
      <div className="text-center">
        <h1 className="font-bold mb-2 sm:mb-6 text-center text-2xl sm:text-4xl">Competitor Comparison</h1>
        <p className="text-sm sm:text-lg">📢 Tip: Enter the exact company name (as registered) to get the most reliable and detailed comparison.</p>
      </div>
      <div className="w-full sm:p-4 ">
        <form className="flex gap-2 sm:gap-5 " onSubmit={getTickers}>
          <div className="grow">
            <label className="block sm:text-lg mb-2 font-semibold">Company 1</label>
            <input
              type="text"
              required
              placeholder="Enter company name"
              className="w-full border border-gray-200 p-3 rounded-xl bg-gray-100 outline-none"
              value={company1}
              onChange={e => setCompany1(e.target.value)}
            />
          </div>
          <button className="bg-blue-500 text-sm font-semibold  w-fit self-end px-2 py-3 sm:px-3 sm:py-3 rounded-lg text-white">Compare</button>
          <div className="grow">
            <label className="block sm:text-lg mb-2 font-semibold">Company 2</label>
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
        globalLoading ? <div className="h-full py-5 grow flex flex-col gap-2 justify-center items-center">
          <div className="loader"></div>
          <p className="text-xl font-semibold text-gray-800">Getting Data</p>
        </div>
          :
          (
            <div className="sm:grid sm:grid-cols-2 sm:gap-x-10 sm:px-4 h-full">
              {
                fallbackUsed1 &&
                <div className=" flex flex-col justify-between bg-yellow-200 p-4">
                  {<li>Data for <strong>{company1}</strong> was incomplete on Yahoo Finance. Fetched from Gemini AI instead.</li>}
                </div>
              }

              {
                loading1 && <div className="h-full py-5 grow flex flex-col gap-2 justify-center items-center">
                  <div className="loader"></div>
                  <p className="text-xl font-semibold text-gray-800">Getting {ticker1} Data</p>
                </div>
              }
              {results1.length > 0 && (
                <>
                  <p className="sm:hidden text-center font-semibold pt-1">Company 1 Results</p>
                  <TickerSelector
                    results={results1}
                    onSelect={(selected, symbol) => {
                      console.log("Selected Ticker 1:", selected);
                      setCompany1Symbol(symbol);
                      SetTicker1(prev => {
                        if (prev === selected) return "";
                        return selected;
                      }); setResults1([]);
                    }}
                  />
                </>
              )}
              {/* Main comparison cards side-by-side */}
              {(company1Data || noTicker1 || error1) && (
                <div className="flex gap-10 px-1 sm:px-4 py-6 ">
                  <div className="flex w-full flex-col justify-between bg-white rounded-xl p-2 sm:p-4 shadow">
                    {
                      error1 && (
                        <div className="h-full py-5 grow flex flex-col gap-2 justify-center items-center text-red-600">
                          <span className="text-2xl">⚠️</span>
                          <p className="text-xl font-semibold">Failed to load {ticker1} data</p>
                        </div>
                      )
                    }
                    {noTicker1 ? (
                      <NoTickerFound name={noTickerName1} />
                    ) : company1Data ? (
                      <>
                        <p className="sm:hidden text-center font-semibold pb-1">Company 1 Results</p>
                        <CompanyBasic data={company1Data} logo={company1Logo} />
                        <CompanyAdditional data={company1Data} />
                        <ChartPie data={company1Data} />
                      </>
                    ) : null}
                  </div>

                </div>
              )}
              {
                fallbackUsed2 &&
                <div className=" flex flex-col justify-between bg-yellow-200 p-4">
                  {<li>Data for <strong>{company2}</strong> was incomplete on Yahoo Finance. Fetched from Gemini AI instead.</li>}
                </div>
              }
              {
                loading2 && <div className="h-full py-5 grow flex flex-col gap-2 justify-center items-center">
                  <div className="loader"></div>
                  <p className="text-xl font-semibold text-gray-800">Getting {ticker2} Data</p>
                </div>
              }

              {results2.length > 0 && (
                <>
                  <p className=" sm:hidden text-center font-semibold pb-1">Company 2 Results</p>
                  <TickerSelector
                    results={results2}
                    onSelect={(selected, symbol) => {
                      console.log("Selected Ticker 2:", selected);
                      setCompany2Symbol(symbol);
                      SetTicker2(prev => {
                        if (prev === selected) return "";
                        return selected;
                      });
                      setResults2([]);
                    }}
                  />
                </>
              )}
              {/* Main comparison cards side-by-side */}
              {(company2Data || noTicker2 || error2) && (
                <div className="flex gap-10 px-1 sm:px-4 py-6">

                  <div className="flex w-full flex-col justify-between bg-white rounded-xl p-2 sm:p-4 shadow">
                    {
                      error2 && (
                        <div className="h-full py-5 grow flex flex-col gap-2 justify-center items-center text-red-600">
                          <span className="text-2xl">⚠️</span>
                          <p className="text-xl font-semibold">Failed to load {ticker2} data</p>
                        </div>
                      )
                    }
                    {noTicker2 ? (
                      <NoTickerFound name={noTickerName2} />
                    ) : company2Data ? (
                      <>
                        <p className="sm:hidden text-center font-semibold pt-1">Company 2 Results</p>
                        <CompanyBasic data={company2Data} logo={company2Logo} />
                        <CompanyAdditional data={company2Data} />
                        <ChartPie data={company2Data} />
                      </>
                    ) : null}
                  </div>

                </div>
              )}
            </div>
          )}



      {/* Final Comparison Chart below both */}
      {company1Data && company2Data && (
        <div className="sm:px-4 py-6">
          <ComparisonChart company1Data={company1Data} company2Data={company2Data} />
        </div>
      )}

    </div >
  )
}

export default page