# Milestone 1: Fondasi & Inisialisasi Proyek (`milestone-1-foundation-setup`)

| Informasi | Detail |
|---|---|
| **ID Milestone** | `M1-FOUNDATION` |
| **Status** | 🟢 `COMPLETED` (Selesai Dikerjakan) |
| **Tanggal Dibuat** | 2026-10-11 |
| **Terakhir Diperbarui** | 2026-10-17 |
| **Penanggung Jawab** | Developer |

---

## 1. Ringkasan Eksekutif & Tujuan
Tujuan dari milestone ini adalah mendirikan fondasi teknis sistem informasi stok barang agar siap digunakan untuk pengembangan modul bisnis. Cakupan meliputi inisialisasi framework Laravel, scaffolding Inertia.js dengan React, konfigurasi database PostgreSQL, perancangan layout dasar antarmuka (dashboard shell), serta sistem notifikasi flash messages.

---

## 2. Pembagian Fase Pengerjaan

### Fase 1.1: Scaffolding Proyek & Dependensi Utama
Fokus pada instalasi Laravel terbaru dan starter kit Inertia React.

- [x] **Task 1.1.1**: Inisialisasi kerangka project Laravel di direktori `stock/` tanpa menimpa direktori `docs/` yang sudah ada.
- [x] **Task 1.1.2**: Instalasi dan integrasi **Laravel Breeze** varian React + Inertia.js.
- [x] **Task 1.1.3**: Instalasi dependensi UI frontend tambahan:
  - `lucide-react` (koleksi ikon sistem yang konsisten).
  - `@headlessui/react` (sudah terpasang bawaan Breeze).
- [x] **Task 1.1.4**: Verifikasi Vite build pipeline (`npm run build`).

### Fase 1.2: Konfigurasi Database PostgreSQL & Environment
Fokus pada integrasi database PostgreSQL dan verifikasi konektivitas.

- [x] **Task 1.2.1**: Konfigurasi file `.env` untuk koneksi driver PostgreSQL (`DB_CONNECTION=pgsql`, port `5432`, `DB_DATABASE=stock_db`).
- [x] **Task 1.2.2**: Validasi ketersediaan database PostgreSQL (`stock_db`) dan hak akses pengguna database.
- [x] **Task 1.2.3**: Eksekusi baseline migration bawaan Laravel (`php artisan migrate:fresh`).
- [x] **Task 1.2.4**: Penambahan kolom role pada tabel `users` untuk mendukung role `admin` dan `staff`.

### Fase 1.3: Konfigurasi Shared Data & Flash Messages
Fokus pada komunikasi state antara backend Laravel dan frontend React melalui middleware Inertia.

- [x] **Task 1.3.1**: Modifikasi `HandleInertiaRequests.php` untuk membagikan session flash data (`success`, `error`, `warning`, `info`).
- [x] **Task 1.3.2**: Bagikan informasi user yang sedang login beserta role-nya ke seluruh komponen React via `auth.user`.
- [x] **Task 1.3.3**: Pembuatan komponen React `ToastNotification.jsx` reusable untuk menampilkan flash message tersebut secara otomatis.

### Fase 1.4: Base Layout & Dashboard Shell
Fokus pada kerangka tata letak navigasi yang bersih dan ergonomis bagi pengguna UMKM.

- [x] **Task 1.4.1**: Penyesuaian `AuthenticatedLayout.jsx` dengan logo "Stock UMKM", navigasi responsif, dan dropdown profil.
- [x] **Task 1.4.2**: Pembuatan komponen dasar UI (`Card.jsx`, `Badge.jsx`, `ToastNotification.jsx`).
- [x] **Task 1.4.3**: Penyesuaian tema warna (Tailwind CSS) agar bersih, profesional, dan ramah kasir/staf gudang.

### Fase 1.5: Baseline Verification & Smoke Test
Fokus pada pengujian stabilitas fondasi sebelum masuk ke Milestone 2.

- [x] **Task 1.5.1**: Seeder akun awal: `admin@stock.test` (Admin) dan `staff@stock.test` (Staf Gudang) password: `password`.
- [x] **Task 1.5.2**: Integrasi dengan domain lokal Laravel Herd (`http://stock.test`).
- [x] **Task 1.5.3**: Verifikasi HTTP response 200 OK via curl.


---

## 3. Kriteria Keberhasilan (Definition of Done)
1. Aplikasi dapat berjalan normal via `php artisan serve` dan `npm run dev` tanpa error console.
2. Migrasi awal berhasil dieksekusi di database PostgreSQL.
3. Alur autentikasi (login/logout) berfungsi normal dan me-redirect ke Dashboard.
4. Layout dashboard menampilkan navigasi menu lengkap dan dapat merender konten secara dinamis.
5. Dokumentasi runbook lokal diverifikasi sesuai dengan kondisi ril project.

---

## 4. Risiko & Mitigasi
| Potensi Kendala | Tingkat Risiko | Mitigasi |
|---|---|---|
| Inisialisasi Laravel menimpa folder `docs/` | Sedang | Gunakan instalasi manual / pindahkan atau pertahankan folder `docs/` saat scaffolding. |
| Perbedaan konfigurasi ekstensi PostgreSQL di PHP | Rendah | Pastikan ekstensi `pdo_pgsql` aktif di `php.ini` sebelum eksekusi migrasi. |
| Mismatch versi Node / npm pada Vite build | Rendah | Tetapkan minimum Node.js v18+ pada `package.json` engines. |
