import React from "react";
import PortfolioValueCard from "../components/PortfolioValueCard";
import OverviewStatsCard from "../components/OverviewStatsCard";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <PortfolioValueCard />
      <OverviewStatsCard />
      {/* Later add charts or more widgets here */}
    </div>
  );
}
