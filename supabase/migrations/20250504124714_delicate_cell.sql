/*
  # Create products table and policies

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `price` (numeric)
      - `quantity` (integer)
      - `description` (text, optional)
      - `image_url` (text, optional)
      - `category` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on products table
    - Add policies for admin access and public viewing
*/

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric(10,2) NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  description text,
  image_url text,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Admins can do everything" ON public.products;
    DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
END $$;

-- Create policies
CREATE POLICY "Admins can do everything"
  ON public.products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Anyone can view products"
  ON public.products
  FOR SELECT
  TO anon, authenticated
  USING (true);