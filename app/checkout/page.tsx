'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCartStore } from '@/lib/store';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    order_type: 'takeaway' as 'dine_in' | 'takeaway',
    payment_method: 'qris' as 'cash' | 'qris' | 'va',
    notes: '',
  });

  const totalPrice = getTotalPrice();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Keranjang kosong!');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items: items.map((item) => ({
            id: item.menu.id,
            name: item.menu.name,
            price: item.menu.price,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Clear cart
      clearCart();

      if (data.payment.paymentUrl) {
        // Redirect to payment gateway
        toast.success('Redirecting to payment...');
        setTimeout(() => {
          window.location.href = data.payment.paymentUrl;
        }, 1000);
      } else {
        // Cash payment - show success
        toast.success('Order placed successfully!');
        router.push(`/orders/${data.order.id}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Checkout failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Keranjang kosong!</h2>
          <button
            onClick={() => router.push('/menu')}
            className="bg-orange-500 text-white px-6 py-3 rounded-full"
          >
            Kembali ke Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-black text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-lg p-6 space-y-6"
            >
              {/* Customer Information */}
              <div>
                <h2 className="text-xl font-bold mb-4">Informasi Pemesan</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Masukkan nama Anda"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat
                    </label>
                    <textarea
                      name="customer_address"
                      value={formData.customer_address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      placeholder="Masukkan alamat pengiriman (opsional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipe Pesanan
                    </label>
                    <select
                      name="order_type"
                      value={formData.order_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="takeaway">Takeaway (Diambil)</option>
                      <option value="dine_in">Dine In (Makan di tempat)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catatan
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      placeholder="Permintaan khusus (opsional)"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-xl font-bold mb-4">Metode Pembayaran</h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-orange-500 rounded-xl cursor-pointer bg-orange-50">
                    <input
                      type="radio"
                      name="payment_method"
                      value="qris"
                      checked={formData.payment_method === 'qris'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-orange-500"
                    />
                    <div className="ml-4 flex-1">
                      <div className="font-semibold">QRIS</div>
                      <div className="text-sm text-gray-500">Scan QR code untuk bayar</div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-300">
                    <input
                      type="radio"
                      name="payment_method"
                      value="va"
                      checked={formData.payment_method === 'va'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-orange-500"
                    />
                    <div className="ml-4 flex-1">
                      <div className="font-semibold">Virtual Account</div>
                      <div className="text-sm text-gray-500">Bayar via VA bank</div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-orange-300">
                    <input
                      type="radio"
                      name="payment_method"
                      value="cash"
                      checked={formData.payment_method === 'cash'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-orange-500"
                    />
                    <div className="ml-4 flex-1">
                      <div className="font-semibold">Cash</div>
                      <div className="text-sm text-gray-500">Bayar di counter</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-5 h-5 mt-1 text-orange-500 rounded"
                />
                <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                  Saya menyetujui{' '}
                  <a href="/terms" className="text-orange-500 hover:underline">
                    Syarat & Ketentuan
                  </a>{' '}
                  dan{' '}
                  <a href="/refund-policy" className="text-orange-500 hover:underline">
                    Kebijakan Pengembalian Dana
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? 'Memproses...' : `Bayar Rp ${totalPrice.toLocaleString('id-ID')}`}
              </button>
            </motion.form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h2 className="text-xl font-bold mb-4">Ringkasan Pesanan</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.menu.id} className="flex justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{item.menu.name}</div>
                      <div className="text-sm text-gray-500">x{item.quantity}</div>
                    </div>
                    <div className="font-medium">
                      Rp {(item.menu.price * item.quantity).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-lg">
                  <span>Total</span>
                  <span className="font-bold text-orange-500">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}