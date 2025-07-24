import React, { useState, useEffect } from "react";
import HoldingsTable from "../components/HoldingsTable";
import { fetchHoldings } from "../api/holdings";

export default function Holdings() {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHoldings()
      .then((data) => {
        if (data.success) setHoldings(data.holdings);
        else setError("Failed to load holdings");
      })
      .catch(() => setError("Error fetching holdings"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4 text-center">Loading holdings...</p>;

  if (error) return <p className="p-4 text-center text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Holdings</h1>
      <HoldingsTable holdings={holdings} />
    </div>
  );
}
