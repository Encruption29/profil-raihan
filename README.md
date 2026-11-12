# Web Profil — Raihan Andriyas Prama (Encruption)

Situs profil pribadi single-page: portofolio, lamaran magang, dan latihan.
Dibangun dengan **Vite + Tailwind CSS v4 + JavaScript vanilla** — hasil build tetap
situs statis murni, tanpa resource pihak ketiga.

## ✨ Fitur

- 🎨 Gaya **Notion**: hangat, minimalis, tinta pastel (token di `src/style.css`)
- 🌌 **Latar berlapis**: grid blueprint + noise halus (fixed) → sapuan tint
  per-section → blob aurora yang "bernafas" di hero
- 🧱 **Bento grid** keahlian/projek, **timeline** pendidikan, strip statistik hero
- ✨ Interaksi: progres baca, marquee chips, kilau kartu projek, tombol ke atas
  (semua animasi hanya `transform`/`opacity` dan hormat `prefers-reduced-motion`)
- 🌙 **Dark/Light mode** dengan toggle (tersimpan di `localStorage`, ikut preferensi OS)
- 🌐 **Bilingual ID/EN** dengan toggle (deteksi bahasa browser otomatis)
- ♿ Aksesibel: keyboard penuh, skip link, kontras, `prefers-reduced-motion`
- 🔒 Lapisan keamanan ketat (lihat di bawah)
- 📱 Responsif penuh (desktop → ponsel)

## 📁 Struktur

```
profil-raihan/
├── index.html          ← satu-satunya halaman (kelas Tailwind + konten ID)
├── vite.config.js      ← plugin Tailwind + penyuntik meta CSP saat build
├── package.json        ← skrip dev/build/preview
├── src/
│   ├── style.css       ← @import tailwindcss + token Notion + komponen kustom
│   ├── lang.js         ← terjemahan EN (teks ID dibaca dari index.html)
│   └── main.js         ← entry: import CSS + interaksi halaman
├── public/             ← file statis, disalin apa adanya ke dist/
│   ├── assets/
│   │   ├── foto.png    ← foto profil (512×512, dioptimasi)
│   │   ├── favicon.svg
│   │   ├── noise.png   ← tekstur noise untuk latar (aset sendiri, alpha rendah)
│   │   └── cv/cv-raihan.pdf  ← CV (masih placeholder!)
│   └── js/theme.js     ← tema anti-kedip (sinkron di <head>, tidak dibundel)
├── vercel.json         ← buildCommand + header keamanan (deploy Vercel)
├── AGENTS.md           ← panduan konvensi proyek (untuk AI coding agent)
└── README.md
```

## ▶️ Menjalankan di lokal

Butuh Node.js (terpasang di `~/node`):

```bash
cd profil-raihan
npm install        # sekali saja
npm run dev        # buka http://localhost:5173 (hot reload)
```

Cek hasil build produksi:

```bash
npm run build      # output: dist/
npm run preview    # buka http://localhost:4173
```

## 🚀 Deploy (nanti, setelah CV asli diganti)

1. `git init`, commit, push ke repo GitHub baru (mis. `profil-raihan`)
2. **Vercel**: import repo → deploy otomatis (`vercel.json` mengatur build & header)
3. **GitHub Pages** (opsional): butuh build dulu → pakai GitHub Actions
   (jalanin `npm run build`, publish folder `dist/`) — minta bantuan saya saat waktunya

## 📝 Yang masih perlu diganti sebelum di-share luas

| Apa | Di mana | Nilai sekarang |
|---|---|---|
| CV | `public/assets/cv/cv-raihan.pdf` | halaman placeholder |

> Email, Instagram, kampus, dan angkatan sudah terisi ✓.
> Tip teks: konten Indonesia cukup diedit di `index.html` — `src/lang.js` hanya
> berisi terjemahan Inggris dan **tidak akan menimpa tulisanmu**.

## 🔒 Keamanan

Situs statis murni: tanpa backend, tanpa database, tanpa form. Lapisan yang dipasang:

- **CSP ketat** — `default-src 'none'`; semua aset hanya dari domain sendiri.
  Meta CSP disuntik otomatis saat build oleh `vite.config.js` + header di `vercel.json`.
  ⚠️ Keduanya harus sama isinya — ubah di dua tempat bila perlu.
- **Header keamanan** — `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`, HSTS
- **Link keluar aman** — semua link eksternal `target="_blank"` +
  `rel="noopener noreferrer"`
- **DOM aman** — penerjemahan pakai `textContent`, bukan `innerHTML`
- **HTTPS** — otomatis dari GitHub Pages & Vercel
- **Tanpa dependensi runtime pihak ketiga** — Tailwind & Vite hanya alat build;
  hasil `dist/` nol request keluar
