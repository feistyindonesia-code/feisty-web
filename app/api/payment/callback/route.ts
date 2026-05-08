import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyCallbackSignature, IpaymuCallbackPayload } from '@/lib/ipaymu';

// Initialize Supabase with service role for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    // Parse the request body as text first (ipaymu sends JSON)
    const body = await request.text();
    
    if (!body) {
      return NextResponse.json(
        { error: 'Empty body' },
        { status: 400 }
      );
    }

    // Parse JSON
    let payload: IpaymuCallbackPayload;
    try {
      payload = JSON.parse(body) as IpaymuCallbackPayload;
    } catch {
      console.error('Invalid JSON:', body);
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    console.log('Received ipaymu callback:', payload);

    // Verify signature
    const ipaymuApiKey = process.env.IPAYMU_API_KEY;
    if (!ipaymuApiKey) {
      console.error('IPAYMU_API_KEY not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const isValidSignature = verifyCallbackSignature(payload, ipaymuApiKey);
    if (!isValidSignature) {
      console.error('Invalid signature from ipaymu callback');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Extract order ID from referenceId
    const orderId = payload.ReferenceNo;
    const paymentStatus = payload.Status === '0' ? 'paid' : 'failed';

    // Update payment status in database
    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        status: paymentStatus,
        paid_at: paymentStatus === 'paid' ? new Date().toISOString() : null,
      })
      .eq('order_id', orderId);

    if (paymentError) {
      console.error('Payment update error:', paymentError);
    }

    // Update order status
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        order_status: paymentStatus === 'paid' ? 'preparing' : 'pending',
      })
      .eq('id', orderId);

    if (orderError) {
      console.error('Order update error:', orderError);
    }

    // TODO: Send WhatsApp notification via Whacenter if payment successful
    // if (paymentStatus === 'paid') {
    //   await sendWhatsAppNotification(orderId);
    // }

    // Return success response to ipaymu
    return NextResponse.json({
      status: 'OK',
      message: 'Payment status updated successfully',
    });

  } catch (error) {
    console.error('Callback processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}