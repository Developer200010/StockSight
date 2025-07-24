import React from "react";

export default function TradesTable({ trades }) {
  if (!trades || trades.length === 0) {
    return <div className="p-4 bg-white rounded shadow text-gray-500 text-center">No trades available.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Symbol</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Trade Price</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Proceeds</th>
            <th className="px-4 py-2">Fees</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t, idx) => (
            <tr key={idx} className="border-b last:border-none hover:bg-gray-50">
              <td className="px-4 py-2">{t.symbol}</td>
              <td className="px-4 py-2">{new Date(t.date).toLocaleDateString()}</td>
              <td className="px-4 py-2">{t.quantity}</td>
              <td className="px-4 py-2">{t.tradePrice?.toFixed(2) ?? '-'}</td>
              <td className="px-4 py-2">{t.type || t.code || 'N/A'}</td>
              <td className="px-4 py-2">{t.proceeds?.toFixed(2) ?? '-'}</td>
              <td className="px-4 py-2">{t.commFee?.toFixed(2) ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
