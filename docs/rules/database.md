# Database & Data Integrity Rules

Dokumen ini mengatur standar pengelolaan basis data PostgreSQL pada sistem inventaris stok barang.

---

## 1. Aturan Skema Database
- Semua tabel wajib memiliki primary key `id` (bigIncrements atau uuid jika diperlukan).
- Foreign key wajib memiliki index dan relasi onDelete yang didefinisikan secara eksplisit (`cascade` atau `restrict`).
  - *Catatan*: Tabel transaksi stok **dilarang** menggunakan `cascade delete` pada `item_id` dan `supplier_id` untuk mencegah terhapusnya riwayat mutasi barang secara tidak sengaja.
- Gunakan tipe data yang presisi:
  - Jumlah stok: `integer` (atau `decimal(10,2)` jika mendukung satuan pecahan seperti kilogram/liter).
  - Harga barang / nilai transaksi: `decimal(12,2)` (harga satuan `unit_price`).
  - Total transaksi: `decimal(14,2)` (`subtotal` pada detail dan `total_amount` pada header). **Dilarang** menggunakan tipe `float` atau `double` guna menghindari kesalahan pembulatan angka desimal.
  - Constraint check: `quantity > 0` dan `unit_price >= 0`.
  - Kode barang (SKU): `string(50)` dengan `unique` constraint.
  - Kode Supplier: `string(50)` dengan `unique` constraint.
  - Status aktif: `boolean` default `true`.

---

## 2. Integritas Transaksi Mutasi Stok & Keuangan
- Mutasi stok dan perhitungan finansial harus selalu bersifat atomik:
  ```php
  DB::transaction(function () use ($data) {
      // 1. Simpan header transaksi (stock_transactions: type, supplier_id, total_amount, user_id)
      // 2. Simpan detail item (stock_transaction_details: item_id, quantity, unit_price, subtotal)
      // 3. Update current_stock pada tabel items (menggunakan lockForUpdate)
  });
  ```
- **Concurrency Control**:
  - Gunakan `Item::where('id', $itemId)->lockForUpdate()->first()` saat memproses transaksi barang keluar untuk mencegah *race condition* stok minus pada akses bersamaan.
