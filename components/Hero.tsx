'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-yellow-50" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-32 text-center">
        <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-6 leading-tight">
          FEISTY
          <span className="block text-orange-500">STREET FOOD</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Cita rasa kaki lima yang straight up. Tanpa basa-basi, langsung ke perut.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/menu"
            className="group bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-orange-600 transition-all transform hover:scale-105 shadow-lg"
          >
            📱 Lihat Menu
          </Link>
          <Link
            href="/orders"
            className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-bold hover:border-orange-500 hover:text-orange-500 transition-all"
          >
            🔍 Lacak Pesanan
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-500">50+</div>
            <div className="text-gray-500">Menu Miked</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-500">24/7</div>
            <div className="text-gray-500">Buka Setiap Hari</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-500">5min</div>
            <div className="text-gray-500">Antar Cepat</div>
          </div>
        </div>
      </div>
    </section>
  );
}