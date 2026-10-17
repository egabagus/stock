# Domain Knowledge: Pengelolaan Stok Barang UMKM

Dokumen ini menjelaskan alur bisnis, terminologi, dan logika domain sistem persediaan barang untuk UMKM.

---

## 1. Terminologi Kunci
- **Item / Produk**: Entitas fisik yang dikelola stoknya dalam sistem.
- **SKU (Stock Keeping Unit)**: Kode unik pengenal barang (misal: `BRG-001`, `ELK-029`).
- **Kategori**: Klasifikasi kelompok barang untuk memudahkan filter dan pengorganisasian (misal: Makanan, Minuman, Elektronik).
- **Supplier / Pemasok**: Entitas pihak ketiga atau vendor penyedia barang yang memasok persediaan ke UMKM.
- **Satuan (Unit)**: Satuan ukur barang (misal: Pcs, Box, Lusin, Kg).
- **Stok Aktual (`current_stock`)**: Jumlah fisik barang yang saat ini tersedia dan siap digunakan/dijual.
- **Stok Minimum (`minimum_stock`)**: Batas ambang batas kuantitas minimum. Jika stok aktual $\le$ stok minimum, sistem memicu peringatan stok menipis (*low stock warning*).

---

## 2. Alur Transaksi Persediaan
### A. Barang Masuk (*Stock In*)
- **Pemicu**: Pembelian barang dari pemasok/supplier, retur pelanggan, atau penambahan stok awal.
- **Efek & Nilai Finansial**:
  - Menambah kuantitas `current_stock` pada barang terkait.
  - Mencatat riwayat mutasi: tanggal, supplier terkait (`supplier_id`), jumlah penambahan, nomor referensi/faktur, dan catatan pendukung.
  - Mencatat harga beli satuan aktual (`unit_price`) pada detail transaksi (`stock_transaction_details`) dan menghitung `subtotal` ($\text{quantity} \times \text{unit\_price}$).
  - Akumulasi total belanja pengadaan modal pada header transaksi (`total_amount`).

### B. Barang Keluar (*Stock Out*)
- **Pemicu**: Penjualan ke pelanggan, pemakaian internal, atau kerusakan/kedaluwarsa barang.
- **Efek & Nilai Finansial**:
  - Mengurangi kuantitas `current_stock` pada barang terkait.
  - Sistem memvalidasi ketersediaan stok: kuantitas keluar $\le$ stok aktual saat ini (mencegah stok minus).
  - Mencatat harga jual/nilai acuan per unit (`unit_price`) dan `subtotal` pengeluaran.
  - Menghitung total nilai pengeluaran (`total_amount`) untuk estimasi omzet penjualan atau nilai kerugian (akibat barang rusak/hilang).

---

## 3. Logika Kartu Stok & Monitoring
- **Kartu Stok (Mutasi)**:
  Laporan kronologis pergerakan suatu barang tertentu:
  $$\text{Stok Akhir} = \text{Stok Awal} + \sum \text{Barang Masuk} - \sum \text{Barang Keluar}$$
- **Low Stock Alert**:
  Indikator status persediaan pada dashboard:
  - *Aman*: `current_stock` > `minimum_stock`
  - *Menipis (Warning)*: $0 < \text{current\_stock} \le \text{minimum\_stock}$
  - *Habis (Danger)*: `current_stock` = $0$

---

## 4. Catatan Keuangan & Valuasi Persediaan (*Stock Valuation*)
- **Snapshot Price Pattern**:
  Harga pada detail transaksi (`unit_price`) bersifat permanen (*immutable snapshot*). Jika harga beli di master barang berubah di kemudian hari, nilai riwayat transaksi masa lalu tidak akan terpengaruh.
- **Valuasi Nilai Persediaan**:
  Sistem menghitung estimasi nilai total aset barang yang tersimpan di gudang UMKM:
  $$\text{Nilai Aset Stok} = \sum_{i=1}^{n} (\text{current\_stock}_i \times \text{purchase\_price}_i)$$
- **Rekapitulasi Arus Kas Persediaan**:
  - *Pengeluaran Pembelian*: $\sum \text{total\_amount}$ dari semua transaksi bertipe `IN`.
  - *Nilai Barang Keluar*: $\sum \text{total\_amount}$ dari semua transaksi bertipe `OUT`.
