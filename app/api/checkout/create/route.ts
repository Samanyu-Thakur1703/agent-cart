import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'Checkout API is running',
    hasApiKey: !!process.env.LOCUS_API_KEY,
    apiBase: process.env.LOCUS_API_BASE_URL || 'not set',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('Checkout POST called');
    
    // Read body as text
    const bodyText = await request.text();
    console.log('Body text:', bodyText);
    
    // Parse JSON
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (jsonError: any) {
      console.error('JSON parse error:', jsonError);
      return NextResponse.json({ error: 'Invalid JSON: ' + bodyText.substring(0, 50) }, { status: 400 });
    }

    const { productId } = body;
    console.log('ProductId:', productId);
    
    if (!productId) {
      return NextResponse.json({ error: 'ProductId required' }, { status: 400 });
    }

    // Return mock response for now
    return NextResponse.json({
      sessionId: 'mock_' + Date.now(),
      product: { id: productId, name: 'Test Product', price: 29.99 },
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
