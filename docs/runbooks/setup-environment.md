# Runbook: Setup Local Development Environment

Petunjuk langkah demi langkah menyiapkan lingkungan pengembangan lokal untuk proyek Stok Barang.

---

## 1. Prasyarat Sistem (Prerequisites)
Pastikan dependensi berikut sudah terinstal pada mesin lokal:
- **PHP**: versi >= 8.2 (dengan ekstensi: `pdo_pgsql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`)
- **Composer**: versi >= 2.x
- **Node.js**: versi >= 18.x (LTS) & NPM / PNPM
- **PostgreSQL**: versi >= 14.x (berjalan secara lokal atau via Docker)

---

## 2. Langkah Setup Proyek

### A. Inisialisasi Project (Saat pertama kali)
```bash
# Di direktori stock/
composer create-project laravel/laravel .
composer require laravel/breeze --dev
php artisan breeze:install react
npm install
```

### B. Konfigurasi Environment (`.env`)
Salin file `.env.example` ke `.env` (jika belum ada) dan sesuaikan konfigurasi koneksi PostgreSQL:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=stock_db
DB_USERNAME=postgres
DB_PASSWORD=secret
```

### C. Persiapan Database
Buat database di PostgreSQL:
```bash
# Contoh menggunakan psql:
createdb -U postgres stock_db
```

Jalankan migrasi dan seeder:
```bash
php artisan migrate --seed
```

### D. Menjalankan Aplikasi
Buka dua terminal terpisah:
- **Terminal 1 (Backend)**:
  ```bash
  php artisan serve
  ```
- **Terminal 2 (Frontend Dev Server)**:
  ```bash
  npm run dev
  ```

Akses sistem di browser: `http://localhost:8000`.
