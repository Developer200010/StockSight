import React, { useState, useEffect } from "react";
import CurrencyRatesCard from "../components/CurrencyRatesCard";
import { fetchCurrencyRates } from "../api/currencyRates";

export default function CurrencyRates() {
  const [rates, setRates] = useState(null);
  const [rateDate, setRateDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCurrencyRates()
      .then((data) => {
        if (data.success && data.rates) {
          setRates(data.rates);
          setRateDate(data.date);
        } else {
          setError("No rates found");
        }
      })
      .catch(() => setError("Error fetching currency rates"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4 text-center">Loading currency rates...</div>;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Currency Rates</h1>
      <CurrencyRatesCard rates={rates} rateDate={rateDate} />
    </div>
  );
}
