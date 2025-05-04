/*
  # Initialize Room No. 319 Database Schema

  1. New Tables
    - `products` - Store all product information
      - `id` (uuid, primary key)
      - `name` (text, product name)
      - `price` (numeric, product price)
      - `quantity` (integer, available stock)
      - `description` (text, optional product description)
      - `image_url` (text, optional product image URL)
      - `category` (text, product category)
      - `created_at` (timestamp with timezone)
    
    - `orders` - Track all customer orders
      - `id` (uuid, primary key)
      - `user_email` (text, customer email)
      - `user_name` (text, customer name)
      - `user_phone` (text, customer phone)
      - `items` (jsonb, ordered items with product details)
      - `total` (numeric, total order amount)
      - `status` (text, order status)
      - `created_at` (timestamp with timezone)
    
    - `users` - Extension of auth.users with role information
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique, user email)
      - `role` (text, user role - admin or user)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin access
    - Add policies for public access where needed
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric(10, 2) NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  description text,
  image_url text,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  user_name text NOT NULL,
  user_phone text NOT NULL,
  items jsonb NOT NULL,
  total numeric(10, 2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Set up Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Products Policies
-- Admin can do everything
CREATE POLICY "Admins can do everything" ON products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Everyone can view products
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Orders Policies
-- Admin can do everything
CREATE POLICY "Admins can do everything" ON orders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Anonymous users can create orders
CREATE POLICY "Anonymous users can create orders" ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Users Policies
-- Admin can do everything
CREATE POLICY "Admins can do everything" ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create trigger to auto-create user record when auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
