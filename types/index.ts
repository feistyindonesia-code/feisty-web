export interface Menu {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_available: boolean;
  created_at: string;
}

export interface CartItem {
  menu: Menu;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  order_type: 'dine_in' | 'takeaway';
  total_amount: number;
  payment_method: 'cash' | 'qris' | 'va';
  payment_status: 'pending' | 'paid' | 'failed';
  order_status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_id: string;
  menu_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}