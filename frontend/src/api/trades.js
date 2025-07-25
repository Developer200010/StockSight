export async function fetchTrades(page = 1) {
  const res = await fetch(`/api/trades?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch trades");
  return res.json();
}
