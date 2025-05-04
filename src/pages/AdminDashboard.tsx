import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, ShoppingBag, Users, RefreshCw } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useAuthStore } from '../store/authStore';
import { Product, Order } from '../types';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import ProductForm from '../components/admin/ProductForm';
import OrderTable from '../components/admin/OrderTable';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('products');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productStats, setProductStats] = useState({
    total: 0,
    outOfStock: 0,
    lowStock: 0,
  });
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });

  // Check for admin access
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !isAdmin) return;
      
      setIsLoading(true);
      
      try {
        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('name');
        
        if (productsError) throw productsError;
        setProducts(productsData as Product[]);
        
        // Calculate product stats
        const totalProducts = productsData.length;
        const outOfStock = productsData.filter(p => p.quantity === 0).length;
        const lowStock = productsData.filter(p => p.quantity > 0 && p.quantity <= 5).length;
        
        setProductStats({
          total: totalProducts,
          outOfStock,
          lowStock,
        });
        
        // Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (ordersError) throw ordersError;
        setOrders(ordersData as Order[]);
        
        // Calculate order stats
        const totalOrders = ordersData.length;
        const pendingOrders = ordersData.filter(o => o.status === 'pending').length;
        const completedOrders = ordersData.filter(o => o.status === 'completed').length;
        
        setOrderStats({
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, isAdmin]);

  const refreshData = async () => {
    if (!user || !isAdmin) return;
    
    setIsLoading(true);
    
    try {
      // Refresh products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (productsError) throw productsError;
      setProducts(productsData as Product[]);
      
      // Refresh orders if on orders tab
      if (activeTab === 'orders') {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (ordersError) throw ordersError;
        setOrders(ordersData as Order[]);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleOrderStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your products and orders</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button 
                variant="outline" 
                leftIcon={<RefreshCw className="w-4 h-4" />}
                onClick={refreshData}
                isLoading={isLoading}
              >
                Refresh
              </Button>
              
              {activeTab === 'products' && (
                <Button 
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => {
                    setIsAdding(true);
                    setEditingProduct(null);
                  }}
                >
                  Add Product
                </Button>
              )}
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                  <Package className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
                  <p className="text-2xl font-semibold text-gray-900">{productStats.total}</p>
                </div>
              </div>
              <div className="mt-4 flex text-sm">
                <span className="text-warning-700 mr-4">
                  {productStats.lowStock} Low Stock
                </span>
                <span className="text-error-700">
                  {productStats.outOfStock} Out of Stock
                </span>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-secondary-100 text-secondary-600">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                  <p className="text-2xl font-semibold text-gray-900">{orderStats.total}</p>
                </div>
              </div>
              <div className="mt-4 flex text-sm">
                <span className="text-warning-700 mr-4">
                  {orderStats.pending} Pending
                </span>
                <span className="text-success-700">
                  {orderStats.completed} Completed
                </span>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-accent-100 text-accent-600">
                  <Users className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Admin Access</h3>
                  <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'products'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
                onClick={() => setActiveTab('products')}
              >
                Products
              </button>
              <button
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'orders'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
                onClick={() => setActiveTab('orders')}
              >
                Orders
              </button>
            </nav>
          </div>
          
          {/* Product Form Dialog */}
          {(isAdding || editingProduct) && (
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full p-6">
                  <ProductForm
                    product={editingProduct || undefined}
                    onSuccess={() => {
                      setIsAdding(false);
                      setEditingProduct(null);
                      refreshData();
                    }}
                    onCancel={() => {
                      setIsAdding(false);
                      setEditingProduct(null);
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Tab Content */}
          {activeTab === 'products' ? (
            // Products Tab
            <div className="bg-white shadow rounded-lg">
              {isLoading ? (
                <div className="animate-pulse p-4">
                  <div className="h-10 bg-gray-200 rounded mb-4"></div>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="h-16 bg-gray-200 rounded mb-2"></div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                {product.image_url ? (
                                  <img
                                    className="h-10 w-10 rounded-md object-cover"
                                    src={product.image_url}
                                    alt={product.name}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                                    {product.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">₹{product.price}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex text-sm px-2 py-1 rounded-full ${
                              product.quantity === 0
                                ? 'bg-error-100 text-error-700'
                                : product.quantity <= 5
                                ? 'bg-warning-100 text-warning-700'
                                : 'bg-success-100 text-success-700'
                            }`}>
                              {product.quantity} in stock
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Button
                              size="sm"
                              variant="outline"
                              className="mr-2"
                              onClick={() => setEditingProduct(product)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleProductDelete(product.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            // Orders Tab
            <div className="bg-white shadow rounded-lg">
              <OrderTable
                orders={orders}
                isLoading={isLoading}
                onStatusChange={handleOrderStatusChange}
              />
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;