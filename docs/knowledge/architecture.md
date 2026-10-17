# Architecture Overview

Dokumen ini menjelaskan arsitektur teknis sistem stok barang menggunakan **Laravel + Inertia.js (React) + PostgreSQL**.

---

## 1. Diagram Alur Arsitektur Monolith Modern (Inertia.js)

```
[ Browser / Client ]
       ▲
       │  (JSON via Inertia Protocol / Initial HTML)
       ▼
[ Laravel Routing & Controllers ]
       │
       ├── Form Requests (Validasi)
       ├── Eloquent ORM (Model & Relations)
       └── DB Transactions
               │
               ▼
       [ PostgreSQL Database ]
```

---

## 2. Karakteristik & Keunggulan Pendekatan Inertia.js
- **Tanpa Client-side Routing Terpisah**: Navigasi menggunakan router bawaan Laravel web routes (`web.php`), menyederhanakan autentikasi & middleware session berbasis cookie tanpa kerumitan token JWT.
- **Single Page Application (SPA) Experience**: Pergantian halaman terjadi secara dinamis di sisi klien tanpa *full page reload*.
- **Shared Data via HandleInertiaRequests**:
  - Global user auth (`auth.user`).
  - Flash messages (sukses, error toast) dikirim langsung melalui session flash Laravel dan diakses reaktif di React.

---

## 3. Struktur Direktori Utama
```
stock/
├── app/
│   ├── Http/
│   │   ├── Controllers/       # Controller web/inertia
│   │   ├── Requests/          # Validasi request
│   │   └── Middleware/        # HandleInertiaRequests dll.
│   └── Models/                # Model Eloquent
├── database/
│   ├── migrations/            # Skema tabel PostgreSQL
│   └── seeders/               # Dummy data & initial roles
├── docs/                      # Dokumentasi & Runbook
├── resources/
│   └── js/
│       ├── Components/        # UI components (Button, Modal, Table, etc.)
│       ├── Layouts/           # AuthenticatedLayout, GuestLayout
│       └── Pages/             # Inertia Page Components (Dashboard, Items, etc.)
└── routes/
    └── web.php                # Definisi routing utama
```
