import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';

const CartPage: React.FC = () => {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    getTotal, 
    getItemCount 
  } = useCartStore();

  const handleIncreaseQuantity = (productId: string, currentQty: number, maxQty: number) => {
    if (currentQty < maxQty) {
      updateQuantity(productId, currentQty + 1);
    }
  };

  const handleDecreaseQuantity = (productId: string, currentQty: number) => {
    if (currentQty > 1) {
      updateQuantity(productId, currentQty - 1);
    } else {
      removeItem(productId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>
          
          {items.length === 0 ? (
            <div className="py-12 bg-white rounded-lg shadow text-center">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
              <p className="mt-1 text-sm text-gray-500">Add some items to your cart to proceed.</p>
              <div className="mt-6">
                <Link to="/products">
                  <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <ul role="list" className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <li key={item.id} className="p-4 flex animate-fade-in">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="h-full w-full object-cover object-center"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500">
                              {item.name.charAt(0)}
                            </div>
                          )}
                        </div>

                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>{item.name}</h3>
                              <p className="ml-4">₹{item.price}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.category}
                            </p>
                          </div>
                          
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <div className="flex items-center border rounded-md">
                              <button
                                onClick={() => handleDecreaseQuantity(item.id, item.cartQuantity)}
                                className="p-2 text-gray-600 hover:text-primary-500"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 font-medium">{item.cartQuantity}</span>
                              <button
                                onClick={() => handleIncreaseQuantity(item.id, item.cartQuantity, item.quantity)}
                                className={`p-2 ${
                                  item.cartQuantity < item.quantity
                                    ? 'text-gray-600 hover:text-primary-500'
                                    : 'text-gray-300 cursor-not-allowed'
                                }`}
                                disabled={item.cartQuantity >= item.quantity}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-error-500 hover:text-error-700"
                            >
                              <Trash className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-base text-gray-900">
                      <p>Subtotal ({getItemCount()} items)</p>
                      <p>₹{getTotal().toFixed(2)}</p>
                    </div>
                    
                    <div className="flex justify-between text-base text-gray-900">
                      <p>Delivery</p>
                      <p>Free</p>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 flex justify-between text-base font-medium text-gray-900">
                      <p>Total</p>
                      <p>₹{getTotal().toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Link to="/checkout">
                      <Button fullWidth>
                        Checkout
                      </Button>
                    </Link>
                    
                    <div className="mt-4">
                      <Link
                        to="/products"
                        className="flex items-center justify-center text-sm text-primary-600 hover:text-primary-700"
                      >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CartPage;