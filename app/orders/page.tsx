'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  customer_name: string;
  total_amount: number;
  order_status: string;
  payment_status: string;
  created_at: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone) {
      toast.error('Masukkan nomor WhatsApp');
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(`/api/orders/lookup?phone=${encodeURIComponent(phone)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mencari pesanan');
      }

      setOrders(data.orders || []);
      if (data.orders?.length === 0) {
        toast('Tidak ada pesanan untuk nomor ini');
      }
    } catch (error) {
      console.error('Order lookup error:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal mencari pesanan');
    } finally {
      setLoading(false);
    }
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
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-black text-gray-900 mb-8 text-center">
          Lacak Pesanan 🔍
        </h1>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Masukkan nomor WhatsApp (08xxxxxxxxxx)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Mencari...' : 'Cari'}
            </button>
          </form>
        </motion.div>

        {/* Results */}
        {searched && orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg">
              Tidak ada pesanan untuk nomor ini.
            </p>
          </motion.div>
        )}

        {orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-gray-900">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.order_status
                        )}`}
                      >
                        {formatStatus(order.order_status)}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.payment_status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.payment_status === 'paid' ? 'Dibayar' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatDate(order.created_at)}
                    </p>
                    <p className="text-lg font-bold text-orange-500 mt-2">
                      Rp {order.total_amount.toLocaleString('id-ID')}
                    </p>
                  </div>

                  <button
                    onClick={() => router.push(`/orders/${order.id}`)}
                    className="bg-orange-100 text-orange-600 px-6 py-2 rounded-full font-semibold hover:bg-orange-200 transition-colors self-start sm:self-auto"
                  >
                    Lihat Detail
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}