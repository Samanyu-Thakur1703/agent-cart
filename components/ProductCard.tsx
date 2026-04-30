interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  reason?: string;
  image?: string;
}

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
  loading?: boolean;
}

export default function ProductCard({ product, onBuy, loading }: ProductCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <img
          src={product.image || 'https://picsum.photos/200'}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-md"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{product.name}</h3>
          <p className="text-2xl font-bold text-green-600">${product.price.toFixed(2)}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-yellow-500">★ {product.rating}</span>
            <span className="text-gray-500 text-sm">({product.reviewCount || product.reviewCount} reviews)</span>
          </div>
          {product.reason && (
            <p className="text-sm text-gray-600 mt-2 italic">"{product.reason}"</p>
          )}
        </div>
      </div>
      <button
        onClick={() => onBuy(product)}
        disabled={loading}
        className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {loading ? 'Processing...' : 'Buy with Locus'}
      </button>
    </div>
  );
}
