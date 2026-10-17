# Entity Relationship Diagram (ERD): Sistem Stok Barang

Dokumen ini memuat perancangan struktur relasional basis data PostgreSQL untuk Sistem Informasi Stok Barang UMKM.

---

## 1. Visualisasi ERD (Mermaid)

```mermaid
erDiagram
    USERS ||--o{ STOCK_TRANSACTIONS : "records (mencatat)"
    CATEGORIES ||--o{ ITEMS : "classifies (mengelompokkan)"
    SUPPLIERS ||--o{ STOCK_TRANSACTIONS : "supplies (memasok)"
    ITEMS ||--o{ STOCK_TRANSACTION_DETAILS : "referenced_in (tercantum)"
    STOCK_TRANSACTIONS ||--|{ STOCK_TRANSACTION_DETAILS : "has_details (memiliki item)"

    USERS {
        bigint id PK
        varchar name
        varchar email UK
        varchar password
        varchar role "admin / staff"
        timestamp created_at
        timestamp updated_at
    }

    CATEGORIES {
        bigint id PK
        varchar name
        varchar slug UK
        text description "nullable"
        timestamp created_at
        timestamp updated_at
    }

    SUPPLIERS {
        bigint id PK
        varchar code UK "contoh: SUP-001"
        varchar name
        varchar contact_person "nullable"
        varchar phone "nullable"
        varchar email "nullable"
        text address "nullable"
        text notes "nullable"
        boolean is_active "default: true"
        timestamp created_at
        timestamp updated_at
    }

    ITEMS {
        bigint id PK
        bigint category_id FK
        varchar sku UK "contoh: BRG-001"
        varchar name
        varchar unit "pcs, box, kg"
        decimal purchase_price "nullable"
        decimal selling_price "nullable"
        integer current_stock "default: 0"
        integer minimum_stock "default: 5"
        text description "nullable"
        timestamp created_at
        timestamp updated_at
    }

    STOCK_TRANSACTIONS {
        bigint id PK
        varchar transaction_number UK "TRX-IN-... / TRX-OUT-..."
        varchar type "IN / OUT"
        date date
        bigint supplier_id FK "nullable (diisi saat type IN)"
        bigint user_id FK "user yang mencatat"
        decimal total_amount "total nilai uang transaksi, default: 0.00"
        text notes "nullable"
        timestamp created_at
        timestamp updated_at
    }

    STOCK_TRANSACTION_DETAILS {
        bigint id PK
        bigint stock_transaction_id FK
        bigint item_id FK
        integer quantity "jumlah barang masuk/keluar"
        decimal unit_price "harga satuan saat transaksi terjadi"
        decimal subtotal "total per baris: quantity * unit_price"
        text notes "nullable"
        timestamp created_at
        timestamp updated_at
    }
```

---

## 2. Kamus Data (Data Dictionary)

### A. Tabel `users`
Menyimpan data otentikasi dan otorisasi pengguna sistem.
- `id` (PK, BigInteger, Auto Increment)
- `name` (VARCHAR 255): Nama lengkap pengguna.
- `email` (VARCHAR 255, Unique): Alamat email untuk login.
- `password` (VARCHAR 255): Hash kata sandi akun (Bcrypt/Argon2).
- `role` (VARCHAR 50): Peran pengguna (`admin` atau `staff`).

### B. Tabel `categories`
Menyimpan klasifikasi barang agar mudah difilter.
- `id` (PK, BigInteger, Auto Increment)
- `name` (VARCHAR 100): Nama kategori (contoh: *Bahan Pokok*, *Kemasan*).
- `slug` (VARCHAR 120, Unique): Identifier URL / slug.
- `description` (TEXT, Nullable): Deskripsi singkat kategori.

### C. Tabel `suppliers`
Menyimpan data pemasok untuk transaksi pengadaan barang masuk.
- `id` (PK, BigInteger, Auto Increment)
- `code` (VARCHAR 50, Unique): Kode unik supplier (contoh: `SUP-001`).
- `name` (VARCHAR 255): Nama supplier / nama CV/PT/Toko.
- `contact_person` (VARCHAR 150, Nullable): Nama PIC / sales.
- `phone` (VARCHAR 30, Nullable): Nomor HP / WhatsApp.
- `email` (VARCHAR 255, Nullable): Email resmi supplier.
- `address` (TEXT, Nullable): Alamat pengiriman / kantor.
- `notes` (TEXT, Nullable): Catatan kerja sama atau rekening pembayaran.
- `is_active` (BOOLEAN, Default `true`): Status aktif.

### D. Tabel `items`
Menyimpan master data persediaan barang fisik.
- `id` (PK, BigInteger, Auto Increment)
- `category_id` (FK -> `categories.id`, OnDelete Restrict)
- `sku` (VARCHAR 50, Unique): Stock Keeping Unit pengenal unik barang.
- `name` (VARCHAR 255): Nama barang.
- `unit` (VARCHAR 50): Satuan barang (`pcs`, `kg`, `box`, dll).
- `purchase_price` (DECIMAL 12,2, Nullable): Estimasi harga beli acuan.
- `selling_price` (DECIMAL 12,2, Nullable): Estimasi harga jual acuan.
- `current_stock` (INTEGER, Default 0): Jumlah stok aktual saat ini.
- `minimum_stock` (INTEGER, Default 5): Ambang batas peringatan stok menipis.
- `description` (TEXT, Nullable): Keterangan spesifikasi barang.

### E. Tabel `stock_transactions`
Header transaksi pergerakan persediaan (Barang Masuk atau Barang Keluar) beserta nilai finansial.
- `id` (PK, BigInteger, Auto Increment)
- `transaction_number` (VARCHAR 60, Unique): Nomor transaksi otomatis (misal: `IN-20261012-001`).
- `type` (VARCHAR 10): Jenis transaksi (`IN` untuk Masuk, `OUT` untuk Keluar).
- `date` (DATE): Tanggal terjadinya transaksi fisik.
- `supplier_id` (FK -> `suppliers.id`, Nullable, OnDelete Restrict): Supplier asal barang (diisi jika `type = IN`).
- `user_id` (FK -> `users.id`, OnDelete Restrict): Akun staf/admin yang mencatat transaksi.
- `total_amount` (DECIMAL 14,2, Default 0.00): Akumulasi nilai uang keseluruhan transaksi (total pembelian atau total nilai pengeluaran barang).
- `notes` (TEXT, Nullable): Keterangan / alasan pengeluaran / nomor faktur manual.

### F. Tabel `stock_transaction_details`
Detail item barang, kuantitas, serta harga satuan dan subtotal transaksi.
- `id` (PK, BigInteger, Auto Increment)
- `stock_transaction_id` (FK -> `stock_transactions.id`, OnDelete Cascade)
- `item_id` (FK -> `items.id`, OnDelete Restrict)
- `quantity` (INTEGER): Kuantitas barang yang berpindah (wajib > 0).
- `unit_price` (DECIMAL 12,2, Default 0.00): Harga satuan aktual saat transaksi terjadi (*snapshot price*).
- `subtotal` (DECIMAL 14,2, Default 0.00): Total nilai baris item (`quantity * unit_price`).
- `notes` (TEXT, Nullable): Catatan per item (kondisi barang, diskon per item, dll).
