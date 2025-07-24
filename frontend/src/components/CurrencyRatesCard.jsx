import React from "react";

export default function CurrencyRatesCard({ rates, rateDate }) {
  if (!rates) {
    return (
      <div className="p-4 bg-white rounded shadow text-center text-gray-500">
        No rates available.
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-2">Currency Rates</h2>
      <ul className="mb-2">
        <li>
          <span className="font-medium">USD to INR:</span> {rates.INR}
        </li>
        <li>
          <span className="font-medium">USD to SGD:</span> {rates.SGD}
        </li>
      </ul>
      <small className="text-gray-500">
        Rates as of: {new Date(rateDate).toLocaleDateString()}
      </small>
    </div>
  );
}
