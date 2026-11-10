/* =============================================================
   FABIEN EMERY — PORTFOLIO JS
   Site 100 % statique (GitHub Pages) : pas de PHP.
   Le formulaire de contact passe par Web3Forms (https://web3forms.com).
   ============================================================= */

(function () {
  "use strict";

  const CONTACT_EMAIL = "fabien.emery@fabienemery.ch";

  /* ── Textes selon la langue de la page ───────────────────── */
  const lang = (document.documentElement.lang || "fr").slice(0, 2);
  const T = {
    fr: {
      required: "Ce champ est requis.",
      email: "Adresse email invalide.",
      short: "Le message doit contenir au moins 20 caractères.",
      ok: "✓ Message envoyé ! Je vous répondrai dans les plus brefs délais.",
      ko: "✗ Erreur lors de l'envoi. Réessayez ou écrivez-moi directement : ",
      mailSubject: "[Portfolio] ",
    },
    en: {
      required: "This field is required.",
      email: "Invalid email address.",
      short: "Your message must be at least 20 characters long.",
      ok: "✓ Message sent! I'll get back to you as soon as possible.",
      ko: "✗ Sending failed. Please try again or email me directly: ",
      mailSubject: "[Portfolio] ",
    },
    de: {
      required: "Dieses Feld ist erforderlich.",
      email: "Ungültige E-Mail-Adresse.",
      short: "Die Nachricht muss mindestens 20 Zeichen enthalten.",
      ok: "✓ Nachricht gesendet! Ich melde mich so schnell wie möglich.",
      ko: "✗ Fehler beim Senden. Bitte erneut versuchen oder direkt schreiben: ",
      mailSubject: "[Portfolio] ",
    },
  }[lang] || null;
  const txt = T || {
    required: "Ce champ est requis.", email: "Adresse email invalide.",
    short: "Le message doit contenir au moins 20 caractères.",
    ok: "✓ Message envoyé !", ko: "✗ Erreur lors de l'envoi : ", mailSubject: "[Portfolio] ",
  };

  /* ── Year ────────────────────────────────────────────────── */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Header scroll shadow ───────────────────────────────── */
  const header = document.getElementById("header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile menu ─────────────────────────────────────────── */
  const navToggle = document.getElementById("navToggle");
  const navMenu   = document.getElementById("navMenu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ── Scroll Reveal ───────────────────────────────────────── */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ── Language switcher cookie ────────────────────────────── */
  document.querySelectorAll(".lang-switcher .lang-btn[href]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const href  = btn.getAttribute("href") || "/";
      const match = href.match(/^\/(en|de|fr)\/?$/);
      const l     = match ? match[1] : "fr";
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = "lang_pref=" + l + "; path=/; expires=" + expires.toUTCString() + "; SameSite=Lax";
    });
  });

  /* ── Contact form (Web3Forms) ────────────────────────────── */
  const form       = document.getElementById("contactForm");
  const submitBtn  = document.getElementById("submitBtn");
  const formStatus = document.getElementById("formStatus");
  if (!form) return;

  const keyInput = form.querySelector('[name="access_key"]');
  const hasKey = keyInput && keyInput.value && !/^YOUR_|^REMPLACER/i.test(keyInput.value);

  function mailtoFallback() {
    const get = (n) => (form.querySelector('[name="' + n + '"]') || {}).value || "";
    const body = get("message") + "\n\n— " + get("name") + (get("company") ? " (" + get("company") + ")" : "") + "\n" + get("email");
    return "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(txt.mailSubject + get("subject")) +
      "&body=" + encodeURIComponent(body);
  }

  function showError() {
    formStatus.innerHTML = "";
    formStatus.append(document.createTextNode(txt.ko));
    const a = document.createElement("a");
    a.href = "mailto:" + CONTACT_EMAIL;
    a.textContent = CONTACT_EMAIL;
    formStatus.append(a);
    formStatus.className = "form__status error";
  }

  function validateField(field) {
    const value = field.value.trim();
    if (field.required && !value) return txt.required;
    if (field.id === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return txt.email;
    if (field.id === "message" && value && value.length < 20) return txt.short;
    return "";
  }

  function setError(field, msg) {
    const errEl = document.getElementById(field.id + "Error");
    field.classList.toggle("is-invalid", !!msg);
    if (errEl) errEl.textContent = msg;
  }

  const visibleFields = () => form.querySelectorAll("input:not([type=hidden]):not([name=botcheck]), textarea, select");

  visibleFields().forEach((field) => {
    field.addEventListener("blur",  () => setError(field, validateField(field)));
    field.addEventListener("input", () => { if (field.classList.contains("is-invalid")) setError(field, validateField(field)); });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Honeypot : un humain ne coche jamais cette case invisible
    const honey = form.querySelector('[name="botcheck"]');
    if (honey && honey.checked) return;

    let valid = true;
    visibleFields().forEach((field) => {
      const err = validateField(field);
      setError(field, err);
      if (err) valid = false;
    });
    if (!valid) return;

    // Pas encore de clé Web3Forms → on ouvre le client mail du visiteur
    if (!hasKey) {
      window.location.href = mailtoFallback();
      return;
    }

    submitBtn.classList.add("loading");
    submitBtn.disabled = true;
    formStatus.className = "form__status";

    try {
      const data = Object.fromEntries(new FormData(form));
      delete data.botcheck;
      data.subject = txt.mailSubject + (data.subject || "") + " — " + (data.name || "");
      data.from_name = "Portfolio fabienemery.ch";
      data.page_language = lang.toUpperCase();

      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        formStatus.textContent = txt.ok;
        formStatus.className = "form__status success";
        form.reset();
      } else {
        throw new Error(json.message || "Erreur serveur");
      }
    } catch (err) {
      showError();
    } finally {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  });
})();
