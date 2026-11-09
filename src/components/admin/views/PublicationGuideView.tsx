import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Globe, Shield, Search, ArrowRight, ExternalLink, ChevronDown, Copy, Check } from 'lucide-react';

export const PublicationGuideView: React.FC = () => {
  const [openStep, setOpenStep] = useState<number | null>(1);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const steps = [
    {
      step: 1,
      title: 'Membuka dan Mengamankan Panel Admin',
      summary: 'Cara masuk ke panel admin dan mengelola website kapan saja.',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            Untuk mengelola seluruh isi website, klik tombol <strong>"Kelola Admin"</strong> di bagian paling atas atau footer website, atau buka alamat:
          </p>
          <div className="flex items-center gap-2 p-2.5 bg-slate-100 rounded-xl font-mono text-slate-800">
            <span>https://domain-anda.com (lalu klik tombol Kelola Admin)</span>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Gunakan <strong>Username</strong> dan <strong>Password</strong> yang telah Anda buat saat pertama kali menginstal website.</li>
            <li>Jangan pernah memberikan password administrator kepada orang lain.</li>
            <li>Anda dapat mengganti password kapan saja di menu <strong>Pengaturan Website</strong>.</li>
          </ul>
        </div>
      ),
    },
    {
      step: 2,
      title: 'Mengisi Identitas Bisnis, Toko, dan Kontak',
      summary: 'Lengkapi nama toko, alamat, logo, dan nomor telepon.',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            Buka menu <strong>"Identitas Website"</strong> di bilah navigasi samping:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li><strong>Nama Toko / Perusahaan:</strong> Masukkan nama usaha Anda (misal: <em>Distributor Audio QRIS</em> atau <em>Toko Mandiri Barokah</em>).</li>
            <li><strong>Logo Toko:</strong> Klik tombol <em>"Pilih File Gambar"</em> untuk mengunggah logo toko berformat PNG/JPG.</li>
            <li><strong>Nomor HP & Email:</strong> Masukkan kontak resmi untuk kebutuhan komunikasi pembeli.</li>
            <li><strong>Alamat & Kota:</strong> Tuliskan alamat dan kota toko Anda. Informasi kota ini sangat penting untuk membantu peringkat <em>Local SEO Google</em>.</li>
            <li>Klik tombol <strong>"Simpan Identitas Website"</strong>.</li>
          </ol>
        </div>
      ),
    },
    {
      step: 3,
      title: 'Mengatur Nomor WhatsApp Pemesanan',
      summary: 'Hubungkan tombol pemesanan langsung ke WhatsApp penjual.',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            Buka menu <strong>"Pengaturan WhatsApp"</strong>:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>Masukkan nomor WhatsApp penjual. Gunakan awalan format Indonesia, contoh: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">08123456789</code> atau <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">628123456789</code>.</li>
            <li>Sistem akan otomatis merapikan nomor menjadi format resmi internasional WhatsApp.</li>
            <li>Sesuaikan pesan otomatis pemesanan menggunakan tag <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">{'{produk}'}</code> dan <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">{'{harga}'}</code>.</li>
            <li>Centang <em>"Aktifkan Tombol WhatsApp Melayang"</em> agar pengunjung mudah menghubungi Anda kapan saja.</li>
            <li>Klik tombol <strong>"Simpan Pengaturan WhatsApp"</strong>.</li>
          </ol>
        </div>
      ),
    },
    {
      step: 4,
      title: 'Menambahkan Produk & Harga GoPay Spiker',
      summary: 'Unggah foto produk, spesifikasi resmi, dan tentukan harga jual.',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            Buka menu <strong>"Kelola Produk"</strong>:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>Klik tombol <strong>"+ Tambah Produk Baru"</strong>.</li>
            <li><strong>Nama Produk:</strong> Contoh: <em>GoPay Spiker 4G LTE Soundbox</em>.</li>
            <li><strong>Harga:</strong> Masukkan angka harga (misal: 499000). Sistem otomatis memformat menjadi <strong>Rp 499.000</strong>.</li>
            <li><strong>Status:</strong> Pilih Tersedia, Pre-Order, atau Stok Habis.</li>
            <li><strong>Foto Produk:</strong> Klik <em>Upload Foto</em> untuk memilih foto produk perangkat dari galeri HP atau laptop.</li>
            <li><strong>Spesifikasi:</strong> Masukkan fitur teknis (misal: Koneksi SIM Card 4G, Baterai Tahan 3 Hari, Suara Lantang & Jernih).</li>
            <li>Klik tombol <strong>"Simpan Produk"</strong>. Produk langsung tampil rapi di katalog halaman depan.</li>
          </ol>
        </div>
      ),
    },
    {
      step: 5,
      title: 'Menyiapkan Domain Kustom (Alamat Website Sendiri)',
      summary: 'Gunakan nama domain profesional seperti www.gopayspiker.com.',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            Untuk mendapatkan alamat website profesional (.com, .id, atau .co.id):
          </p>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>Beli domain pilihan Anda melalui registrar domain resmi di Indonesia (misal: Niagahoster, DomaiNesia, IDCloudHost, atau Cloudflare).</li>
            <li>Buka menu <strong>Pengaturan Website</strong> di panel admin, masukkan nama domain Anda di kolom <em>Domain Website Utama</em> (misal: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">gopayspiker.com</code>).</li>
            <li>Hubungkan DNS Domain (Record A / CNAME) ke server hosting Anda. SSL/HTTPS akan otomatis aktif untuk melindungi keamanan data pengunjung.</li>
          </ol>
        </div>
      ),
    },
    {
      step: 6,
      title: 'Menghubungkan Website ke Google Search Console (GSC)',
      summary: 'Daftarkan website agar dapat ditemukan di hasil pencarian Google.',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            Agar calon pembeli yang mencari <em>"Jual GoPay Spiker"</em> atau <em>"Harga GoPay Spiker"</em> dapat menemukan website Anda:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>Kunjungi <strong>Google Search Console</strong> di <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-[#00AED6] font-semibold underline">search.google.com/search-console</a> menggunakan akun Google (Gmail) Anda.</li>
            <li>Pilih tipe properti <strong>"URL Prefix"</strong> dan masukkan alamat website Anda (contoh: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">https://domain-anda.com</code>).</li>
            <li>Pilih metode verifikasi <strong>HTML Tag</strong>. Salin kode meta tag yang diberikan oleh Google.</li>
            <li>Buka menu <strong>"Pengaturan SEO"</strong> di panel admin website Anda, lalu tempel kode tersebut di kolom <strong>Kode Verifikasi Google Search Console</strong>.</li>
            <li>Klik <strong>Simpan Pengaturan SEO</strong>.</li>
            <li>Kembali ke Google Search Console, lalu klik tombol <strong>"Verify" (Verifikasi)</strong>. Website Anda kini resmi terhubung ke Google!</li>
          </ol>
        </div>
      ),
    },
    {
      step: 7,
      title: 'Mengirimkan Sitemap.xml ke Google',
      summary: 'Bantu robot Google mengindeks seluruh halaman dan produk Anda lebih cepat.',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            Sistem Sales GoPay Spiker telah dilengkapi generator sitemap otomatis:
          </p>
          <div className="flex items-center justify-between p-2.5 bg-slate-100 rounded-xl font-mono text-slate-800">
            <span>https://domain-anda.com/sitemap.xml</span>
            <button
              onClick={() => copyToClipboard('sitemap.xml', 'sitemap')}
              className="text-xs text-[#00AED6] hover:underline flex items-center gap-1 font-sans font-semibold cursor-pointer"
            >
              {copiedIndex === 'sitemap' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 'sitemap' ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>Di Google Search Console, buka menu <strong>"Sitemaps" (Peta Situs)</strong> di panel sebelah kiri.</li>
            <li>Pada kolom <em>Add a new sitemap</em> (Tambahkan peta situs baru), ketik: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold">sitemap.xml</code></li>
            <li>Klik tombol <strong>Submit (Kirim)</strong>. Status akan berubah menjadi <em>Success (Sukses)</em> berwarna hijau.</li>
          </ol>
        </div>
      ),
    },
    {
      step: 8,
      title: 'Memeriksa Status Indeks Google',
      summary: 'Cara mengetahui apakah halaman website sudah muncul di pencarian Google.',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            Google memerlukan waktu antara 1 hingga 7 hari untuk mengindeks website baru. Untuk memeriksanya:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Buka Google.com, lalu ketik di kolom pencarian: <code className="bg-slate-100 px-2 py-0.5 rounded font-mono font-bold">site:domain-anda.com</code></li>
            <li>Jika halaman website Anda muncul di hasil pencarian, artinya website sudah terindeks sempurna dan dapat dikunjungi calon pembeli dari seluruh Indonesia.</li>
            <li>Anda juga dapat memeriksa performa klik dan kata kunci melalui tab <em>Performance</em> di Google Search Console.</li>
          </ul>
        </div>
      ),
    },
    {
      step: 9,
      title: 'Menghubungkan Google Analytics 4 (GA4)',
      summary: 'Pantau jumlah calon pembeli yang mengunjungi website Anda.',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>Buka <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-[#00AED6] underline font-semibold">analytics.google.com</a> dan buat properti web baru.</li>
            <li>Salin <strong>Measurement ID</strong> yang berawalan <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">G-XXXXXXXXXX</code>.</li>
            <li>Masukkan ID tersebut di menu <strong>"Pengaturan SEO"</strong> &rarr; <em>Measurement ID Google Analytics 4</em>, lalu klik Simpan.</li>
            <li>Pelacakan statistik pengunjung langsung aktif tanpa perlu memodifikasi kode program.</li>
          </ol>
        </div>
      ),
    },
    {
      step: 10,
      title: 'Melakukan Backup Berkala & Pembaruan Konten',
      summary: 'Jaga keamanan data website dan perbarui harga kapan pun diperlukan.',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Secara berkala, buka menu <strong>Pengaturan Website</strong> dan klik <strong>"Unduh File Backup"</strong>. File cadangan ini menyimpan seluruh identitas, produk, harga, dan pengaturan Anda.</li>
            <li>Jika ada promo harga baru atau stok perangkat bertambah, Anda cukup membuka menu <strong>Kelola Produk</strong> dan mengklik tombol <em>Edit</em> pada produk terkait.</li>
            <li>Website tidak memerlukan coding atau keahlian teknis untuk pemeliharaan harian.</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-150">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-[#00AED6]" />
          <span>Panduan Lengkap Publikasi & Pengelolaan Website Online</span>
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Ikuti langkah-langkah mudah di bawah ini untuk mempublikasikan website, menghubungkan domain, dan mendaftarkannya ke Google Search Console.
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((item) => {
          const isOpen = openStep === item.step;
          return (
            <div
              key={item.step}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition"
            >
              <button
                type="button"
                onClick={() => setOpenStep(isOpen ? null : item.step)}
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm hover:text-[#00AED6] transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#00AED6] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h3>
                    <p className="text-xs text-slate-500 font-normal">{item.summary}</p>
                  </div>
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#00AED6]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50 animate-in fade-in">
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
