/* Tema light/dark — dimuat SINKRON di <head> agar halaman tidak kedip
   saat pertama dibuka. Membaca preferensi tersimpan, lalu preferensi OS. */
(function () {
  "use strict";

  var KEY = "encruption-theme";
  var root = document.documentElement;

  function savedTheme() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null; // mode privat / storage diblokir → lanjut tanpa simpan
    }
  }

  function systemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);

    // Warna UI browser (bilah atas ponsel) ikut tema yang dipilih
    var color = theme === "dark" ? "#191919" : "#ffffff";
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) {
      metas[i].setAttribute("content", color);
    }
  }

  function announce(theme) {
    var live = document.getElementById("live-status");
    if (!live) return;
    var en = document.documentElement.lang === "en";
    live.textContent = theme === "dark" ? (en ? "Dark theme on" : "Tema gelap aktif")
                                        : (en ? "Light theme on" : "Tema terang aktif");
  }

  // Tandai "js aktif" — gerbang animasi reveal (halaman tetap tampil tanpa JS)
  root.classList.add("js");

  var theme = savedTheme() || systemTheme();
  applyTheme(theme);

  function initToggle() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      theme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(theme);
      try {
        localStorage.setItem(KEY, theme);
      } catch (e) {
        /* abaikan */
      }
      announce(theme);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initToggle);
  } else {
    initToggle();
  }
})();
