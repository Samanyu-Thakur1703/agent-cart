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
  const completion = await openai.chat.completions.create({
    model: 'openrouter/free',
    messages: [
      {
        role: 'system',
        content: `You are a shopping assistant. Given a query and product list, return the top 3 products with reasoning. Return JSON array with objects: name, price, rating, reviewCount, reason, id.`,
      },
      {
        role: 'user',
        content: `Query: ${JSON.stringify(query)}\n\nProducts: ${JSON.stringify(products.slice(0, 20))}\n\nReturn top 3 recommendations.`,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const result = JSON.parse(completion.choices[0].message.content || '{}');
  return result.recommendations || result.products || [];
}
