import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan - Feisty',
  description: 'Syarat dan ketentuan penggunaan layanan Feisty Street Food',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-black text-gray-900 mb-8">
            Syarat & Ketentuan
          </h1>

          <div className="prose prose-orange max-w-none">
            <p className="text-gray-600 mb-6">
              Terima kasih telah menggunakan Feisty. Dengan menggunakan website dan layanan kami, Anda menyetujui syarat dan ketentuan yang tercantum di bawah ini.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. Penerimaan Syarat</h2>
              <p>
                Dengan mengakses atau menggunakan website Feisty, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini, serta semua hukum dan peraturan yang berlaku. Jika Anda tidak menyetujui mana pun dari poin-poin di bawah, Anda dilarang menggunakan atau mengakses website kami.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Layanan</h2>
              <p>
                Feisty menyediakan layanan pemesanan makanan dan minuman dari lokasi kaki lima di depan minimarket. Kami berhak mengubah, menambah, atau menghentikan layanan kapan saja tanpa pemberitahuan terlebih dahulu.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Pesanan & Pembayaran</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pesanan hanya akan diproses setelah pembayaran dikonfirmasi.</li>
                <li>Harga yang tertera dapat berubah sewaktu-waktu tanpa pemberitahuan.</li>
                <li>Kami berhak membatalkan pesanan jika terdapat indikasi fraud atau informasi yang tidak valid.</li>
                <li>Pembayaran non-cash melalui QRIS dan Virtual Account memiliki batas waktu pembayaran 15 menit.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Pengembalian Dana (Refund)</h2>
              <p>
                Pengembalian dana hanya dapat diajukan dalam kondisi berikut:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Pesanan tidak dapat dipenuhi karena kehabisan stok.</li>
                <li>Kesalahan order dari pihak Feisty.</li>
                <li>Transaksi pembayaran ganda secara tidak sengaja.</li>
              </ul>
              <p className="mt-2">
                Permintaan refund harus diajukan maksimal 24 jam setelah pembayaran dikonfirmasi. Proses refund akan dilakukan dalam 3-7 hari kerja.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Hak Kekayaan Intelektual</h2>
              <p>
                Semua konten di website Feisty termasuk logo, teks, gambar, dan desain adalah milik Feisty dan dilindungi oleh hak cipta serta hukum kekayaan intelektual lainnya.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Batasan Tanggung Jawab</h2>
              <p>
                Feisty tidak bertanggung jawab atas:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Kerusakan atau keterlambatan caused by force majeure.</li>
                <li>Kesalahan pemesanan yang disebabkan oleh kelalaian pelanggan.</li>
                <li>Masalah jaringan atau sistem di pihak pihak ketiga (payment gateway, provider).</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Perubahan Syarat</h2>
              <p>
                Kami berhak mengubah syarat dan ketentuan ini kapan saja. Perubahan akan berlaku segera setelah dip posting di website. Penggunaan berkelanjutan terhadap website setelah perubahan berarti Anda menerima syarat baru.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Hukum yang Mengatur</h2>
              <p>
                Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia. Setiap sengketa yang timbul akan diselesaikan melalui musyawarah terlebih dahulu, dan jika diperlukan, melalui pengadilan yang berwenang di wilayah Indonesia.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">9. Hubungi Kami</h2>
              <p>
                Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi:
              </p>
              <div className="mt-4 p-4 bg-orange-50 rounded-xl">
                <p className="font-semibold">Feisty Street Food</p>
                <p>📞 +62 812-3456-7890</p>
                <p>📧 hi@feisty.my.id</p>
                <p>📍 Depan Minimarket Terdekat</p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link href="/" className="text-orange-500 hover:underline font-medium">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}