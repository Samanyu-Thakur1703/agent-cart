import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/locus';
import { checkSpendingLimit, addToDaySpend, addPurchase } from '@/lib/db';
import { getProductById } from '@/lib/products';

export async function POST(request: NextRequest) {
  try {
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
    const session = await createCheckoutSession(product);

    // Record purchase intent in DB
    addPurchase({
      product_name: product.name,
      price: product.price,
      reasoning: reasoning || 'User approved purchase',
      session_id: session.id,
    });

    // Update spending tracker
    addToDaySpend(product.price);

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
