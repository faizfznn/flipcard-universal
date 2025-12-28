---

# Web Kartu Acak (Card Shuffle)

**Web Kartu Acak** adalah aplikasi berbasis web yang memungkinkan pengguna untuk mengelola dan mengambil kartu secara acak dari sebuah dek. Aplikasi ini dirancang agar fleksibel, di mana data kartu dapat diimpor dari berbagai sumber seperti Google Sheets, file Excel, maupun ditambahkan secara manual.

## Fitur Utama

* **Integrasi Google Sheets**: Mengambil data kartu secara dinamis langsung dari Google Sheets melalui URL Web App.
* **Impor File Excel**: Mendukung unggahan file format `.xlsx` atau `.xls` untuk mengisi dek kartu secara instan.
* **Penambahan Manual**: Input kartu satu per satu langsung melalui antarmuka aplikasi.
* **Animasi Pengocokan**: Fitur pengambilan kartu dilengkapi dengan efek visual pengocokan sebelum menampilkan hasil.
* **Antarmuka Responsif**: Desain yang bersih dan mudah digunakan untuk berbagai perangkat.

## Teknologi yang Digunakan

* **React.js (v19.2.0)**: Framework utama untuk membangun antarmuka pengguna.
* **XLSX (SheetJS)**: Library untuk memproses dan membaca file Excel.
* **CSS3**: Digunakan untuk styling dan animasi pengocokan kartu.

## Persiapan dan Instalasi

Langkah-langkah untuk menjalankan proyek ini secara lokal:

1. **Clone repositori:**
```bash
git clone https://github.com/username/nama-repo.git

```


2. **Masuk ke direktori proyek:**
```bash
cd cardshuffle

```


3. **Instal dependensi:**
```bash
npm install

```


4. **Jalankan aplikasi:**
```bash
npm start

```


Aplikasi akan berjalan di [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000).

## Konfigurasi Google Sheets

Agar fitur "Muat dari GSheet" berfungsi dengan baik, pengguna perlu melakukan konfigurasi berikut pada Google Sheet mereka:

1. Pastikan data kartu berada di **Kolom A**.
2. Buka **Extensions > Apps Script** di Google Sheet.
3. Gunakan kode `doGet` dan pastikan pengaturan **CORS** (`.setHeader()`) telah dikonfigurasi agar mengizinkan akses dari domain luar.
4. Aktifkan runtime **V8** di Apps Script.
5. Lakukan **Deploy** sebagai **Web App**.
6. Atur izin akses ("Who has access") ke **"Anyone"**.
7. Salin URL Web App yang dihasilkan dan tempelkan ke dalam input aplikasi.

## Skrip yang Tersedia

* `npm start`: Menjalankan aplikasi dalam mode pengembangan.
* `npm run build`: Membangun aplikasi untuk produksi ke folder `build`.
* `npm test`: Menjalankan pengujian (test runner).

---

Dokumentasi ini dibuat untuk mempermudah pemahaman alur kerja dan fitur yang tersedia dalam proyek **Web Kartu Acak**.
