-- Supabase SQL Schema for Feisty Street Food
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============ TABLES ============

-- Menus table
CREATE TABLE IF NOT EXISTS menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'makanan',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  order_type TEXT CHECK (order_type IN ('dine_in', 'takeaway')) DEFAULT 'takeaway',
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('cash', 'qris', 'va')) DEFAULT 'cash',
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed')) DEFAULT 'pending',
  order_status TEXT CHECK (order_status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_id UUID NOT NULL REFERENCES menus(id),
  menu_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  payment_gateway TEXT NOT NULL DEFAULT 'ipaymu',
  transaction_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'paid', 'failed', 'expired')) DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ INDEXES ============

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_menus_category ON menus(category);
CREATE INDEX IF NOT EXISTS idx_menus_available ON menus(is_available);

-- ============ RLS POLICIES ============

-- Enable Row Level Security
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Public can view available menus
CREATE POLICY "Public can view available menus" ON menus
  FOR SELECT USING (is_available = true);

-- Allow public to insert orders (for customers)
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Allow customers to view their own orders by phone
CREATE POLICY "Customers can view their own orders" ON orders
  FOR SELECT USING (customer_phone = current_setting('app.current_user_phone', true));

-- Order items: allow select if order belongs to user
CREATE POLICY "Order items visible for order owner" ON order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_phone = current_setting('app.current_user_phone', true)
    )
  );

-- ============ FUNCTIONS ============

-- Function to get next order number
CREATE OR REPLACE FUNCTION get_next_order_number()
RETURNS TEXT AS $$
DECLARE
  today TEXT;
  count INT;
  order_no TEXT;
BEGIN
  today := TO_CHAR(NOW(), 'YYYYMMDD');
  SELECT COUNT(*) INTO count FROM orders WHERE DATE(created_at) = CURRENT_DATE;
  order_no := today || '-' || LPAD((count + 1)::TEXT, 4, '0');
  RETURN order_no;
END;
$$ LANGUAGE plpgsql;

-- ============ TRIGGERS ============

-- Auto update order total from order_items
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE orders
  SET total_amount = (
    SELECT COALESCE(SUM(subtotal), 0)
    FROM order_items
    WHERE order_id = NEW.order_id
  )
  WHERE id = NEW.order_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_order_total_on_item_change
  AFTER INSERT OR UPDATE OR DELETE ON order_items
  FOR EACH ROW EXECUTE FUNCTION update_order_total();

-- ============ VIEWS ============

-- Active menus view
CREATE OR REPLACE VIEW active_menus AS
SELECT id, name, description, price, image_url, category
FROM menus
WHERE is_available = true
ORDER BY category, name;

-- ============ SEED DATA (Optional) ============

-- Sample menu items
INSERT INTO menus (name, description, price, category, image_url) VALUES
  ('Nasi Goreng Special', 'Nasi goreng dengan telur, ayam, dan sayuran segar', 25000, 'makanan', '/images/nasi-goreng.jpg'),
  ('Mie Ayam Bakso', 'Mie ayam dengan bakso sapi homemade', 22000, 'makanan', '/images/mie-ayam.jpg'),
  ('Sate Ayam', 'Sate ayam dengan bumbu kacang dan kecap', 18000, 'makanan', '/images/sate.jpg'),
  ('Es Teh Manis', 'Teh manis dingin segar', 5000, 'minuman', '/images/es-teh.jpg'),
  ('Jus Jeruk', 'Jeruk peras segar tanpa gula', 12000, 'minuman', '/images/jus-jeruk.jpg'),
  ('Es Campur', 'Es campur dengan buah dan selendri', 15000, 'minuman', '/images/es-campur.jpg')
ON CONFLICT DO NOTHING;