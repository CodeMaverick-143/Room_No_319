import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Home, Package } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const { user, isAdmin, logout } = useAuthStore();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <span className="text-xl font-bold text-primary-600">Room No. 319</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/') 
                ? 'text-primary-600' 
                : 'text-gray-700 hover:text-primary-500 hover:bg-gray-50'}`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/products') 
                ? 'text-primary-600' 
                : 'text-gray-700 hover:text-primary-500 hover:bg-gray-50'}`}
            >
              Products
            </Link>
            
            {isAdmin && (
              <Link 
                to="/admin" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/admin') 
                  ? 'text-primary-600' 
                  : 'text-gray-700 hover:text-primary-500 hover:bg-gray-50'}`}
              >
                Admin
              </Link>
            )}
            
            <Link to="/cart" className="relative pl-3">
              <ShoppingCart className={`w-6 h-6 ${isActive('/cart') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-500'}`} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => logout()}
              >
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button 
                  variant="primary" 
                  size="sm"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="relative mr-2">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-500 hover:bg-gray-50 focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') 
                ? 'bg-primary-50 text-primary-600' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-primary-500'}`}
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Home
              </div>
            </Link>
            
            <Link
              to="/products"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/products') 
                ? 'bg-primary-50 text-primary-600' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-primary-500'}`}
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Products
              </div>
            </Link>
            
            {isAdmin && (
              <Link
                to="/admin"
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin') 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-primary-500'}`}
                onClick={closeMenu}
              >
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Admin
                </div>
              </Link>
            )}
            
            {user ? (
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="w-full block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500"
                onClick={closeMenu}
              >
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Login
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;