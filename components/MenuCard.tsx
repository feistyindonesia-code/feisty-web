'use client';

import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';
import type { Menu } from '@/types';

interface MenuCardProps {
  menu: Menu;
  onAddToCart?: (menu: Menu) => void;
}

export default function MenuCard({ menu, onAddToCart }: MenuCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!menu.is_available) {
      toast.error('Menu ini sedang habis!');
      return;
    }

    addItem(menu);
    toast.success(`${menu.name} ditambahkan!`);
    onAddToCart?.(menu);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
    >
      {/* Image Container */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {menu.image_url ? (
          <img
            src={menu.image_url}
            alt={menu.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full capitalize">
            {menu.category}
          </span>
        </div>

        {/* Sold out badge */}
        {!menu.is_available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg">
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
          {menu.name}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2 h-10">
          {menu.description || 'Enak, mantap, without compromise'}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-orange-500">
            Rp {menu.price.toLocaleString('id-ID')}
          </span>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={!menu.is_available}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
              menu.is_available
                ? 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tambah
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}