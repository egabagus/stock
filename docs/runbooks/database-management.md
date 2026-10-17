# Runbook: Database Management (PostgreSQL)

Panduan operasional pengelolaan database PostgreSQL untuk sistem persediaan.

---

## 1. Perintah Migrasi Umum
- **Menjalankan migrasi baru**:
  ```bash
  php artisan migrate
  ```
- **Melihat status migrasi**:
  ```bash
  php artisan migrate:status
  ```
- **Reset dan ulangi semua migrasi + seeder (Fresh DB)**:
  ```bash
  php artisan migrate:fresh --seed
  ```
  *(Perhatian: Perintah ini akan menghapus seluruh data tabel!)*

---

## 2. Backup & Restore Database
- **Backup database ke file `.sql`**:
  ```bash
  pg_dump -U postgres -h 127.0.0.1 -d stock_db > backup_$(date +%Y%m%d).sql
  ```
- **Restore database dari file `.sql`**:
  ```bash
  psql -U postgres -h 127.0.0.1 -d stock_db < backup_file.sql
  ```
