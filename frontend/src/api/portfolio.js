// src/api/portfolio.js

export async function fetchPortfolioValue() {
  const res = await fetch("/api/portfolio/value");
  if (!res.ok) throw new Error("Failed to fetch portfolio value");
  return res.json();
}

export async function fetchPortfolioOverview() {
  const res = await fetch('/api/portfolio/overview');
  Error("Failed to fetch portfolio overview");
  return res.json();
}
