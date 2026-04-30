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

    console.log('Chat API: Processing message:', message);

    // Parse intent from user message
    let intent;
    try {
      intent = await parseShoppingIntent(message);
      console.log('Parsed intent:', intent);
    } catch (err: any) {
      console.error('Intent parsing failed:', err);
      return NextResponse.json({
        message: 'I had trouble understanding that. Could you rephrase?',
        products: [],
      });
    }

    // Search products based on intent
    const products = searchProducts(intent.query, intent.maxPrice, intent.category, intent.minRating);
    console.log('Found products:', products.length);

    if (products.length === 0) {
      return NextResponse.json({
        message: `I couldn't find any products matching "${intent.query}". Try a different search term.`,
        products: [],
      });
    }

    // Rank products using AI
    let recommendations = [];
    try {
      recommendations = await rankProducts(intent, products);
      console.log('AI recommendations:', recommendations.length);
    } catch (err: any) {
      console.error('AI ranking failed:', err);
      // Fall back to basic search results
      recommendations = products.slice(0, 3).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        rating: p.rating,
        reviewCount: p.reviewCount,
        reason: 'Popular choice based on your search',
      }));
    }

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
