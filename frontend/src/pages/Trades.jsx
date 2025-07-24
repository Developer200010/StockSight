import React, { useEffect, useState } from "react";
import TradesTable from "../components/TradesTable";
import { fetchTrades } from "../api/trades";

export default function Trades() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrades()
      .then((data) => {
        if (data.success) setTrades(data.trades);
        else setError("Failed to load trades");
      })
      .catch(() => setError("Error fetching trades"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4 text-center">Loading trades...</div>;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Trade History</h1>
      <TradesTable trades={trades} />
    </div>
  );
}
