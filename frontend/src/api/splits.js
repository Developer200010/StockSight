// src/api/splits.js
export async function fetchSplits() {
  const response = await fetch('/api/splits');
  if (!response.ok) throw new Error('Failed to fetch splits');
  return response.json();
}
