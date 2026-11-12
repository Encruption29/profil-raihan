# AGENTS.md — Konvensi Proyek Web Profil (Encruption)

Panduan untuk coding agent yang bekerja di repo ini. Dirangkum dari:
`andrej-karpathy-skills`, `web-interface-guidelines`, `taste-skill`,
`awesome-design-md` (semuanya di folder induk `web-profil/`).

## Stack

- **Vite + Tailwind CSS v4 + JavaScript vanilla** (tanpa React/Alpine).
- Hasil build (`dist/`) adalah situs statis murni — keamanan & deploy tidak berubah.
- Tema anti-kedip: `public/js/theme.js` dimuat SINKRON di `<head>`, tidak dibundel.

## Prinsip kerja (Karpathy)

1. **Think before coding** — nyatakan asumsi; kalau ragu, tanya. Jangan pilih diam-diam.
2. **Simplicity first** — kode seminimal mungkin; tanpa fitur yang tidak diminta.
3. **Surgical changes** — sentuh hanya yang perlu; jangan "memperbaiki" kode sebelah.
4. **Goal-driven** — sebut kriteria verifikasi tiap langkah, lalu cek sampai lolos.

## Struktur

```
index.html        ← halaman (konten ID + kelas Tailwind)
vite.config.js    ← plugin Tailwind + inject meta CSP saat build
src/style.css     ← @import "tailwindcss" + token Notion + komponen kustom
src/lang.js       ← terjemahan EN saja
src/main.js       ← entry: import style.css & lang.js + interaksi
public/js/theme.js← tema anti-kedip (sinkron, non-module)
public/assets/    ← foto, favicon, CV, tekstur noise.png (disalin apa adanya)
```

## Gaya & sistem desain

- Referensi: `../awesome-design-md-main/design-md/notion/DESIGN.md`
- Semua warna wajib lewat **token CSS** di `:root` / `[data-theme="dark"]`
  (`src/style.css`). Token dipetakan ke utilitas lewat `@theme inline`
  (bg-canvas, text-ink, border-hairline, bg-tint-*, dst.) — dilarang hardcode
  warna baru.
- Komponen kustom (page-bg, wash-*, blob aurora, timeline, marquee, mock UI,
  chips, tints, dsb.) tetap di `src/style.css` layer `components`; state JS
  (scrolled, open, in, aria-current, show) ditulis **di luar layer** agar menang
  atas utilitas Tailwind.
- Latar berlapis (jangan ditumpuk asal): `.page-bg` (grid + noise, fixed,
  z −1) → sapuan `.wash-*` per-section (pseudo `::before` z −1) → blob aurora
  di hero. Warna latar semua lewat token (`--wash-*`, `--blob-*`, `--grid-line`).
- Breakpoint kustom: `tab:` = 821px (nav dropdown mobile); grid keahlian/projek
  memakai `tab:` + `tab:col-span-*` (bento) — jangan campur breakpoint lain agar
  col-span tidak membuat kolom implisit.
- Satu sistem: satu gaya tombol (pill), satu radius, satu bayangan berlapis.
  Tepi kiri-kanan konten selalu sejajar (`.wrap`).
- Tipografi: system font stack (tanpa font eksternal), heading pakai
  `text-wrap: balance`, tanda kutip melengkung “ ”, ellipsis `…`.

## Aturan UI (web-interface-guidelines)

- Fokus keyboard selalu terlihat (`:focus-visible`); dilarang `outline: none`.
- Target sentuh ≥ 44px di mobile (`min-h-11`/`size-11`); `touch-manipulation`
  pada elemen interaktif.
- Gambar wajib punya `width`/`height` eksplisit + `alt`.
- Animasi hanya `transform`/`opacity`; **dilarang** `transition: all` —
  `transition-[properti,satu,per,satu]`; hormati `prefers-reduced-motion`.
- Heading hierarkis (h1 → h2 → h3); skip link; `scroll-mt-[84px]` di section.
- `<a>` untuk navigasi, `<button>` untuk aksi — dilarang `div onClick`.
- Icon-only button wajib `aria-label`.
- Tidak ada dead end: setiap kondisi kosong/gagal punya langkah lanjut.

## Keamanan (jangan pernah dilanggar)

- **Tidak ada** `<style>`/`style="…"`/`<script>` inline di HTML.
  Kelas Tailwind di atribut `class` BOLEH — hasil akhirnya file CSS eksternal.
- CSP: string di `vite.config.js` (meta, disuntik saat build) HARUS sama
  isinya dengan header di `vercel.json` — ubah di dua tempat bila perlu.
  `frame-ancestors` hanya valid lewat header (vercel.json), bukan meta.
- JS hanya lewat `src/*.js` (bundel Vite) & `public/js/theme.js`;
  event pakai `addEventListener` (bukan atribut `onclick`).
- Dilarang `innerHTML` untuk data dinamis — pakai `textContent`/`setAttribute`.
- Semua link keluar: `target="_blank"` + `rel="noopener noreferrer"`.
- Tanpa CDN/library pihak ketiga di runtime; tanpa font eksternal; tanpa API eksternal.
- Tidak menyimpan secret/credential apa pun di repo.

## Bilingual ID/EN

- **Sumber kebenaran teks Indonesia = `index.html`.** Saat halaman dimuat,
  `src/lang.js` menangkap semua teks ID dari DOM sebagai "base"; file itu hanya
  berisi **terjemahan EN**. Mengubah konten = cukup edit `index.html`.
  Teks ID baru tanpa padanan EN tampil apa adanya di mode EN — tambahkan
  kuncinya di objek `en` bila ingin diterjemahkan.
- Elemen diterjemahkan: `data-i18n` (teks), `data-i18n-aria` (aria-label),
  `data-i18n-alt` (alt gambar).
- Nama brand (`Encruption`, `Duck.sc`, `Casa Market`, `Casa Group`) pakai
  `translate="no"` dan tidak diubah penerjemahnya.

## Verifikasi

```bash
cd profil-raihan
export PATH="$HOME/node/bin:$PATH"   # bila Node belum ada di PATH
npm run dev       # http://localhost:5173 — cek toggle tema/bahasa, menu mobile
npm run build     # output dist/ — wajib lolos tanpa error
npm run preview   # http://localhost:4173 — QA dari hasil build
```

Sebelum menyatakan selesai: tidak ada `style="` atau `onclick=` di HTML,
tidak ada `transition: all` di CSS, meta CSP ada di `dist/index.html`,
semua tautan punya tujuan yang benar.
