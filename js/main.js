// ===========================================================
// 1. Menu, header and small page helpers (every page)
// ===========================================================
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");

function setMenu(open) {
  nav.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.querySelector(".nav-toggle-text").textContent = open ? "Close" : "Menu";
  document.body.classList.toggle("menu-open", open);
}
toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// Thin line under the header once the page scrolls
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Sections fade up as they scroll into view; items in the same row are staggered
const revealTargets = document.querySelectorAll(".section-head, .reason, .stop, .quote, .stage, .service, .fact, .inc-list li, .gl-item, .person, .side-card, .salary-photo, .table-card, .statement-text, .photo-band-text");
if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -10% 0px" });
  revealTargets.forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => c.matches(el.tagName));
    el.style.setProperty("--d", Math.min(sibs.indexOf(el), 6) * 0.07 + "s");
    el.classList.add("reveal");
    io.observe(el);
  });
}

// Gentle parallax on large photos
const parallax = [...document.querySelectorAll(".hero-photo img, .wide-photo img, .photo-band > img")];
if (parallax.length && !reduceMotion) {
  parallax.forEach((img) => img.setAttribute("data-parallax", ""));
  let ticking = false;
  const move = () => {
    const vh = window.innerHeight;
    parallax.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const progress = (r.top + r.height / 2 - vh / 2) / vh;   // -1 .. 1 around the centre
      img.style.transform = `translateY(${progress * -40}px) scale(1.08)`;
    });
    ticking = false;
  };
  // start after the unveil animation, so the two do not fight
  setTimeout(() => {
    parallax.forEach((img) => { img.style.animation = "none"; });
    move();
    window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(move); ticking = true; } }, { passive: true });
    window.addEventListener("resize", move);
  }, 1400);
}

// ===========================================================
// 1a. Richer motion: progress bar, counters, card glow and tilt, step line
// ===========================================================
// Scroll progress line at the very top
const bar = document.querySelector(".scroll-progress");
if (bar) {
  const setBar = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  setBar();
  addEventListener("scroll", setBar, { passive: true });
  addEventListener("resize", setBar);
}

// Numbers count up when they appear (e.g. €5,700+)
const counters = document.querySelectorAll("[data-count]");
if (counters.length && "IntersectionObserver" in window && !reduceMotion) {
  const fmt = (n) => n.toLocaleString("en-US");
  const co = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target, end = +el.dataset.count, pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
      const t0 = performance.now(), dur = 1600;
      const step = (t) => {
        const k = Math.min((t - t0) / dur, 1), ease = 1 - Math.pow(1 - k, 3);
        el.textContent = pre + fmt(Math.round(end * ease)) + (k === 1 ? suf : "");
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      co.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => co.observe(el));
}

// The six step line fills with colour when it comes into view
document.querySelectorAll(".line").forEach((line) => {
  if (!("IntersectionObserver" in window) || reduceMotion) { line.classList.add("drawn"); return; }
  const lo = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { line.classList.add("drawn"); lo.disconnect(); }
  }, { threshold: 0.35 });
  lo.observe(line);
});

// Cards: a soft light follows the cursor, and they tilt slightly (mouse only)
const cards = document.querySelectorAll(".reason, .service, .quote, .person, .stage, .gl-item, .inc-list li, .side-card, .price-card, .pill-list li");
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
cards.forEach((card) => {
  card.classList.add("glow");
  const tiltable = finePointer && !reduceMotion && !card.matches(".stage, .gl-item, .side-card, .price-card");
  if (tiltable) card.classList.add("tilt");
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    card.style.setProperty("--mx", x + "px");
    card.style.setProperty("--my", y + "px");
    if (tiltable) {
      card.style.setProperty("--ry", ((x / r.width) - 0.5) * 6 + "deg");
      card.style.setProperty("--rx", (0.5 - (y / r.height)) * 6 + "deg");
    }
  });
  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  });
});

// ===========================================================
// 1b. "Is Germany right for you?" self check (pathway page)
// ===========================================================
const check = document.getElementById("selfcheck");
if (check) {
  const boxes = check.querySelectorAll("input[type=checkbox]");
  const bar = check.querySelector(".meter span");
  const out = check.querySelector(".selfcheck-text");
  const update = () => {
    const n = [...boxes].filter((b) => b.checked).length;
    bar.style.width = (n / boxes.length) * 100 + "%";
    if (n === 0) out.textContent = "Tick the statements that are true for you.";
    else if (n <= 2) out.textContent = "Germany may still work for you, but some groundwork comes first. A consultation helps you see what.";
    else if (n <= 4) out.innerHTML = 'You look like a good fit. Let us check the details together. <a href="contact.html">Book a free consultation</a>';
    else out.innerHTML = 'You are ready to start. <a href="contact.html">Book your free consultation</a>';
  };
  boxes.forEach((b) => b.addEventListener("change", update));
}

// ===========================================================
// 2. Contact and free consultation form -> Supabase
// ===========================================================
const form = document.getElementById("contact-form");
if (form) {
const statusEl = form.querySelector(".form-status");
const submitBtn = form.querySelector("button[type=submit]");
const BTN_TEXT = submitBtn.textContent;
const cfg = window.SITE_CONFIG || {};

const configured =
  cfg.SUPABASE_URL && !cfg.SUPABASE_URL.includes("YOUR-PROJECT") &&
  cfg.SUPABASE_ANON_KEY && !cfg.SUPABASE_ANON_KEY.startsWith("YOUR-");

const db = configured && window.supabase ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;

function setStatus(text, type) {
  statusEl.textContent = text;
  statusEl.className = "form-status " + (type || "");
}

function validate(d) {
  const errors = [];
  form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
  const mark = (id, msg) => {
    document.getElementById(id).setAttribute("aria-invalid", "true");
    errors.push(msg);
  };
  if (d.full_name.length < 2) mark("full_name", "Enter your full name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) mark("email", "Enter a valid email address.");
  if (!/^\+?[0-9\s()-]{7,20}$/.test(d.whatsapp)) mark("whatsapp", "Enter your WhatsApp number with country code.");
  if (d.country.length < 2) mark("country", "Enter the country you live in.");
  if (!d.professional_status) mark("professional_status", "Choose your current professional status.");
  if (!d.qualification) mark("qualification", "Choose your medical qualification.");
  if (!d.start_timeline) mark("start_timeline", "Choose when you plan to start.");
  if (!d.preferred_time) mark("preferred_time", "Choose the best time to call you.");
  if (d.topic.length < 3) mark("topic", "Tell us what you would like to discuss.");
  if (d.heard_from.length < 2) mark("heard_from", "Tell us how you heard about Northstar.");
  if (!d.updates_answer) mark("wants_updates", "Choose whether you would like updates from Northstar.");
  if (!d.consent) mark("consent", "Tick the box to agree to the privacy policy.");
  return errors;
}

// Pick an answer by pressing its letter (A, B, C…) while inside a question
form.addEventListener("keydown", (e) => {
  const group = e.target.closest(".choice-group");
  if (!group || e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
  const idx = e.key.toUpperCase().charCodeAt(0) - 65;
  const inputs = group.querySelectorAll("input[type=radio]");
  if (idx >= 0 && idx < inputs.length) {
    e.preventDefault();
    inputs[idx].checked = true;
    inputs[idx].focus();
    group.removeAttribute("aria-invalid");
  }
});
form.addEventListener("change", (e) => {
  const group = e.target.closest(".choice-group");
  if (group) group.removeAttribute("aria-invalid");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = new FormData(form);

  // Bots fill the hidden field; pretend success and store nothing
  if (f.get("website")) {
    form.reset();
    setStatus("Request sent. We will contact you on WhatsApp to fix a time.", "ok");
    return;
  }

  const text = (k) => (f.get(k) || "").toString().trim();
  const data = {
    full_name: text("full_name"),
    email: text("email").toLowerCase(),
    whatsapp: text("whatsapp"),
    country: text("country"),
    professional_status: text("professional_status"),
    qualification: text("qualification"),
    start_timeline: text("start_timeline"),
    preferred_time: text("preferred_time"),
    topic: text("topic"),
    heard_from: text("heard_from"),
    wants_updates: f.get("wants_updates") === "yes",
    updates_answer: f.get("wants_updates") || "",
    consent: f.get("consent") === "on"
  };

  const errors = validate(data);
  if (errors.length) {
    setStatus(errors[0], "error");
    const bad = form.querySelector("[aria-invalid=true]");
    (bad.matches("fieldset") ? bad.querySelector("input") : bad).focus();
    bad.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    return;
  }

  if (!db) {
    setStatus("The form is not connected yet. Add your Supabase URL and key in js/config.js.", "error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";
  setStatus("");

  // Insert only; the public is not allowed to read rows back
  delete data.updates_answer;   // only used for the check above
  const { error } = await db.from(cfg.TABLE).insert(data);

  submitBtn.disabled = false;
  submitBtn.textContent = BTN_TEXT;

  if (error) {
    console.error(error);
    setStatus("Your request was not sent. Check your connection and try again, or message us on WhatsApp.", "error");
    return;
  }

  form.reset();
  setStatus("Request sent. We will contact you on WhatsApp within one working day to fix a time for your free consultation.", "ok");
});
}
