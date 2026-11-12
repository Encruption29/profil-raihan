/* Entry Vite — menggabungkan:
   1. style.css : Tailwind CSS + design-token Notion (light/dark)
   2. lang.js   : toggle bahasa ID/EN (src/lang.js)
   3. Interaksi : scroll (header, progres baca, ke-atas), menu mobile,
                  nav aktif, reveal, kilau kartu projek
   Semua opsional — halaman tetap berfungsi tanpa JS. */

import "./style.css";
import "./lang.js";

(function () {
  "use strict";

  var d = document;

  /* ---------- Scroll: garis header, progres baca, tombol ke atas ---------- */
  var header = d.getElementById("site-header");
  var progress = d.getElementById("scroll-progress");
  var toTop = d.getElementById("to-top");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function updateProgress() {
    if (!progress) return;
    var max = d.documentElement.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? window.scrollY / max : 0;
    if (ratio < 0) ratio = 0;
    if (ratio > 1) ratio = 1;
    progress.style.transform = "scaleX(" + ratio + ")";
  }

  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
    updateProgress();
    if (toTop) toTop.classList.toggle("show", window.scrollY > 600);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion.matches ? "auto" : "smooth",
      });
    });
  }

  /* ---------- Menu mobile (pola disclosure, bukan modal) ---------- */
  var toggle = d.getElementById("menu-toggle");
  var nav = d.getElementById("site-nav");

  function isOpen() {
    return toggle && toggle.getAttribute("aria-expanded") === "true";
  }

  function setMenu(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    var en = document.documentElement.lang === "en";
    toggle.setAttribute(
      "aria-label",
      open ? (en ? "Close navigation menu" : "Tutup menu navigasi")
           : (en ? "Open navigation menu" : "Buka menu navigasi")
    );
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(!isOpen());
    });

    // Klik link di dalam menu → tutup menu
    nav.addEventListener("click", function (e) {
      if (e.target && e.target.closest && e.target.closest("a")) setMenu(false);
    });

    // Escape → tutup menu dan kembalikan fokus ke tombol
    d.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) {
        setMenu(false);
        toggle.focus();
      }
    });

    // Layar melebar kembali → reset menu
    var mq = window.matchMedia("(min-width: 821px)");
    var onChange = function (ev) {
      if (ev.matches) setMenu(false);
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ---------- Tautan nav aktif mengikuti section di tengah layar ---------- */
  var links = Array.prototype.slice.call(d.querySelectorAll('.nav-list a[href^="#"]'));
  var byId = {};
  links.forEach(function (a) {
    byId[a.getAttribute("href").slice(1)] = a;
  });

  function clearCurrent() {
    links.forEach(function (a) {
      a.removeAttribute("aria-current");
    });
  }

  var sections = Array.prototype.slice.call(d.querySelectorAll("main section[id]"));
  if ("IntersectionObserver" in window && sections.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          if (en.target.id === "atas") {
            clearCurrent(); // masih di hero → tidak ada link yang aktif
            return;
          }
          var link = byId[en.target.id];
          if (link) {
            clearCurrent();
            link.setAttribute("aria-current", "location");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      io.observe(s);
    });
  }

  /* ---------- Reveal: elemen muncul halus saat masuk layar ---------- */
  var reveals = Array.prototype.slice.call(d.querySelectorAll("[data-reveal]"));
  reveals.forEach(function (el) {
    el.style.setProperty("--reveal-delay", el.getAttribute("data-reveal-delay") || "0");
  });

  if ("IntersectionObserver" in window) {
    var ro = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            ro.unobserve(en.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) {
      ro.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* ---------- Kilau kartu projek mengikuti kursor (perangkat pointer saja) ---------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var glowCards = Array.prototype.slice.call(d.querySelectorAll(".project-card"));
    glowCards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        if (!r.width || !r.height) return;
        card.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%");
        card.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 100).toFixed(1) + "%");
      });
    });
  }
})();
