/* Toggle bahasa Indonesia / English.
   ---------------------------------------------------------------
   SUMBER KEBENARAN: teks Indonesia dibaca LANGSUNG dari index.html
   saat halaman dimuat (base). File ini hanya berisi terjemahan EN.
   Jadi mengubah konten = cukup edit index.html, tidak akan ditimpa.
   Aman-CSP: penggantian teks lewat textContent/setAttribute saja.
   --------------------------------------------------------------- */
(function () {
  "use strict";

  var KEY = "encruption-lang";

  /* Teks dasar (ID) ditangkap dari DOM */
  var base = { text: {}, aria: {}, alt: {}, title: "", desc: "" };

  /* Terjemahan Inggris — hanya kunci yang beda dari teks dasar */
  var en = {
    "meta.title": "Raihan Andriyas Prama — Information Systems Student",
    "meta.desc":
      "Portfolio of Raihan Andriyas Prama (Encruption) — an Information Systems student who keeps growing, member of the Duck.sc study club web design class. Explore my projects, skills, and contacts.",

    "skip": "Skip to main content",
    "live.lang": "Language switched to English",

    "nav.aria": "Main navigation",
    "nav.about": "About",
    "nav.edu": "Education",
    "nav.skills": "Skills",
    "nav.projects": "Projects",
    "nav.contact": "Contact",

    "theme.btn": "Toggle light/dark theme",
    "lang.btn": "Switch language Indonesian/English",
    "menu.btnOpen": "Open navigation menu",
    "menu.btnClose": "Close navigation menu",

    "hero.eyebrow": "Hi, I’m",
    "hero.alias": "a.k.a.",
    "hero.role": "Information Systems student · Member of the Duck.sc study club — web design class",
    "hero.tagline":
      "Someone who keeps growing: learning the basics, trying to build, then improving again — one small step every day.",
    "hero.cta.cv": "Download CV",
    "hero.cta.contact": "Contact Me",
    "hero.photoAlt": "Profile photo of Raihan Andriyas Prama",
    "hero.stat.sem": "Semester 3",
    "hero.stat.projects": "2 Projects",
    "hero.stat.club": "1 Study Club",

    "marquee.aria": "Tools I work with",

    "about.label": "01 · About",
    "about.h2": "About Me",
    "about.p1":
      "I’m Raihan, a 3rd-semester Information Systems student at Universitas Lancang Kuning who believes learning has no finish line. To me, growing isn’t about becoming perfect quickly — it’s about moving one level up every day.",
    "about.p2":
      "I’m currently a member of the Duck.sc study club in its web design class — diving into HTML, CSS, and JavaScript while building a portfolio through small projects, from inventory systems to an online store. My favorite moment is when an idea on paper finally becomes something people can see, use, and benefit from.",
    "about.p3":
      "Looking ahead, I want to become a developer who not only writes code, but also understands how information systems can solve real problems.",

    "edu.label": "02 · Education",
    "edu.h2": "Education",
    "edu.uni.name": "Universitas Lancang Kuning",
    "edu.uni.degree": "Information Systems",
    "edu.uni.years": "Class of 2025",
    "edu.uni.status": "Semester 3 · current",
    "edu.duck.name": "Duck.sc Study Club",
    "edu.duck.role": "Member — Web Design Class",
    "edu.duck.years": "present",
    "edu.duck.desc":
      "Deepening web interface design and sharpening frontend fundamentals together with fellow members.",

    "skills.label": "03 · Skills",
    "skills.h2": "Skills",
    "skills.intro": "The tools I use to learn and build.",
    "skills.tech": "Technical",
    "skills.design": "Design & Creative",
    "skills.soft": "Productivity & Teamwork",
    "skills.learning": "learning",
    "skills.teamwork": "Teamwork",

    "projects.label": "04 · Projects",
    "projects.h2": "Projects",
    "projects.intro": "A few things I’ve built — the full code is open on GitHub.",
    "projects.p1.desc":
      "An inventory system for Casa Market: tracking incoming and outgoing goods and remaining stock.",
    "projects.p2.desc":
      "An online store for Casa Group: a product catalog with a simple, easy-to-use shopping flow.",
    "projects.link": "View on GitHub",
    "projects.more": "More projects on GitHub",

    "contact.label": "05 · Contact",
    "contact.h2": "Contact",
    "contact.intro":
      "Interested in talking about the web, information systems, or internship opportunities? You can reach me via:",
    "contact.email.label": "Email",
    "contact.ig.label": "Instagram",
    "contact.gh.label": "GitHub",

    "footer.rights": "© 2026 Raihan Andriyas Prama",
    "footer.built": "Built with Vite & Tailwind CSS",
    "footer.code": "Source code",

    "totop.btn": "Back to top",
  };

  function captureBase() {
    var i, key;

    var nodes = document.querySelectorAll("[data-i18n]");
    for (i = 0; i < nodes.length; i++) {
      key = nodes[i].getAttribute("data-i18n");
      base.text[key] = nodes[i].textContent;
    }

    var labelled = document.querySelectorAll("[data-i18n-aria]");
    for (i = 0; i < labelled.length; i++) {
      key = labelled[i].getAttribute("data-i18n-aria");
      base.aria[key] = labelled[i].getAttribute("aria-label");
    }

    var alts = document.querySelectorAll("[data-i18n-alt]");
    for (i = 0; i < alts.length; i++) {
      key = alts[i].getAttribute("data-i18n-alt");
      base.alt[key] = alts[i].getAttribute("alt");
    }

    base.title = document.title;
    var md = document.querySelector('meta[name="description"]');
    base.desc = md ? md.getAttribute("content") : "";
  }

  function saved() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function detect() {
    var first =
      (navigator.languages && navigator.languages[0]) || navigator.language || "id";
    return String(first).toLowerCase().indexOf("en") === 0 ? "en" : "id";
  }

  var lang = saved() || detect();

  function apply() {
    var isEn = lang === "en";

    document.documentElement.lang = lang;
    document.title = isEn ? (en["meta.title"] || base.title) : base.title;

    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", isEn ? (en["meta.desc"] || base.desc) : base.desc);

    var i, node, key, value;

    var nodes = document.querySelectorAll("[data-i18n]");
    for (i = 0; i < nodes.length; i++) {
      key = nodes[i].getAttribute("data-i18n");
      value = isEn ? (en[key] != null ? en[key] : base.text[key]) : base.text[key];
      if (value != null) nodes[i].textContent = value;
    }

    var labelled = document.querySelectorAll("[data-i18n-aria]");
    for (i = 0; i < labelled.length; i++) {
      key = labelled[i].getAttribute("data-i18n-aria");
      value = isEn ? (en[key] != null ? en[key] : base.aria[key]) : base.aria[key];
      if (value != null) labelled[i].setAttribute("aria-label", value);
    }

    var alts = document.querySelectorAll("[data-i18n-alt]");
    for (i = 0; i < alts.length; i++) {
      key = alts[i].getAttribute("data-i18n-alt");
      value = isEn ? (en[key] != null ? en[key] : base.alt[key]) : base.alt[key];
      if (value != null) alts[i].setAttribute("alt", value);
    }

    var lb = document.getElementById("lang-label");
    if (lb) lb.textContent = lang === "id" ? "EN" : "ID";

    var live = document.getElementById("live-status");
    if (live) live.textContent = isEn ? en["live.lang"] : "Bahasa diubah ke Indonesia";
  }

  function init() {
    captureBase();

    var btn = document.getElementById("lang-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        lang = lang === "id" ? "en" : "id";
        try {
          localStorage.setItem(KEY, lang);
        } catch (e) {
          /* abaikan */
        }
        apply();
      });
    }
    apply();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
