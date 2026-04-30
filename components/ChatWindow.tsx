'use client';

import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import ProductCard from './ProductCard';
import LoadingDots from './LoadingDots';
import SpendingPolicy from './SpendingPolicy';
import PurchaseHistory from './PurchaseHistory';
import { LocusCheckout } from '@withlocus/checkout-react';

interface Message {
  role: 'user' | 'agent';
  content: string;
  products?: any[];
  checkoutSession?: { sessionId: string; productName: string };
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'agent',
      content: "Hello! I'm your AI shopping assistant. Describe what you'd like to buy, and I'll find the best options for you.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkoutSession, setCheckoutSession] = useState<{ sessionId: string; productName: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          content: data.message || 'Here are some options:',
          products: data.products || [],
        },
      ]);
    } catch (error: any) {
      setMessages((prev) => [...prev, { role: 'agent', content: `Error: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (product: any) => {
    try {
      const res = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, reasoning: product.reason }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Checkout failed');
        return;
      }

      // Set checkout session to show LocusCheckout component
      setCheckoutSession({
        sessionId: data.sessionId,
        productName: product.name,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          content: `Checkout session created for ${product.name}. Complete payment below:`,
          checkoutSession: { sessionId: data.sessionId, productName: product.name },
        },
      ]);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handlePaymentSuccess = (data: any) => {
    console.log('Payment success:', data);
    setCheckoutSession(null);
    setMessages((prev) => [
      ...prev,
      {
        role: 'agent',
        content: `Payment successful! Transaction hash: ${data.txHash || 'N/A'}. Receipt saved.`,
      },
    ]);
  };

  const handlePaymentCancel = () => {
    setCheckoutSession(null);
    setMessages((prev) => [
      ...prev,
      {
        role: 'agent',
        content: 'Payment cancelled. Let me know if you\'d like to try again.',
      },
    ]);
  };

  return (
    <div className="max-w-2xl mx-auto h-screen flex flex-col p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">🛒 AgentCart</h1>
        <SpendingPolicy />
      </div>

      <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i}>
            <MessageBubble role={msg.role} content={msg.content} />
            {msg.products && msg.products.length > 0 && (
              <div className="ml-4 space-y-3 mb-4">
                {msg.products.map((p: any) => (
                  <ProductCard key={p.id} product={p} onBuy={handleBuy} />
                ))}
              </div>
            )}
            {msg.checkoutSession && (
              <div className="ml-4 mb-4 border rounded-lg p-4">
                <LocusCheckout
                  sessionId={msg.checkoutSession.sessionId}
                  mode="embedded"
                  onSuccess={handlePaymentSuccess}
                  onCancel={handlePaymentCancel}
                  onError={(error) => {
                    console.error('Payment error:', error);
                    alert(`Payment failed: ${error.message}`);
                  }}
                />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-4">
            <LoadingDots />
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {checkoutSession && (
        <div className="mt-4 border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Complete Payment: {checkoutSession.productName}</h3>
          <LocusCheckout
            sessionId={checkoutSession.sessionId}
            mode="embedded"
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
            onError={(error) => {
              console.error('Payment error:', error);
              alert(`Payment failed: ${error.message}`);
            }}
          />
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder='Try: "Buy me a USB-C hub under $30"'
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          Send
        </button>
      </div>

      <PurchaseHistory />
    </div>
  );
}
