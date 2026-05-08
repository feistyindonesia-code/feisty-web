import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kebijakan Pengembalian Dana - Feisty',
  description: 'Kebijakan pengembalian dana dan refund di Feisty Street Food',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-black text-gray-900 mb-8">
            Kebijakan Pengembalian Dana (Refund Policy)
          </h1>

          <div className="prose prose-orange max-w-none">
            <p className="text-gray-600 mb-6">
              Kebijakan ini menjelaskan prosedur pengembalian dana untuk pemesanan di Feisty. Kami berkomitmen memberikan layanan terbaik dan menjamin kepuasan pelanggan.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. Ketentuan Umum</h2>
              <p>
                Pengembalian dana hanya akan diproses jika memenuhi kriteria yang tercantum dalam kebijakan ini. Semua permintaan refund akan dievaluasi oleh tim Feisty.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Syarat Pengembalian Dana</h2>
              <p>
                Permintaan refund akan diproses jika terjadi salah satu kondisi berikut:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Pesanan tidak tersedia:</strong> Menu yang dipesan tidak bisa disediakan karena kehabisan stok atau masalah lainnya.</li>
                <li><strong>Kesalahan pesanan:</strong> Menu yang diterima tidak sesuai dengan pesanan (salah menu, jumlah tidak sesuai).</li>
                <li><strong>Kualitas tidak sesuai:</strong> Makanan/minuman tidak memenuhi standar kualitas (terbukti dengan foto/docs).</li>
                <li><strong>Pembayaran ganda:</strong> Terjadi pembayaran rangkap untuk satu pesanan secara tidak sengaja.</li>
                <li><strong>Pembatalan oleh Feisty:</strong> Pesanan dibatalkan oleh kami karena alasan teknis atau operasional.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Proses Pengajuan Refund</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Hubungi kami melalui WhatsApp di +62 812-3456-7890</li>
                <li>Sertakan informasi: No. Pesanan, nama pemesan, dan alasan refund</li>
                <li>Lampirkan bukti (foto pesanan, screenshot transaksi) jika diperlukan</li>
                <li>Tim kami akan merespon dalam maksimal 2 x 24 jam</li>
                <li>Jika disetujui, refund akan diproses dalam 3-7 hari kerja</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Metode Pengembalian Dana</h2>
              <p>
                Dana akan dikembalikan melalui metode yang sama dengan pembayaran asli:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>QRIS/VA:</strong> Refund ke rekening bank yang digunakan untuk pembayaran</li>
                <li><strong>Cash:</strong> Tidak bisa direfund (kecuali pembatalan oleh Feisty)</li>
              </ul>
              <p className="mt-2">
                Biaya transaksi (jika ada) menjadi tanggung jawab Feisty.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Batasan Waktu Pengajuan</h2>
              <p>
                Permintaan refund harus diajukan maksimal <strong>24 jam</strong> setelah:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Pesanan selesai (diterima pelanggan)</li>
                <li>Pembayaran dikonfirmasi (untuk pembatalan sebelum pesanan diproses)</li>
              </ul>
              <p className="mt-2">
                Permintaan di luar batas waktu tidak akan diproses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Kasus Tidak Layak Refund</h2>
              <p>
                Berikut tidak termasuk dalam kebijakan refund:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Perubahan pesanan setelah dikirim ke dapur</li>
                <li>Preferensi rasa/temperature yang tidak sesuai</li>
                <li>Portion yang dianggap terlalu kecil (sesuai standar Feisty)</li>
                <li>Kerusakan/kesalahan yang tidak didukung bukti visuals</li>
                <li>Pesanan yang sudah dinikmati sebagian</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Kompensasi Alternatif</h2>
              <p>
                Jika refund tidak dapat diproses, kami dapat menawarkan:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Voucher Feisty senilai nilai pesanan (berlaku 30 hari)</li>
                <li>Penggantian menu (replacement) untuk kasus kesalahan pesanan</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Kontak</h2>
              <p>
                Untuk ajuan refund atau pertanyaan lebih lanjut:
              </p>
              <div className="mt-4 p-4 bg-orange-50 rounded-xl">
                <p className="font-semibold">Feisty Customer Service</p>
                <p>WhatsApp: +62 812-3456-7890</p>
                <p>Email: support@feisty.my.id</p>
                <p>Jamoperasi: 08:00 - 22:00 WIB</p>
              </div>
            </section>

            <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Catatan:</strong> Kebijakan refund dapat berubah sewaktu-waktu. Versi terakhir berlaku per 1 Mei 2026.
              </p>
            </div>
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