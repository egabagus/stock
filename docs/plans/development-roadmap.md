# Project Development Roadmap: Sistem Informasi Stok Barang UMKM

Rencana bertahap pengembangan sistem stok barang berbasis **Laravel + Inertia.js (React) + PostgreSQL** mengacu pada proposal Capstone Project.

---

## 1. Timeline & Milestone Proyek

### Milestone 1: Fondasi & Inisialisasi Lingkungan
- Setup Laravel Breeze dengan React & Inertia.js.
- Konfigurasi koneksi PostgreSQL.
- Setup layout dashboard, navbar, flash messages, dan integrasi Tailwind CSS.

### Milestone 2: Modul Pengguna & Master Data
- Autentikasi dan Role Otorisasi (Admin & Staf Gudang).
- CRUD Kategori Barang (Kategori nama, deskripsi).
- CRUD Supplier / Pemasok:
  - Kode Supplier (unik, misal `SUP-001`), Nama Supplier.
  - Kontak PIC, No. Telepon/WhatsApp, Email, Alamat, Catatan.
  - Status aktif/non-aktif (`is_active`).
- CRUD Data Barang / Produk:
  - SKU (unik), Nama Barang, Satuan, Kategori.
  - Stok minimum (ambang batas peringatan).
  - Harga beli & jual (opsional/catatan harga).

### Milestone 3: Modul Transaksi Persediaan & Catatan Keuangan (Core Engine)
- **Modul Barang Masuk (*Stock In*)**:
  - Form pencatatan penerimaan barang terintegrasi dengan Supplier (`supplier_id`) / referensi nota.
  - Pencatatan harga beli per unit (`unit_price`), kalkulasi otomatis subtotal per item, dan total belanja faktur (`total_amount`).
  - Penambahan stok otomatis dengan `DB::transaction`.
- **Modul Barang Keluar (*Stock Out*)**:
  - Form pencatatan barang keluar (penjualan, pemakaian, rusak) beserta harga jual/nilai barang.
  - Kalkulasi subtotal dan total nilai transaksi pengeluaran.
  - Validasi pencegahan stok minus & concurrency lock.
- Penomoran otomatis transaksi (misal: `IN-20261011-001`, `OUT-20261011-001`).

### Milestone 4: Monitoring Stok & Alert Stok Minimum
- Halaman/Widget Dashboard:
  - Ringkasan total SKU, barang menipis, barang habis.
  - Widget valuasi nilai total aset persediaan di gudang.
  - Tabel peringatan stok kritis (*low stock warning*).
- Halaman Kartu Stok / Riwayat Mutasi per Barang:
  - Menampilkan riwayat pergerakan masuk dan keluar secara kronologis beserta harga satuan dan subtotal.

### Milestone 5: Modul Laporan & Ekspor Data
- Laporan pergerakan stok dan mutasi keuangan berdasarkan rentang tanggal.
- Rekapitulasi finansial: Total pengeluaran pengadaan (modal beli) & total omzet/nilai barang keluar.
- Filter berdasarkan jenis mutasi (Masuk / Keluar) dan kategori barang.
- Tampilan ramah cetak (*print view*) dan ekspor format CSV/PDF.

### Milestone 6: Pengujian, Evaluasi, & Finalisasi
- Pengujian fungsionalitas (manual testing & form validation).
- Uji alur transaksi stok dan pencegahan race condition.
- Evaluasi kesesuaian sistem terhadap kebutuhan operasional UMKM.
