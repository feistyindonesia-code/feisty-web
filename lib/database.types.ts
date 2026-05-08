export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      menus: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          image_url: string;
          category: string;
          is_available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          image_url: string;
          category: string;
          is_available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          image_url?: string;
          category?: string;
          is_available?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
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
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_phone: string;
          customer_address: string;
          order_type: 'dine_in' | 'takeaway';
          total_amount: number;
          payment_method: 'cash' | 'qris' | 'va';
          payment_status?: 'pending' | 'paid' | 'failed';
          order_status?: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
          notes?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_phone?: string;
          customer_address?: string;
          order_type?: 'dine_in' | 'takeaway';
          total_amount?: number;
          payment_method?: 'cash' | 'qris' | 'va';
          payment_status?: 'pending' | 'paid' | 'failed';
          order_status?: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
          notes?: string;
          created_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_id: string;
          menu_name: string;
          quantity: number;
          price: number;
          subtotal: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_id: string;
          menu_name: string;
          quantity: number;
          price: number;
          subtotal: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          menu_id?: string;
          menu_name?: string;
          quantity?: number;
          price?: number;
          subtotal?: number;
        };
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          payment_gateway: string;
          transaction_id: string;
          amount: number;
          status: string;
          paid_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          payment_gateway: string;
          transaction_id: string;
          amount: number;
          status: string;
          paid_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          payment_gateway?: string;
          transaction_id?: string;
          amount?: number;
          status?: string;
          paid_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}