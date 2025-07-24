import React from 'react';

export default function SplitsTable({ splits }) {
  if (!splits || splits.length === 0) {
    return (
      <div className="p-4 bg-white rounded shadow text-center text-gray-500">
        No corporate splits available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left border-b">Symbol</th>
            <th className="px-4 py-2 text-left border-b">Split Date</th>
            <th className="px-4 py-2 text-left border-b">Split Ratio</th>
            <th className="px-4 py-2 text-left border-b">Description</th>
          </tr>
        </thead>
        <tbody>
          {splits.map((split) => (
            <tr key={split._id} className="border-b last:border-none hover:bg-gray-50">
              <td className="px-4 py-2">{split.symbol}</td>
              <td className="px-4 py-2">{new Date(split.splitDate).toLocaleDateString()}</td>
              <td className="px-4 py-2">{split.splitRatio}</td>
              <td className="px-4 py-2">{split.description || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
