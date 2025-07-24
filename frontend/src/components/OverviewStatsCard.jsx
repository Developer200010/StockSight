import React, { useEffect, useState } from "react";
import { fetchPortfolioOverview } from "../api/portfolio";

export default function OverviewStatsCard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPortfolioOverview()
      .then(data => {
        if (data.success) setStats(data.stats);
        else setError("Failed loading overview");
      })
      .catch(() => setError("Error fetching overview"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4 border rounded">Loading overview...</div>;
  if (error) return <div className="p-4 border rounded text-red-600">{error}</div>;

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-sm mx-auto mt-4">
      <h2 className="text-xl font-semibold mb-2">Portfolio Overview</h2>
      <ul>
        <li><strong>Total Trades:</strong> {stats.totalTrades}</li>
        <li><strong>Active Holdings:</strong> {stats.activeHoldingsCount}</li>
        <li><strong>Last Update:</strong> {new Date(stats.lastUpdate).toLocaleDateString()}</li>
      </ul>
    </div>
  );
}
