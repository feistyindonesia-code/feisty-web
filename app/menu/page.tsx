'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MenuCard from '@/components/MenuCard';
import MenuSkeleton from '@/components/MenuSkeleton';
import { getSupabase } from '@/lib/supabase';
import type { Menu } from '@/types';

const categories = ['all', 'makanan', 'minuman', 'snack'];

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch menus from Supabase
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setIsLoading(true);
        const supabase = getSupabase();
        
        if (!supabase) {
          // Dummy data for development
          const dummyMenus: Menu[] = [
            {
              id: '1',
              name: 'Nasi Goreng Special',
              description: 'Nasi goreng dengan telur, ayam, dan sayuran segar',
              price: 25000,
              image_url: '',
              category: 'makanan',
              is_available: true,
              created_at: new Date().toISOString(),
            },
            {
              id: '2',
              name: 'Mie Ayam Bakso',
              description: 'Mie ayam dengan bakso sapi homemade',
              price: 22000,
              image_url: '',
              category: 'makanan',
              is_available: true,
              created_at: new Date().toISOString(),
            },
            {
              id: '3',
              name: 'Sate Ayam',
              description: 'Sate ayam dengan bumbu kacang dan kecap',
              price: 18000,
              image_url: '',
              category: 'makanan',
              is_available: true,
              created_at: new Date().toISOString(),
            },
            {
              id: '4',
              name: 'Es Teh Manis',
              description: 'Teh manis dingin segar',
              price: 5000,
              image_url: '',
              category: 'minuman',
              is_available: true,
              created_at: new Date().toISOString(),
            },
            {
              id: '5',
              name: 'Jus Jeruk',
              description: 'Jeruk peras segar tanpa gula',
              price: 12000,
              image_url: '',
              category: 'minuman',
              is_available: true,
              created_at: new Date().toISOString(),
            },
            {
              id: '6',
              name: 'Es Campur',
              description: 'Es campur dengan buah dan selendri',
              price: 15000,
              image_url: '',
              category: 'minuman',
              is_available: true,
              created_at: new Date().toISOString(),
            },
          ];
          setMenus(dummyMenus);
          setIsLoading(false);
          return;
        }

        const { data, error: supabaseError } = await supabase
          .from('menus')
          .select('*')
          .eq('is_available', true)
          .order('category')
          .order('name');

        if (supabaseError) throw supabaseError;
        setMenus(data || []);
      } catch (err) {
        console.error('Error fetching menus:', err);
        setError('Gagal memuat menu. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenus();
  }, []);

  // Compute filtered menus (no separate state, avoid useEffect)
  const filteredMenus = useMemo(() => {
    if (selectedCategory === 'all') {
      return menus;
    }
    return menus.filter((menu) => menu.category === selectedCategory);
  }, [selectedCategory, menus]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            MENU FEISTY 🔥
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Pilih favorite kamu, langsung ke perut!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-bold transition-all ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-orange-100 shadow'
              }`}
            >
              {category === 'all' ? ' Semua' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <MenuSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600"
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredMenus.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {selectedCategory === 'all'
                ? 'Belum ada menu. Stay tuned!'
                : `Belum ada menu di kategori ${selectedCategory}.`}
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredMenus.map((menu) => (
                <motion.div
                  key={menu.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <MenuCard menu={menu} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
