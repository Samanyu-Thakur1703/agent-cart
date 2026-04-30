import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/locus';
import { checkSpendingLimit, addToDaySpend, addPurchase } from '@/lib/db';
import { getProductById } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check environment variables
    if (!process.env.LOCUS_API_KEY) {
      console.error('Missing LOCUS_API_KEY');
      return NextResponse.json(
        { error: 'Server configuration error: Missing API credentials' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { productId, reasoning } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Get product details
    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check spending limits
    const limitCheck = checkSpendingLimit(product.price);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: limitCheck.reason },
        { status: 403 }
      );
    }

    // Create Locus checkout session
    let session;
    try {
      session = await createCheckoutSession(product);
    } catch (err: any) {
      console.error('Locus API error:', err);
      return NextResponse.json(
        { error: `Payment provider error: ${err.message}` },
        { status: 502 }
      );
    }

    // Record purchase intent in DB
    try {
      addPurchase({
        product_name: product.name,
        price: product.price,
        reasoning: reasoning || 'User approved purchase',
        session_id: session.id,
      });

      // Update spending tracker
      addToDaySpend(product.price);
    } catch (dbErr: any) {
      console.error('DB error:', dbErr);
      // Continue anyway - the session was created
    }

    return NextResponse.json({
      sessionId: session.id,
      session,
      product,
    });
  } catch (error: any) {
    console.error('Checkout create error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
