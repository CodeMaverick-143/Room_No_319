import React from 'react';
import { Order } from '../../types';
import { ShoppingBag, Clock, Check, X } from 'lucide-react';
import Button from '../ui/Button';

interface OrderTableProps {
  orders: Order[];
  isLoading: boolean;
  onStatusChange: (orderId: string, status: Order['status']) => Promise<void>;
}

const OrderTable: React.FC<OrderTableProps> = ({ 
  orders, 
  isLoading,
  onStatusChange 
}) => {
  const statusColors = {
    pending: 'bg-warning-50 text-warning-700',
    paid: 'bg-primary-50 text-primary-700',
    completed: 'bg-success-50 text-success-700',
    cancelled: 'bg-error-50 text-error-700',
  };

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    await onStatusChange(orderId, status);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded"></div>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-20 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
        <p className="mt-1 text-sm text-gray-500">No orders have been placed yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.id.slice(0, 8)}...
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {order.user_email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(order.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ₹{order.total.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex space-x-2">
                  {order.status === 'pending' && (
                    <Button 
                      size="sm" 
                      variant="secondary"
                      leftIcon={<Check className="h-3 w-3" />}
                      onClick={() => handleStatusChange(order.id, 'paid')}
                    >
                      Mark Paid
                    </Button>
                  )}
                  
                  {order.status === 'paid' && (
                    <Button 
                      size="sm" 
                      variant="primary"
                      leftIcon={<Check className="h-3 w-3" />}
                      onClick={() => handleStatusChange(order.id, 'completed')}
                    >
                      Complete
                    </Button>
                  )}
                  
                  {(order.status === 'pending' || order.status === 'paid') && (
                    <Button 
                      size="sm" 
                      variant="danger"
                      leftIcon={<X className="h-3 w-3" />}
                      onClick={() => handleStatusChange(order.id, 'cancelled')}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;