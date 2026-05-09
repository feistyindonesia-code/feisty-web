'use client';

import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/store';

export default function FloatingCartButton() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const openCart = useCartStore((state) => state.openCart);

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', damping: 20 }}
      onClick={openCart}
      className="fixed bottom-6 right-6 z-40 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
      aria-label="Open cart"
    >
      {/* Cart Icon */}
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>

      {/* Badge */}
      {totalItems > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          suppressHydrationWarning
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white"
        >
          {totalItems > 99 ? '99+' : totalItems}
        </motion.span>
      )}
    </motion.button>
  );
}