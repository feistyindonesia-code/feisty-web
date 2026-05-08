/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabaseClient } from '@/lib/supabase';
import type { Order } from '@/types';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        router.push('/');
        return;
      }

      const { data } = await supabaseClient!
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (data) {
        setOrder(data as Order);
      } else {
        router.push('/');
      }

      setLoading(false);
    };

    fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pesanan Berhasil!</h1>
        <p className="text-gray-600 mb-6">
          Terima kasih, {order.customer_name}. Pesanan Anda telah diterima.
        </p>

        {/* Order Info */}
        <div className="bg-orange-50 rounded-xl p-4 mb-6 text-left">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">No. Pesanan</span>
              <span className="font-semibold text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total</span>
              <span className="font-bold text-orange-500">
                Rp {order.total_amount.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className="font-semibold text-green-600">Paid</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Notification Hint */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-blue-500 mt-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.26 3 .76 4.38L2 22l4.62-1.26c1.26.46 2.64.76 4.24.76h.04c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.54 0-3-.26-4.38-.76l-2.64 1.06 1.12-3.12c.44.06.9.1 1.38.1.22 0 .44-.02.66-.04C9.76 13.46 9.6 13.22 9.6 13c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5z"/>
            </svg>
            <div className="ml-3">
              <h4 className="font-semibold text-blue-800">Konfirmasi via WhatsApp</h4>
              <p className="text-sm text-blue-700 mt-1">
                orders@feisty.com akan mengirimkan detail pesanan ke WhatsApp Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/orders')}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
          >
            Lacak Pesanan
          </button>
          <button
            onClick={() => router.push('/menu')}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            Menu Lainnya
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}