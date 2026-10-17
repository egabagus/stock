# Development Workflow

Panduan alur kerja pengembangan fitur dan siklus perbaikan kode.

---

## 1. Alur Pembuatan Fitur Baru
1. **Analisis Kebutuhan**:
   - Pahami kebutuhan data, validasi, dan perilaku interaksi UI.
2. **Database Migration & Model**:
   - Buat migration file: `php artisan make:migration create_xxx_table`.
   - Definisikan tipe data, index, dan constraint foreign key PostgreSQL.
   - Buat Model dan relasi Eloquent terkait.
3. **Controller & Form Request**:
   - Buat FormRequest untuk validasi input: `php artisan make:request XxxRequest`.
   - Buat Controller: implementasikan method `index`, `create`, `store`, `edit`, `update`, `destroy`.
   - Gunakan `DB::transaction` untuk operasi yang menyentuh tabel transaksi stok.
4. **Antarmuka Pengguna (Inertia + React)**:
   - Buat atau perbarui file page di `resources/js/Pages/Xxx/`.
   - Hubungkan form dengan hook `useForm` dari `@inertiajs/react`.
   - Pastikan komponen reusable (Button, Input, Alert, Modal) digunakan secara konsisten.
5. **Verifikasi & Testing**:
   - Uji skenario sukses (happy path).
   - Uji skenario gagal (input tidak valid, stok tidak mencukupi, duplikasi SKU).

---

## 2. Standar Commit Git
Gunakan format conventional commit yang jelas:
- `feat: add stock in transaction module`
- `fix: prevent negative stock value on checkout`
- `refactor: extract stock badge component`
- `docs: update runbook for postgres setup`
