/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface OrderItem {
  id: string;
  menu_id: string;
  menu_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  order_type: 'dine_in' | 'takeaway';
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  notes: string | null;
  created_at: string;
  order_items: OrderItem[];
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Order not found');
      }

      setOrder(data.order);
    } catch (error) {
      console.error('Fetch order error:', error);
      toast.error('Pesanan tidak ditemukan');
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchOrder(id);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat detail pesanan...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Menunggu',
      preparing: 'Diproses',
      ready: 'Siap Diambil',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-6"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm opacity-80">No. Pesanan</p>
                <h1 className="text-2xl font-bold">#{order.id.slice(0, 8).toUpperCase()}</h1>
              </div>
              <div className="flex gap-2">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(
                    order.order_status
                  )}`}
                >
                  {formatStatus(order.order_status)}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Order Items */}
            <section>
              <h2 className="text-xl font-bold mb-4">Detail Pesanan</h2>
              <div className="space-y-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.menu_name}</h3>
                      <p className="text-sm text-gray-500">
                        Rp {item.price.toLocaleString('id-ID')} x {item.quantity}
                      </p>
                    </div>
                    <div className="font-bold text-orange-500">
                      Rp {item.subtotal.toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-orange-500">
                  Rp {order.total_amount.toLocaleString('id-ID')}
                </span>
              </div>
            </section>

            {/* Info */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer */}
              <div>
                <h2 className="text-xl font-bold mb-4">Informasi Pemesan</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-500 text-sm">Nama</p>
                    <p className="font-medium">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">WhatsApp</p>
                    <p className="font-medium">{order.customer_phone}</p>
                  </div>
                  {order.customer_address && (
                    <div>
                      <p className="text-gray-500 text-sm">Alamat</p>
                      <p className="font-medium">{order.customer_address}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-500 text-sm">Tipe Pesanan</p>
                    <p className="font-medium">
                      {order.order_type === 'dine_in' ? 'Dine In' : 'Takeaway'}
                    </p>
                  </div>
                  {order.notes && (
                    <div>
                      <p className="text-gray-500 text-sm">Catatan</p>
                      <p className="font-medium">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment */}
              <div>
                <h2 className="text-xl font-bold mb-4">Pembayaran</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-500 text-sm">Metode</p>
                    <p className="font-medium">
                      {order.payment_method === 'cash'
                        ? 'Cash'
                        : order.payment_method === 'qris'
                        ? 'QRIS'
                        : 'Virtual Account'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Status Pembayaran</p>
                    <p className={`font-semibold ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {order.payment_status === 'paid' ? 'Dibayar' : 'Menunggu Pembayaran'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Waktu Pesan</p>
                    <p className="font-medium">{formatDate(order.created_at)}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Actions */}
            {order.order_status === 'ready' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-green-800 font-bold mb-2">🎉 Pesanan Siap Diambil!</p>
                <p className="text-green-700 text-sm">Silakan ambil di counter Feisty.</p>
              </div>
            )}

            {order.order_status === 'preparing' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-blue-800 font-bold mb-2">👨‍🍳 Pesanan sedang dimasak!</p>
                <p className="text-blue-700 text-sm">Estimasi 5-10 menit.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Back to Menu */}
        <div className="mt-8 text-center">
          <Link
            href="/menu"
            className="inline-block bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors"
          >
            Pesan Lagi
          </Link>
        </div>
      </div>
    </div>
  );
}
