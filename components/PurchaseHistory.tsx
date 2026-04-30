'use client';

import { useEffect, useState } from 'react';

interface Purchase {
  id: number;
  product_name: string;
  price: number;
  reasoning?: string;
  receipt_id?: string;
  session_id?: string;
  timestamp: string;
}

export default function PurchaseHistory() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch('/api/purchases')
      .then((r) => r.json())
      .then((data) => setPurchases(data.purchases || []));
  }, []);

  if (purchases.length === 0) return null;

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-blue-600 hover:underline"
      >
        {open ? 'Hide' : 'Show'} Purchase History ({purchases.length})
      </button>
      {open && (
        <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
          {purchases.map((p) => (
            <div key={p.id} className="bg-gray-50 p-3 rounded text-sm">
              <div className="flex justify-between">
                <span className="font-medium">{p.product_name}</span>
                <span className="text-green-600 font-bold">${p.price.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(p.timestamp).toLocaleString()}
              </div>
              {p.reasoning && (
                <p className="text-xs text-gray-600 mt-1 italic">"{p.reasoning}"</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
