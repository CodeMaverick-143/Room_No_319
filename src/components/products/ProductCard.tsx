import React from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Product } from '../../types';
import Button from '../ui/Button';
import { useCartStore } from '../../store/cartStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, items, updateQuantity, removeItem } = useCartStore();
  
  const cartItem = items.find(item => item.id === product.id);
  const isInCart = !!cartItem;
  
  const handleAddToCart = () => {
    addItem(product, 1);
  };
  
  const incrementQuantity = () => {
    if (cartItem) {
      updateQuantity(product.id, cartItem.cartQuantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (cartItem && cartItem.cartQuantity > 1) {
      updateQuantity(product.id, cartItem.cartQuantity - 1);
    } else if (cartItem) {
      removeItem(product.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in">
      <div className="h-48 bg-gray-200 overflow-hidden">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
            <span className="text-2xl font-semibold text-gray-400">{product.name.charAt(0)}</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
          <span className="font-bold text-primary-600">₹{product.price}</span>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <span className={`text-sm ${product.quantity > 0 ? 'text-success-700' : 'text-error-500'}`}>
            {product.quantity > 0 ? `In Stock: ${product.quantity}` : 'Out of Stock'}
          </span>
          <span className="text-xs text-gray-500 px-2 py-1 rounded-full bg-gray-100">
            {product.category}
          </span>
        </div>
        
        <div className="mt-4">
          {!isInCart ? (
            <Button 
              fullWidth 
              leftIcon={<ShoppingCart className="w-4 h-4" />}
              onClick={handleAddToCart}
              disabled={product.quantity <= 0}
            >
              Add to Cart
            </Button>
          ) : (
            <div className="flex items-center justify-between">
              <button
                onClick={decrementQuantity}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-md"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <span className="font-medium text-gray-800">
                {cartItem?.cartQuantity}
              </span>
              
              <button
                onClick={incrementQuantity}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-md"
                disabled={cartItem?.cartQuantity >= product.quantity}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;