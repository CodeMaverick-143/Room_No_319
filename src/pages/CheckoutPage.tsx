import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { supabase } from '../supabase/client';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [paymentStep, setPaymentStep] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  // Redirect to cart if cart is empty
  if (items.length === 0 && !orderCompleted) {
    navigate('/cart');
    return null;
  }

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setError('');
    setPaymentStep(true);
  };

  const handleCompleteOrder = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // Create order items array
      const orderItems = items.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.cartQuantity,
        price: item.price
      }));
      
      // Create order in Supabase
      const { data, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_email: email,
          user_name: name,
          user_phone: phone,
          items: orderItems,
          total: getTotal(),
          status: 'pending'
        }])
        .select();
      
      if (orderError) throw orderError;
      
      // Update product quantities (reduce stock)
      for (const item of items) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            quantity: item.quantity - item.cartQuantity 
          })
          .eq('id', item.id);
        
        if (updateError) throw updateError;
      }
      
      // Clear cart and show success
      clearCart();
      setOrderCompleted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred while placing your order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderCompleted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-md w-full mx-auto px-4 py-16">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-success-100">
                <CheckCircle className="h-10 w-10 text-success-500" />
              </div>
              
              <h2 className="mt-6 text-2xl font-bold text-gray-900">Order Confirmed!</h2>
              
              <p className="mt-2 text-gray-600">
                Thank you for your order. We will process it shortly.
              </p>
              
              <div className="mt-8">
                <Link to="/">
                  <Button fullWidth>
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-1">Complete your order</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Form & Payment */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {!paymentStep ? (
                  /* Contact Information */
                  <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
                    
                    {error && (
                      <div className="mb-4 p-3 bg-error-50 text-error-700 rounded-md text-sm">
                        {error}
                      </div>
                    )}
                    
                    <form onSubmit={handleContinueToPayment}>
                      <div className="space-y-4">
                        <Input
                          label="Full Name *"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          fullWidth
                          required
                        />
                        
                        <Input
                          label="Email Address *"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          fullWidth
                          required
                        />
                        
                        <Input
                          label="Phone Number *"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          fullWidth
                          required
                        />
                      </div>
                      
                      <div className="mt-6 flex justify-between">
                        <Link to="/cart">
                          <Button 
                            type="button" 
                            variant="outline"
                            leftIcon={<ArrowLeft className="w-4 h-4" />}
                          >
                            Back to Cart
                          </Button>
                        </Link>
                        <Button type="submit">
                          Continue to Payment
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* Payment QR */
                  <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Payment</h2>
                    
                    {error && (
                      <div className="mb-4 p-3 bg-error-50 text-error-700 rounded-md text-sm">
                        {error}
                      </div>
                    )}
                    
                    <div className="text-center py-6">
                      <p className="mb-4 text-gray-700">
                        Scan the QR code below to pay ₹{getTotal().toFixed(2)}
                      </p>
                      
                      <div className="max-w-xs mx-auto">
                        {/* This is a placeholder for the QR code */}
                        <div className="bg-gray-100 w-48 h-48 mx-auto rounded-md flex items-center justify-center">
                          <p className="text-gray-500">UPI QR Code</p>
                        </div>
                        
                        <p className="mt-4 text-sm text-gray-500">
                          You can use any UPI app like Google Pay, PhonePe, Paytm, etc.
                        </p>
                      </div>
                      
                      <div className="mt-8">
                        <Button
                          onClick={handleCompleteOrder}
                          isLoading={isSubmitting}
                          fullWidth
                        >
                          I have paid - Complete Order
                        </Button>
                        
                        <button
                          type="button"
                          className="mt-4 text-sm text-primary-600 hover:text-primary-500"
                          onClick={() => setPaymentStep(false)}
                        >
                          Go back to edit details
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="py-3 flex justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {item.name} × {item.cartQuantity}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {item.category}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ₹{(item.price * item.cartQuantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-500">Subtotal</p>
                    <p className="font-medium text-gray-900">₹{getTotal().toFixed(2)}</p>
                  </div>
                  
                  <div className="flex justify-between text-sm mt-2">
                    <p className="text-gray-500">Delivery</p>
                    <p className="font-medium text-gray-900">Free</p>
                  </div>
                  
                  <div className="flex justify-between text-base font-medium mt-4">
                    <p className="text-gray-900">Total</p>
                    <p className="text-primary-600">₹{getTotal().toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;