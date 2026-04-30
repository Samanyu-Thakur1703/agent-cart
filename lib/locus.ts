export interface CheckoutSession {
  id: string;
  amount: number;
  description: string;
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED';
  receiptId?: string;
  txHash?: string;
  payerAddress?: string;
  paidAt?: string;
}

export async function createCheckoutSession(
  product: any,
  userWalletAddress?: string
): Promise<CheckoutSession> {
  const amount = Math.round(product.price * 1000000); // USDC has 6 decimals

  const response = await fetch(`${process.env.LOCUS_API_BASE_URL || 'https://beta-api.paywithlocus.com/api'}/checkout/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.LOCUS_API_KEY || ''}`,
    },
    body: JSON.stringify({
      amount,
      description: product.name,
      receiptConfig: {
        lineItems: [
          {
            name: product.name,
            amount,
            description: product.description,
          },
        ],
        companyInfo: {
          name: 'AgentCart',
          url: process.env.NEXT_PUBLIC_APP_URL || 'https://agent-cart.vercel.app',
        },
      },
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/locus`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create checkout session: ${response.statusText}`);
  }

  return response.json();
}

export async function getCheckoutSession(sessionId: string): Promise<CheckoutSession> {
  const response = await fetch(
    `${process.env.LOCUS_API_BASE_URL || 'https://beta-api.paywithlocus.com/api'}/checkout/sessions/${sessionId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.LOCUS_API_KEY || ''}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get checkout session: ${response.statusText}`);
  }

  return response.json();
}
