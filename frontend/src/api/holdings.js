export async function fetchHoldings() {
  const response = await fetch("/api/holdings");
  if (!response.ok) throw new Error("Failed to fetch holdings");
  return response.json();
}
