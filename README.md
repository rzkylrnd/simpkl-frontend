# SIMPKL — Sistem Informasi Manajemen Praktik Kerja Lapangan

SIMPKL adalah aplikasi web untuk membantu pengelolaan kegiatan Praktik Kerja Lapangan (PKL). Aplikasi ini dipakai oleh admin, siswa, pembimbing sekolah, dan pembimbing industri untuk mencatat kegiatan harian, memantau kemajuan, memvalidasi data, dan melihat hasil penilaian. Aplikasi berjalan di browser dan terhubung ke backend SIMPKL API yang dijalankan terpisah.

## Fitur Utama

- Login pengguna sesuai role (admin, siswa, pembimbing sekolah, pembimbing industri).
- Dashboard ringkasan kegiatan PKL sesuai hak akses.
- Admin dapat mengelola data pengguna, sekolah, tempat PKL, siswa, penempatan PKL, dan jam presensi.
- Siswa dapat melakukan presensi masuk dan pulang, mengisi jurnal harian, mengajukan izin/sakit, mengunggah laporan akhir, melihat rekap presensi pribadi, dan melihat hasil penilaian.
- Pembimbing sekolah dapat memantau siswa binaan, melihat presensi dan jurnal, memvalidasi laporan akhir, serta menindaklanjuti pengajuan izin/sakit sesuai kewenangan.
- Pembimbing industri dapat memantau siswa binaan, memvalidasi presensi, jurnal, dan izin/sakit, mengisi penilaian PKL, serta melihat rekap presensi.
- Rekap presensi dan tampilan data yang disesuaikan dengan pembagian akses.

## Pengguna dan Akses

- Admin: mengelola data master, jam presensi, dan memantau data kegiatan PKL.
- Siswa: mencatat presensi, jurnal, izin/sakit, mengunggah laporan akhir, dan melihat penilaian serta rekap pribadi.
- Pembimbing Sekolah: memantau siswa binaan, memvalidasi laporan akhir, dan menindaklanjuti pengajuan izin/sakit sesuai aturan sistem.
- Pembimbing Industri: memantau siswa binaan, memvalidasi kegiatan harian, mengisi penilaian, dan melihat rekap presensi.

## Teknologi yang Digunakan

- Vue 3
- Vite
- Vue Router
- Pinia
- Axios
- Tailwind CSS

## Persyaratan

- Node.js versi `^22.18.0` atau `>=24.12.0`
- npm
- SIMPKL API sudah berjalan dan dapat diakses (default: `http://localhost:8000`)
- Database backend sudah siap (termasuk migrasi dan data awal jika diperlukan)

## Instalasi

1. Buka folder project frontend.
2. Pasang paket yang dibutuhkan:

```bash
npm install
```

3. Pastikan backend SIMPKL API sudah berjalan.
4. Sesuaikan konfigurasi koneksi API jika diperlukan (lihat bagian Catatan Konfigurasi).

## Menjalankan Aplikasi

Menjalankan mode pengembangan:

```bash
npm run dev
```

Aplikasi biasanya bisa dibuka di:

```text
http://localhost:5173
```

## Skrip yang Tersedia

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Menjalankan aplikasi saat pengembangan |
| `npm run build` | Membuat versi siap pakai untuk produksi |
| `npm run preview` | Menampilkan hasil build secara lokal |

## Struktur Folder

```text
src/
  assets/        # Berkas statis
  components/    # Komponen yang dipakai ulang
  layouts/       # Kerangka tampilan utama aplikasi
  router/        # Pengaturan halaman/routing
  services/      # Pengaturan komunikasi API (Axios)
  stores/        # State management (Pinia)
  views/         # Halaman-halaman aplikasi
```

## Alur Singkat Penggunaan

1. Pengguna masuk menggunakan akun yang sudah terdaftar.
2. Sistem menampilkan halaman sesuai role pengguna.
3. Admin menyiapkan data master dan pengaturan yang dibutuhkan.
4. Siswa mengisi kegiatan PKL seperti presensi, jurnal, izin/sakit, dan laporan akhir.
5. Pembimbing memantau dan memvalidasi kegiatan siswa binaan sesuai kewenangan.
6. Pembimbing industri mengisi penilaian PKL untuk siswa binaan.
7. Data dapat dipantau melalui dashboard dan rekap presensi.

## Catatan Konfigurasi

- Request API diarahkan melalui proxy Vite:
  - `/api` -> `http://localhost:8000`
  - `/storage` -> `http://localhost:8000`
- Jika backend berjalan di alamat/port berbeda, ubah pengaturan proxy di `vite.config.js`.
- Pastikan backend juga mengizinkan akses dari origin frontend saat diperlukan.

## Masalah Umum

- Tidak bisa login atau data tidak muncul: pastikan backend sudah berjalan dan koneksi API benar.
- File/bukti yang diunggah tidak tampil: pastikan backend dan folder storage sudah dikonfigurasi dengan benar.
- Perubahan konfigurasi belum terasa: hentikan proses development, lalu jalankan kembali `npm run dev`.
- Halaman kosong setelah build: pastikan aplikasi dijalankan melalui server, bukan dengan membuka file `index.html` langsung.

## Pengembangan

Sebelum menyimpan perubahan besar, disarankan untuk menjalankan:

```bash
npm run build
```

Periksa juga hasil tampilan dan alur fitur di browser untuk memastikan tidak ada error.
