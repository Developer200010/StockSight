export async function fetchCurrencyRates() {
  const res = await fetch('/api/currency-rates');
  if (!res.ok) throw new Error('Failed to fetch currency rates');
  return res.json();
}
