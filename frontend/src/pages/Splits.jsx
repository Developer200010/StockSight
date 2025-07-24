import React, { useEffect, useState } from 'react';
import SplitsTable from '../components/SplitsTable';
import { fetchSplits } from '../api/splits';

export default function Splits() {
  const [splits, setSplits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSplits()
      .then(data => {
        if (data.success) {
          setSplits(data.splits);
          setError(null);
        } else {
          setError('Failed to load splits');
        }
      })
      .catch(() => setError('Error fetching splits'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4 text-center">Loading splits...</p>;
  if (error) return <p className="p-4 text-center text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Corporate Splits & Actions</h1>
      <SplitsTable splits={splits} />
    </div>
  );
}
