import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, ArrowRight, Package, ShieldCheck, Clock } from 'lucide-react';
import { supabase } from '../supabase/client';
import { Product } from '../types';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/products/ProductCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products (limited to 4)
        const { data: products, error } = await supabase
          .from('products')
          .select('*')
          .order('name')
          .limit(4);

        if (error) throw error;
        
        setFeaturedProducts(products as Product[]);

        // Fetch unique categories
        const { data: categoryData, error: categoryError } = await supabase
          .from('products')
          .select('category')
          .order('category');

        if (categoryError) throw categoryError;
        
        const uniqueCategories = Array.from(
          new Set(categoryData.map(item => item.category))
        );
        
        setCategories(uniqueCategories as string[]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-500 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              Welcome to Room No. 319
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 animate-slide-up">
              Your one-stop shop for hostel essentials. Quality products at affordable prices.
            </p>
            
            <form onSubmit={handleSearch} className="flex w-full max-w-md animate-slide-up">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                fullWidth
                leftIcon={<Search className="w-4 h-4 text-gray-500" />}
                className="bg-white text-gray-800 rounded-r-none"
              />
              <Button 
                type="submit" 
                className="rounded-l-none"
              >
                Search
              </Button>
            </form>
          </div>
        </div>
        
        <div className="absolute inset-y-0 right-0 hidden lg:block lg:w-1/3">
          <div className="h-full bg-opacity-20 bg-white"></div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/products" className="flex items-center text-primary-600 hover:text-primary-700">
              <span>View all</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Shop by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-lg p-6 animate-pulse">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mb-4"></div>
                  <div className="h-5 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))
            ) : (
              categories.slice(0, 4).map((category) => (
                <Link
                  key={category}
                  to={`/products?category=${category}`}
                  className="bg-white border border-gray-200 rounded-lg p-6 transition-transform hover:shadow-md hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                    <Package className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{category}</h3>
                  <p className="text-sm text-gray-500 mt-1">Shop now</p>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Why Choose Room No. 319?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Products</h3>
              <p className="text-gray-600">Carefully curated products that meet your everyday needs at hostel.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Delivery</h3>
              <p className="text-gray-600">Get your orders delivered within the campus in no time.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-600">Easy and secure payment options with UPI QR codes.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-12 bg-accent-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to shop?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Browse our collection of hostel essentials and get what you need delivered to your doorstep.
          </p>
          <Link to="/products">
            <Button variant="primary" size="lg" className="bg-white text-accent-700 hover:bg-gray-100">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HomePage;