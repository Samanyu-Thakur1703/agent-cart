import products from '@/data/products.json';

export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  category: string;
  image: string;
  description: string;
}

export function searchProducts(query: string, maxPrice?: number, category?: string, minRating?: number): Product[] {
  let results = products as Product[];

  // Filter by search query
  const lowerQuery = query.toLowerCase();
  results = results.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
  );

  // Filter by max price
  if (maxPrice) {
    results = results.filter((p) => p.price <= maxPrice);
  }

  // Filter by category
  if (category) {
    results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  // Filter by minimum rating
  if (minRating) {
    results = results.filter((p) => p.rating >= minRating);
  }

  return results;
}

export function getProductById(id: string): Product | undefined {
  return (products as Product[]).find((p) => p.id === id);
}
