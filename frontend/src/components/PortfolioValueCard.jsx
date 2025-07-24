import React, { useEffect, useState } from "react";
import { fetchPortfolioValue } from "../api/portfolio";

export default function PortfolioValueCard() {
  const [valueData, setValueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPortfolioValue()
      .then(data => {
        if (data.success) setValueData(data.portfolioValue);
        else setError("Failed loading portfolio value");
      })
      .catch(() => setError("Error fetching portfolio value"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4 border rounded">Loading portfolio value...</div>;
  if (error) return <div className="p-4 border rounded text-red-600">{error}</div>;

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-2">Portfolio Value</h2>
      <ul>
        <li><strong>USD:</strong> ${valueData.valueInUSD.toFixed(2)}</li>
        <li><strong>INR:</strong> ₹{valueData.valueInINR.toFixed(2)}</li>
        <li><strong>SGD:</strong> S${valueData.valueInSGD.toFixed(2)}</li>
      </ul>
      <small className="text-gray-500">Currency rates as of: {new Date(valueData.currencyRateDate).toLocaleDateString()}</small>
    </div>
  );
}
