import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'running',
    hasApiKey: !!process.env.LOCUS_API_KEY,
    apiBase: process.env.LOCUS_API_BASE_URL,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'productId required' }, { status: 400 });
    }

    return NextResponse.json({
      sessionId: 'sess_' + Date.now(),
      product: { id: productId, name: 'Test Product', price: 29.99 },
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
