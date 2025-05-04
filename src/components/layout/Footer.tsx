import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, Shield, Mail, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-xl font-bold text-primary-600">Room No. 319</Link>
            <p className="mt-2 text-sm text-gray-600">
              Your one-stop shop for all hostel essentials. Quality products, affordable prices.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-500 text-sm">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-primary-500 text-sm">Products</Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-600 hover:text-primary-500 text-sm">Cart</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-primary-500 text-sm">Login</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=food" className="text-gray-600 hover:text-primary-500 text-sm">Food & Snacks</Link>
              </li>
              <li>
                <Link to="/products?category=stationery" className="text-gray-600 hover:text-primary-500 text-sm">Stationery</Link>
              </li>
              <li>
                <Link to="/products?category=toiletries" className="text-gray-600 hover:text-primary-500 text-sm">Toiletries</Link>
              </li>
              <li>
                <Link to="/products?category=electronics" className="text-gray-600 hover:text-primary-500 text-sm">Electronics</Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-900 mb-4">Why Choose Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <ShoppingBag className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">Quality products for hostel life</span>
              </li>
              <li className="flex items-start">
                <Clock className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">Quick delivery within the campus</span>
              </li>
              <li className="flex items-start">
                <Shield className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">Secure and easy payments</span>
              </li>
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">Contact us: shop@roomno319.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Room No. 319. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;