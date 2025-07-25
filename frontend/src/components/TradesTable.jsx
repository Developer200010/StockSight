import React, { useEffect, useState } from "react";
import { fetchTrades } from "../api/trades"; // adjust import path if needed

export default function TradesPage() {
  const [trades, setTrades] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTrades(currentPage) {
    setLoading(true);
    setError("");
    try {
      const data = await fetchTrades(currentPage);
      if (data.success) {
        setTrades(data.trades);
        setTotalPages(data.pagination.totalPages);
        setPage(data.pagination.page);
      } else {
        setError("Failed to load trades.");
      }
    } catch (e) {
      setError("Error fetching trades.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTrades(page);
  }, [page]);

  return (
    <div>
      {loading && <p className="p-4 text-center text-gray-600">Loading trades...</p>}
      {error && <p className="p-4 text-center text-red-600">{error}</p>}

      {!loading && !error && (
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
              {trades.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-4 text-gray-500">
                    No trades available.
                  </td>
                </tr>
              )}
              {trades.map((t, idx) => (
                <tr key={idx} className="border-b last:border-none hover:bg-gray-50">
                  <td className="px-4 py-2">{t.symbol}</td>
                  <td className="px-4 py-2">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{t.quantity}</td>
                  <td className="px-4 py-2">{t.tradePrice?.toFixed(2) ?? "-"}</td>
                  <td className="px-4 py-2">{t.type || t.code || "N/A"}</td>
                  <td className="px-4 py-2">{t.proceeds?.toFixed(2) ?? "-"}</td>
                  <td className="px-4 py-2">{t.commFee?.toFixed(2) ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded ${
                  page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Previous
              </button>
              <span className="flex items-center select-none">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded ${
                  page === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}