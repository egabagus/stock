# Flowchart Alur Bisnis Sistem Stok Barang UMKM

Dokumen ini memuat diagram alir (*flowchart*) proses bisnis utama sistem stok barang UMKM. Diagram disajikan dalam format **vektor SVG beresolusi tinggi** yang bebas distorsi teks, disertai kode sumber Mermaid untuk kebutuhan dokumentasi.

---

## 1. Flowchart Transaksi Barang Masuk (*Stock In*)

Diagram ini menggambarkan alur pencatatan penerimaan persediaan barang dari supplier, pencatatan harga beli satuan (*unit price*), perhitungan subtotal/total faktur, dan penambahan stok secara atomik.

![Flowchart Transaksi Barang Masuk](./assets/flowchart-stock-in.svg)

<details>
<summary><b>Klik untuk melihat kode Mermaid (Stock In)</b></summary>

```mermaid
flowchart TD
    Start(["Mulai: Input Barang Masuk"]) --> InputForm["Pilih Tanggal, Supplier, & Item Barang"]
    InputForm --> InputQtyPrice["Masukkan Kuantitas Masuk & Harga Beli Satuan (unit_price)"]
    InputQtyPrice --> ValidasiInput{"Validasi Form Input:<br/>Qty > 0 & unit_price >= 0?"}

    ValidasiInput -- Tidak Valid --> ShowError["Tampilkan Pesan Error Validasi"]
    ShowError --> InputForm

    ValidasiInput -- Valid --> CalcSubtotal["Kalkulasi Otomatis:<br/>subtotal = Qty * unit_price & total_amount"]
    CalcSubtotal --> BeginTx["Mulai Database Transaction (DB::transaction)"]
    BeginTx --> SaveHeader["1. Simpan Header Transaksi (stock_transactions)"]
    SaveHeader --> SaveDetails["2. Simpan Detail Item Transaksi (stock_transaction_details)"]
    SaveDetails --> IncrementStock["3. Tambah Stok Fisik pada items (current_stock += Qty)"]
    IncrementStock --> CommitTx["Commit DB Transaction & Update Tampilan"]
    CommitTx --> NotifySuccess["Tampilkan Flash Message Sukses"]
    NotifySuccess --> End(["Selesai"])
```

</details>

---

## 2. Flowchart Transaksi Barang Keluar (*Stock Out*)

Diagram ini menggambarkan alur pengurangan stok akibat penjualan, pemakaian, atau kerusakan barang dengan proteksi stok negatif, kalkulasi finansial, dan penguncian *concurrency* (*pessimistic locking*).

![Flowchart Transaksi Barang Keluar](./assets/flowchart-stock-out.svg)

<details>
<summary><b>Klik untuk melihat kode Mermaid (Stock Out)</b></summary>

```mermaid
flowchart TD
    Start(["Mulai: Input Barang Keluar"]) --> InputForm["Pilih Tanggal, Alasan Keluar, & Barang"]
    InputForm --> InputQtyPrice["Masukkan Kuantitas Keluar & Harga Satuan"]
    InputQtyPrice --> ValidasiFormat{"Validasi Format Input:<br/>Qty > 0 & unit_price >= 0?"}

    ValidasiFormat -- Tidak --> ShowFormatError["Tampilkan Error Format Input"]
    ShowFormatError --> InputForm

    ValidasiFormat -- Ya --> CheckStock{"Pengecekan Stok Fisik:<br/>Qty Keluar <= current_stock?"}

    CheckStock -- Stok Kurang --> ShowStockError["Tampilkan Peringatan: Stok Tidak Cukup!"]
    ShowStockError --> InputForm

    CheckStock -- Stok Cukup --> CalcSubtotalOut["Hitung subtotal & total_amount transaksi"]
    CalcSubtotalOut --> BeginTx["Mulai Database Transaction & lockForUpdate"]
    BeginTx --> SaveHeader["Simpan Header Transaksi (Type: OUT, total_amount)"]
    SaveHeader --> SaveDetails["Simpan Detail Item Transaksi (item_id, Qty, subtotal)"]
    SaveDetails --> DecrementStock["Kurangi Stok Fisik pada items (current_stock -= Qty)"]
    DecrementStock --> CommitTx["Commit Database Transaction"]
    CommitTx --> TriggerAlertCheck{"Cek Ambang Batas:<br/>current_stock <= minimum_stock?"}

    TriggerAlertCheck -- Ya --> TriggerWarning["Tandai Barang Masuk Daftar Peringatan Stok Menipis"]
    TriggerAlertCheck -- Tidak --> FinishSuccess
    TriggerWarning --> FinishSuccess["Tampilkan Flash Notifikasi Berhasil & Redirect"]
    FinishSuccess --> End(["Selesai"])
```

</details>

---

## 3. Flowchart Monitoring Stok & Peringatan Stok Minimum (*Low Stock Alert*)

Diagram ini menggambarkan mekanisme logika sistem dalam mengevaluasi kuantitas stok setiap barang secara berkala untuk menentukan kategori status ketersediaan di Dashboard.

![Flowchart Monitoring & Alert Stok](./assets/flowchart-monitoring-alert.svg)

<details>
<summary><b>Klik untuk melihat kode Mermaid (Monitoring & Alert)</b></summary>

```mermaid
flowchart TD
    Start(["Pengguna Mengakses Dashboard"]) --> FetchItems["Query Data Seluruh Barang & Valuasi Persediaan"]
    FetchItems --> LoopItems{"Evaluasi Tiap Barang"}

    LoopItems --> Condition1{"current_stock == 0?"}
    Condition1 -- Ya --> SetStatusOut["Status: HABIS / KOSONG<br/>(Badge Merah - Kritis)"]

    Condition1 -- Tidak --> Condition2{"current_stock <= minimum_stock?"}
    Condition2 -- Ya --> SetStatusLow["Status: MENIPIS / PERINGATAN<br/>(Badge Kuning - Reorder)"]

    Condition2 -- Tidak --> SetStatusSafe["Status: AMAN / NORMAL<br/>(Badge Hijau)"]

    SetStatusOut --> PushSummary["Kompilasi Metrik Dashboard & Total Valuasi Aset"]
    SetStatusLow --> PushSummary
    SetStatusSafe --> PushSummary

    PushSummary --> RenderUI["Render Kartu Statistik, Grafik Ringkasan, & Tabel Warning di React"]
    RenderUI --> End(["Selesai"])
```

</details>

---

## 4. Flowchart Pembuatan & Ekspor Laporan Persediaan

Diagram ini menggambarkan alur pencarian, filter periode transaksi, kalkulasi rekap finansial, hingga pencetakan dokumen atau ekspor berkas spreadsheet (CSV).

![Flowchart Laporan Persediaan](./assets/flowchart-laporan.svg)

<details>
<summary><b>Klik untuk melihat kode Mermaid (Laporan Persediaan)</b></summary>

```mermaid
flowchart TD
    Start(["Mulai: Buka Menu Laporan"]) --> SelectFilter["Pilih Filter: Rentang Tanggal, Jenis Transaksi, Kategori"]
    SelectFilter --> ClickFilter["Klik Tombol Terapkan Filter"]
    ClickFilter --> QueryDB["Query Data Mutasi & Nilai Finansial PostgreSQL"]
    QueryDB --> CalcSummary["Kalkulasi Ringkasan Qty & Nilai Finansial (Beli & Keluar)"]
    CalcSummary --> RenderReport["Tampilkan Preview Tabel Laporan di Layar"]

    RenderReport --> ChooseAction{"Pilih Tindakan Pengguna"}
    ChooseAction -- Cetak / Print --> PrintView["Buka Halaman Print-Friendly Dialog"]
    ChooseAction -- Ekspor CSV --> ExportCSV["Download File CSV / Spreadsheet"]
    ChooseAction -- Selesai Melihat --> End(["Selesai"])

    PrintView --> End
    ExportCSV --> End
```

</details>
