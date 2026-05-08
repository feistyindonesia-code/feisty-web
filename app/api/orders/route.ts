import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createPayment } from '@/lib/ipaymu';

type OrderItemInput = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderRequestBody = {
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  order_type?: 'dine_in' | 'takeaway';
  items: OrderItemInput[];
  payment_method?: 'cash' | 'qris' | 'va';
  notes?: string;
};

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: NextRequest) {
  try {
    const body: OrderRequestBody = await request.json();
    const {
      customer_name,
      customer_phone,
      customer_address,
      order_type,
      items,
      payment_method = 'qris',
      notes,
    } = body;

    // Validation
    if (!customer_name || !customer_phone || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order in Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name,
        customer_phone,
        customer_address: customer_address || null,
        order_type: order_type || 'takeaway',
        total_amount: totalAmount,
        payment_method: payment_method,
        payment_status: 'pending',
        order_status: 'pending',
        notes: notes || null,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      menu_id: item.id,
      menu_name: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) {
      console.error('Order items error:', itemsError);
    }

    // Create payment with ipaymu if needed
    if (payment_method !== 'cash') {
      const ipaymuApiKey = process.env.IPAYMU_API_KEY;
      const ipaymuVa = process.env.IPAYMU_VA;
      const isProduction = process.env.NODE_ENV === 'production';
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010';

      if (!ipaymuApiKey || !ipaymuVa) {
        return NextResponse.json(
          { error: 'Payment gateway not configured' },
          { status: 500 }
        );
      }

      // Prepare ipaymu request
      const products = items.map((item) => item.name);
      const quantities = items.map((item) => item.quantity.toString());
      const prices = items.map((item) => item.price.toString());

      const paymentRequest = {
        product: products,
        qty: quantities,
        price: prices,
        amount: totalAmount.toString(),
        returnUrl: `${appUrl}/payment/success?order_id=${order.id}`,
        cancelUrl: `${appUrl}/payment/failed?order_id=${order.id}`,
        notifyUrl: `${appUrl}/api/payment/callback`,
        referenceId: order.id,
        buyerName: customer_name,
        buyerPhone: customer_phone,
        buyerEmail: '', // optional
      };

      try {
        const ipaymuResponse = await createPayment(
          paymentRequest,
          ipaymuApiKey,
          ipaymuVa,
          isProduction
        );

        if (ipaymuResponse.Status === '0') {
          // Save payment record
          await supabase.from('payments').insert({
            order_id: order.id,
            payment_gateway: 'ipaymu',
            transaction_id: ipaymuResponse.Data?.SessionID || '',
            amount: totalAmount,
            status: 'pending',
          });

          return NextResponse.json({
            success: true,
            order,
            payment: {
              paymentUrl: ipaymuResponse.Data?.URL,
              sessionId: ipaymuResponse.Data?.SessionID,
            },
          });
        } else {
          throw new Error(ipaymuResponse.Message);
        }
      } catch (paymentError) {
        console.error('Payment creation error:', paymentError);
        return NextResponse.json(
          { error: 'Failed to create payment: ' + (paymentError as Error).message },
          { status: 500 }
        );
      }
    }

    // Cash payment - return order directly
    return NextResponse.json({
      success: true,
      order,
      payment: {
        paymentUrl: null,
        message: 'Cash payment - please pay at counter',
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}