'use client';

import { useState } from 'react';
import { LocusCheckout } from '@withlocus/checkout-react';

interface LocusCheckoutButtonProps {
  sessionId: string;
  productName: string;
  onSuccess: (data: any) => void;
  onCancel: () => void;
}

export default function LocusCheckoutButton({ sessionId, productName, onSuccess, onCancel }: LocusCheckoutButtonProps) {
  const [showCheckout, setShowCheckout] = useState(false);

  if (!showCheckout) {
    return (
      <button
        onClick={() => setShowCheckout(true)}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
      >
        Pay with Locus
      </button>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <LocusCheckout
        sessionId={sessionId}
        mode="embedded"
        onSuccess={(data) => {
          console.log('Payment success:', data);
          onSuccess(data);
        }}
        onCancel={() => {
          console.log('Payment cancelled');
          onCancel();
          setShowCheckout(false);
        }}
        onError={(error) => {
          console.error('Payment error:', error);
          alert(`Payment failed: ${error.message}`);
          setShowCheckout(false);
        }}
      />
    </div>
  );
}
