import { NextRequest, NextResponse } from 'next/server';
import { getAllPurchases, addPurchase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, status, txHash, payerAddress } = body;

    // Log payment event
    console.log('Locus webhook:', { sessionId, status, txHash, payerAddress });

    // In production: verify webhook signature, update purchase record
    if (sessionId && status === 'PAID') {
      console.log('Payment confirmed for session:', sessionId);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
