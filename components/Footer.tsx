import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-orange-500 mb-4">FEISTY</h3>
            <p className="text-sm">
              Street food yang berani, tanpa kompromi. Served fresh di depan minimarket terdekat.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Kontak</h4>
            <ul className="space-y-2 text-sm">
              <li>📍 Depan Minimarket Terdekat</li>
              <li>📞 +62 812-3456-7890</li>
              <li>⏰ 24/7, 7 hari seminggu</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Sosial Media</h4>
            <ul className="space-y-2 text-sm">
              <li>📸 @feisty.streetfood</li>
              <li>🐦 @feisty_id</li>
              <li>📘 /feisty-indonesia</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Info</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-orange-500 transition-colors">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-orange-500 transition-colors">
                  Kebijakan Refund
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-orange-500 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          © 2024 Feisty. All rights reserved. Made with 🔥 for street food lovers.
        </div>
      </div>
    </footer>
  );
}