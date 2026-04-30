'use client';

import { useState, useEffect } from 'react';

export default function SpendingPolicy() {
  const [maxTx, setMaxTx] = useState(100);
  const [maxDay, setMaxDay] = useState(500);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('spending-policy');
    if (saved) {
      const policy = JSON.parse(saved);
      setMaxTx(policy.maxPerTransaction || 100);
      setMaxDay(policy.maxPerDay || 500);
      setShowForm(false);
    }
  }, []);

  const save = () => {
    const policy = { maxPerTransaction: maxTx, maxPerDay: maxDay };
    localStorage.setItem('spending-policy', JSON.stringify(policy));
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>💰 Limit: ${maxTx}/tx · ${maxDay}/day</span>
        <button onClick={() => setShowForm(true)} className="text-blue-600 hover:underline text-xs">
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 p-4 rounded-lg space-y-3">
      <h3 className="font-semibold text-sm">Set Spending Limits</h3>
      <div className="flex gap-3">
        <div>
          <label className="text-xs text-gray-600">Max per transaction</label>
          <input
            type="number"
            value={maxTx}
            onChange={(e) => setMaxTx(Number(e.target.value))}
            className="block w-full border rounded px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">Max per day</label>
          <input
            type="number"
            value={maxDay}
            onChange={(e) => setMaxDay(Number(e.target.value))}
            className="block w-full border rounded px-2 py-1 text-sm"
          />
        </div>
      </div>
      <button
        onClick={save}
        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
      >
        Save Limits
      </button>
    </div>
  );
}
