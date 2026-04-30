import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || 'demo',
  defaultHeaders: {
    'HTTP-Referer': 'https://agent-cart.vercel.app',
    'X-Title': 'AgentCart',
  },
});

export interface ProductQuery {
  query: string;
  maxPrice?: number;
  category?: string;
  minRating?: number;
}

export interface ProductRecommendation {
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  reason: string;
  image?: string;
  id: string;
}

export async function parseShoppingIntent(userMessage: string): Promise<ProductQuery> {
  const completion = await openai.chat.completions.create({
    model: 'openrouter/free',
    messages: [
      {
        role: 'system',
        content: `Parse shopping requests into structured data. Return JSON with: query (string), maxPrice (number or null), category (string or null), minRating (number or null).`,
      },
      { role: 'user', content: userMessage },
    ],
    response_format: { type: 'json_object' },
  });

  const result = JSON.parse(completion.choices[0].message.content || '{}');
  return {
    query: result.query || userMessage,
    maxPrice: result.maxPrice || undefined,
    category: result.category || undefined,
    minRating: result.minRating || undefined,
  };
}

export async function rankProducts(
  query: ProductQuery,
  products: any[]
): Promise<ProductRecommendation[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'openrouter/free',
      messages: [
        {
          role: 'system',
          content: `You are a shopping assistant. Given a query and product list, return the top 3 products with reasoning. Return JSON with a "recommendations" array containing objects with fields: id, name, price, rating, reviewCount, reason.`,
        },
        {
          role: 'user',
          content: `Query: ${JSON.stringify(query)}\n\nProducts: ${JSON.stringify(products.slice(0, 20))}\n\nReturn top 3 recommendations as JSON with "recommendations" array.`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    const recs = result.recommendations || result.products || [];
    
    // Ensure each recommendation has required fields
    return recs.map((r: any) => ({
      id: r.id || products[0]?.id || '1',
      name: r.name || r.product_name || 'Product',
      price: r.price || 0,
      rating: r.rating || 0,
      reviewCount: r.reviewCount || 0,
      reason: r.reason || r.reasoning || 'Good match for your request',
    }));
  } catch (error) {
    console.error('AI ranking failed:', error);
    // Return top 3 products as fallback
    return products.slice(0, 3).map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      rating: p.rating,
      reviewCount: p.reviewCount,
      reason: 'Popular choice based on your search',
    }));
  }
}
