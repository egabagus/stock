# Milestone 2: Master Data & Fitur CRUD Supplier (`milestone-2-supplier-and-master-data`)

| Informasi | Detail |
|---|---|
| **ID Milestone** | `M2-MASTER-DATA-SUPPLIER` |
| **Status** | 🟡 `PLANNED` (Siap Dikerjakan) |
| **Tanggal Dibuat** | 2026-10-12 |
| **Terakhir Diperbarui** | 2026-10-12 |
| **Penanggung Jawab** | Developer |

---

## 1. Ringkasan Eksekutif & Tujuan
Milestone ini berfokus pada pembangunan modul Master Data, dengan penekanan utama pada **Pengelolaan Data Supplier (Pemasok)** serta entitas master pendukung (Kategori Barang & Data Barang). Supplier merupakan entitas krusial yang menghubungkan proses pengadaan dan pencatatan transaksi **Barang Masuk (*Stock In*)** pada operasional UMKM.

---

## 2. Struktur Data Supplier (`suppliers`)

### Skema Tabel PostgreSQL
| Kolom | Tipe Data | Keterangan & Constraint |
|---|---|---|
| `id` | `bigserial` | Primary Key |
| `code` | `varchar(50)` | Unik, auto-generated atau manual (contoh: `SUP-001`) |
| `name` | `varchar(255)` | Nama supplier/badan usaha (wajib) |
| `contact_person` | `varchar(150)` | Nama PIC / sales representative (opsional) |
| `phone` | `varchar(30)` | Nomor HP / WhatsApp aktif (opsional) |
| `email` | `varchar(255)` | Alamat email (opsional, validasi email) |
| `address` | `text` | Alamat gudang/kantor supplier (opsional) |
| `notes` | `text` | Catatan termin kerja sama / info rekening (opsional) |
| `is_active` | `boolean` | Status keaktifan (default: `true`) |
| `created_at` / `updated_at` | `timestamp` | Standar Laravel timestamps |

---

## 3. Pembagian Fase Pengerjaan

### Fase 2.1: Skema Database & Model Supplier
Fokus pada pembuatan migration, model Eloquent, factory, dan seeder data awal.

- [ ] **Task 2.1.1**: Buat migrasi `create_suppliers_table` dengan indeks pada kolom `code` dan `name`.
- [ ] **Task 2.1.2**: Buat model `Supplier` beserta cast atribut (`is_active` -> `boolean`) dan fillable properties.
- [ ] **Task 2.1.3**: Buat relasi `hasMany` ke transaksi barang masuk (`stock_transactions`).
- [ ] **Task 2.1.4**: Buat `SupplierSeeder` dengan 5-10 contoh profil supplier realistis UMKM (distributor bahan, kemasan, grosir).

### Fase 2.2: Backend Controller & Validasi (Form Request)
Fokus pada logika bisnis CRUD dan proteksi integritas data.

- [ ] **Task 2.2.1**: Buat Form Request `StoreSupplierRequest` & `UpdateSupplierRequest`:
  - `code`: required, string, max 50, unique (ignore ID on update).
  - `name`: required, string, max 255.
  - `phone`: nullable, string, max 30.
  - `email`: nullable, email, max 255.
  - `is_active`: boolean.
- [ ] **Task 2.2.2**: Buat `SupplierController`:
  - `index`: Pencarian (*search* nama/kode), filter status aktif, dan paginasi data.
  - `store`: Penyimpanan supplier baru + flash message sukses.
  - `update`: Pembaruan profil supplier.
  - `destroy`: Hapus supplier dengan validasi integritas (mencegah hapus jika supplier sudah tercatat dalam riwayat barang masuk; sarankan deaktifasi `is_active=false`).
- [ ] **Task 2.2.3**: Daftarkan routes resource di `routes/web.php` dengan middleware auth.

### Fase 2.3: Frontend Antarmuka Pengguna (Inertia + React)
Fokus pada halaman pengelolaan supplier yang cepat, informatif, dan responsif.

- [ ] **Task 2.3.1**: Buat halaman `resources/js/Pages/Suppliers/Index.jsx`:
  - Tabel data supplier dengan kolom: Kode, Nama, PIC, Kontak/Telepon, Status, Aksi.
  - Search bar interaktif dengan debounced search.
  - Filter toggle supplier aktif/non-aktif.
  - Badge status aktif (hijau) / non-aktif (abu-abu).
- [ ] **Task 2.3.2**: Buat komponen Form Modal / Slide-over untuk Create & Edit Supplier:
  - Integrasi hook `useForm` dari `@inertiajs/react`.
  - Tampilan error validasi form real-time.
  - Action loading spinner pada tombol submit.
- [ ] **Task 2.3.3**: Modal konfirmasi sebelum menghapus atau menonaktifkan supplier.
- [ ] **Task 2.3.4**: Integrasikan menu "Supplier" pada navigasi sidebar di `AuthenticatedLayout.jsx`.

### Fase 2.4: Integrasi dengan Master Data Lainnya & Barang Masuk
Fokus pada keterhubungan data supplier dengan modul barang dan transaksi persediaan.

- [ ] **Task 2.4.1**: Sediakan endpoint/prop ringan untuk dropdown pilihan supplier (hanya yang `is_active = true`) pada form Barang Masuk (*Stock In*).
- [ ] **Task 2.4.2**: Pengujian skenario pembuatan transaksi barang masuk menggunakan relasi `supplier_id`.

---

## 4. Contoh Data Dummy Supplier (Seeder Plan)
| Kode | Nama Pemasok | PIC | No. Telepon | Jenis Pasokan |
|---|---|---|---|---|
| `SUP-001` | PT Sumber Makmur Sentosa | Budi Santoso | 0812-3456-7890 | Distributor Utama Bahan Pokok |
| `SUP-002` | CV Berkah Kemasan Nusantara | Siti Rahma | 0813-8899-1122 | Supplier Box & Packaging |
| `SUP-003` | UD Jaya Abadi Logistik | Hendra Wijaya | 0817-2233-4455 | Supplier Perlengkapan & ATK |
| `SUP-004` | Koperasi Tani Subur | Pak Slamet | 0852-6677-8899 | Bahan Baku Segar Lokal |

---

## 5. Kriteria Keberhasilan (Definition of Done)
1. Seluruh operasi CRUD (Create, Read, Update, Delete/Deactivate) supplier berjalan mulus tanpa reload halaman.
2. Filter pencarian berdasarkan nama dan kode supplier bekerja secara instan.
3. Supplier yang memiliki riwayat transaksi terlindungi dari penghapusan permanen secara tidak sengaja.
4. Tersedia data seeder supplier untuk kemudahan pengujian awal dan demonstrasi sistem.
