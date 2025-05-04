export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  quantity: number;
  image_url?: string;
  category: string;
  created_at: string;
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface Order {
  id: string;
  user_email: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'completed' | 'cancelled';
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}