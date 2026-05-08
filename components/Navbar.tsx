'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-orange-500">
          Fieisty
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/menu" className="font-medium hover:text-orange-500 transition-colors">
            Menu
          </Link>
          <Link href="/orders" className="font-medium hover:text-orange-500 transition-colors">
            Orders
          </Link>
          <Link
            href="/menu"
            className="bg-orange-500 text-white px-4 py-2 rounded-full font-medium hover:bg-orange-600 transition-colors"
          >
            Order Now
          </Link>
        </div>
      </div>
    </nav>
  );
}