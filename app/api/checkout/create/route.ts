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
    console.log('Checkout API called');
    
    // Check environment variables
    const apiKey = process.env.LOCUS_API_KEY;
    const apiBase = process.env.LOCUS_API_BASE_URL || 'https://beta-api.paywithlocus.com/api';
    
    if (!apiKey) {
      console.error('Missing LOCUS_API_KEY');
      return NextResponse.json(
        { error: 'Server configuration error: Missing API credentials' },
        { status: 500 }
      );
    }

    // Safely parse JSON body
    let body;
    try {
      body = await request.json();
    } catch (jsonError: any) {
      console.error('JSON parse error:', jsonError);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { productId, reasoning } = body;
    console.log('Request body:', body);

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Mock product lookup
    const mockProducts: any = {
      '1': { id: '1', name: 'Anker USB-C Hub 7-in-1', price: 28.99 },
      '2': { id: '2', name: 'Baseus 8-Port USB-C Dock', price: 35.99 },
      '3': { id: '3', name: 'Satechi Aluminum USB-C Hub', price: 29.99 },
    };
    
    const product = mockProducts[productId] || mockProducts['1'];
    console.log('Product found:', product);

    // Create Locus checkout session
    console.log('Creating Locus session...');
    
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const sessionRes = await fetch(`${apiBase}/checkout/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          amount: Math.round(product.price * 1000000), // USDC 6 decimals
          description: product.name,
          receiptConfig: {
            lineItems: [{ name: product.name, amount: Math.round(product.price * 1000000) }],
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      console.log('Locus API response status:', sessionRes.status);
      
      if (!sessionRes.ok) {
        const errorText = await sessionRes.text();
        console.error('Locus API error:', errorText);
        return NextResponse.json(
          { error: `Payment provider error: ${sessionRes.status}` },
          { status: 502 }
        );
      }

      const session = await sessionRes.json();
      console.log('Session created:', session.id);

      return NextResponse.json({
        sessionId: session.id,
        session,
        product,
      });
    } catch (fetchError: any) {
      console.error('Fetch error:', fetchError);
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Payment provider timeout' },
          { status: 504 }
        );
      }
      throw fetchError;
    }
  } catch (error: any) {
    console.error('Checkout create error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
