import React from "react";

export default function HoldingsTable({ holdings }) {
    if (!holdings || holdings.length === 0) {
        return (
            <div className="p-4 bg-white rounded shadow text-center text-gray-500">
                No holdings available to display.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full border-collapse">
                <thead className="bg-gray-100">
                    <tr>
                        {["Symbol", "Quantity", "Avg Price", "Market Price", "Value (INR)", "Value (SGD)", "Unrealized Gain/Loss"].map((header) => (
                            <th key={header} className="px-4 py-2 text-left text-gray-700 font-semibold border-b">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {holdings.map((h) => (
                        <tr key={h.symbol} className="border-b last:border-none hover:bg-gray-50">
                            <td className="px-4 py-2">{h.symbol}</td>
                            <td className="px-4 py-2">{h.quantity}</td>
                            <td className="px-4 py-2">{h.avgPrice !== null && h.avgPrice !== undefined ? h.avgPrice.toFixed(2) : '-'}</td>
                            <td className="px-4 py-2">{h.marketPrice !== null && h.avgPrice !== undefined ? h.avgPrice.toFixed(2) : '-'}</td>
                            <td className="px-4 py-2">₹{h.valueINR !== null && h.valueINR !== undefined ? h.valueINR.toLocaleString() : "-"}</td>
                            <td className="px-4 py-2">S$₹{h.valueSGD !== null && h.valueINR !== undefined ? h.valueINR.toLocaleString() : "-"}</td>
                            <td className={`px-4 py-2 ${h.gainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {(h.gainLoss !== null && h.gainLoss !== undefined && h.gainLoss >= 0) ? "+" : ""}
                                {h.gainLoss !== null && h.gainLoss !== undefined ? h.gainLoss.toFixed(2) : "-"}
                                (
                                {h.gainLossPct !== null && h.gainLossPct !== undefined ? h.gainLossPct.toFixed(2) : "-"}%)
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
