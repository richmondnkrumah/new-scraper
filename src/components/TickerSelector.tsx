"use client";

import { useState } from "react";
import { getTickerOptions } from "@/lib/utils"; // Server action
import type { TickerOption } from "@/lib/utils";

type Props = {
    onSelect: (ticker: string,symbol: string) => void;
    results: any[]
};

export default function TickerSelector({ onSelect, results }: Props) {
    console.log(results, "TickerSelector Results");
    return (
        <div className="w-full">
            <ul className="mt-4 space-y-2">
                {results.map((item) => Object.keys(item).length !== 0 && (
                    <li
                        key={`${item.symbol} ${item.name}`}
                        className="cursor-pointer border border-gray-400 p-2 rounded-lg hover:bg-gray-100"
                    >
                        <button
                            type="button"
                            onClick={() => onSelect(item.symbol, item.name)}
                            className="w-full text-left"
                        >

                            <div>
                                <div className="flex justify-between"><strong>{item.name}</strong> <p>{item.quoteType}</p></div>
                                <div className="flex justify-between"><p>{item.symbol}</p><p>{item.exchange}</p></div>
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
