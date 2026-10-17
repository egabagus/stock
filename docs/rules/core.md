# Core Development Rules

Dokumen ini mendefinisikan aturan dan standar pengembangan untuk project **Sistem Informasi Stok Barang UMKM** berbasis **Laravel + Inertia.js (React) + PostgreSQL**.

---

## 1. Prinsip Utama (Core Principles)
1. **Integritas Data adalah Prioritas #1**:
   - Seluruh mutasi stok (`stock_in`, `stock_out`, penyesuaian) **wajib** dibungkus dalam Database Transaction (`DB::transaction`).
   - Stok fisik **tidak boleh bernilai negatif** (tambahkan validasi aplikasi & constraint PostgreSQL jika relevan).
   - Selalu pertahankan riwayat/audit trail untuk setiap perubahan stok (tidak menghapus riwayat transaksi secara langsung).
2. **KISS & Pragmatis**:
   - Sistem dirancang untuk operasional UMKM, hindari *over-engineering* enterprise/ERP yang berlebihan.
   - Gunakan fitur bawaan Laravel (Form Requests, Eloquent Resources, Observers/Events jika perlu) dan Inertia convention.
3. **Konsistensi UI/UX**:
   - Desain responsif (ramah perangkat desktop kasir/admin maupun mobile/tablet gudang).
   - Berikan feedback yang jelas pada setiap aksi pengguna (toast flash messages, visual badge untuk stok menipis, konfirmasi modal saat aksi destruktif).

---

## 2. Standar Backend (Laravel & PHP)
- **Versi**: PHP 8.2+, Laravel 11+.
- **Naming Conventions**:
  - Controller: `PascalCase` diakhiri dengan `Controller` (contoh: `ItemController`, `StockInController`).
  - Model: Singular `PascalCase` (contoh: `Item`, `Category`, `StockTransaction`).
  - Migration & Table: Plural `snake_case` (contoh: `items`, `stock_transactions`).
  - Foreign Key: `singular_table_id` (contoh: `category_id`, `user_id`).
- **Validasi**:
  - Gunakan `FormRequest` terpisah untuk validasi yang kompleks, jangan menumpuk validasi panjang langsung di Controller.
- **Query & Database**:
  - Hindari problem N+1 dengan memanfaatkan *eager loading* (`with(['category'])`).
  - Manfaatkan fitur PostgreSQL seperti indexed columns untuk pencarian (SKU, nama barang, rentang tanggal transaksi).

---

## 3. Standar Frontend (Inertia.js & React)
- **Komponen & Struktur**:
  - Halaman Inertia diletakkan di `resources/js/Pages/`.
  - Komponen reusable diletakkan di `resources/js/Components/`.
  - Layout utama diletakkan di `resources/js/Layouts/`.
- **Naming Conventions**:
  - Komponen & File: `PascalCase.jsx` atau `PascalCase.tsx`.
- **Handling Form & Request**:
  - Gunakan helper bawaan `@inertiajs/react` seperti `useForm` untuk pengiriman form yang reaktif beserta error handling.
  - Tangani status loading/processing pada tombol submit untuk mencegah *double submit*.
- **Styling & Ikon**:
  - Gunakan Tailwind CSS secara konsisten.
  - Gunakan Lucide React (`lucide-react`) untuk set ikon antarmuka.

---

## 4. Keamanan & Otorisasi
- Terapkan otorisasi berbasis Role (minimal: `admin` dan `staff`).
- Gunakan Laravel Policies / Gates untuk memvalidasi hak akses tindakan kritis (contoh: hanya `admin` yang dapat menghapus master barang atau mengelola akun pengguna).
- Sanitasi input dan proteksi CSRF (otomatis ditangani oleh Inertia + Laravel).
