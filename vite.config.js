import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

/*
  CSP produksi — HARUS sama isinya dengan header di vercel.json.
  Disuntik sebagai <meta> saat `npm run build` (produksi tetap terkunci),
  sementara `npm run dev` sengaja bebas CSP agar HMR Vite bisa jalan.
*/
const CSP =
  "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'";

export default defineConfig({
  plugins: [
    tailwindcss(),
    {
      name: "inject-csp-meta",
      apply: "build",
      transformIndexHtml() {
        return [
          {
            tag: "meta",
            attrs: { "http-equiv": "Content-Security-Policy", content: CSP },
            injectTo: "head-prepend",
          },
        ];
      },
    },
  ],
});
