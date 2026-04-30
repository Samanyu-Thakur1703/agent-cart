import { NextRequest, NextResponse } from 'next/server';
import { parseShoppingIntent, rankProducts } from '@/lib/openrouter';
import { searchProducts } from '@/lib/products';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Parse intent from user message
    const intent = await parseShoppingIntent(message);

    // Search products based on intent
    const products = searchProducts(intent.query, intent.maxPrice, intent.category, intent.minRating);

    if (products.length === 0) {
      return NextResponse.json({
        message: `I couldn't find any products matching "${intent.query}". Try a different search term.`,
        products: [],
      });
    }

    // Rank products using AI
    const recommendations = await rankProducts(intent, products);

    return NextResponse.json({
      message: `I found ${products.length} products. Here are my top recommendations:`,
      products: recommendations.length > 0 ? recommendations : products.slice(0, 3),
      query: intent,
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
