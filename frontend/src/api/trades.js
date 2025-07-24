export async function fetchTrades() {
  const res = await fetch("/api/trades");
  if (!res.ok) throw new Error("Failed to fetch trades");
  return res.json();
}
