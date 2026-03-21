// ── PAGE LOAD INTRO ───────────────────────────────────────────────
const introOverlay = document.getElementById("introOverlay");
window.addEventListener("load", () => {
  setTimeout(() => { introOverlay.classList.add("hidden"); }, 1800);
});

// ── SCROLL PROGRESS ───────────────────────────────────────────────
const scrollProgress = document.getElementById("scrollProgress");
window.addEventListener("scroll", () => {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  scrollProgress.style.width = pct + "%";
}, { passive: true });

// ── BACK TO TOP ───────────────────────────────────────────────────
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 400);
}, { passive: true });
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ── TYPING ────────────────────────────────────────────────────────
const words = ["AI Engineer","Machine Learning Developer","Cyber Security Enthusiast","Computer Vision Developer"];
let i = 0, j = 0, isDeleting = false;

function type() {
  const word = words[i];
  if (isDeleting) { j--; } else { j++; }
  document.getElementById("typing").textContent = word.substring(0, j);
  if (!isDeleting && j === word.length) { isDeleting = true; setTimeout(type, 1000); return; }
  if (isDeleting && j === 0) { isDeleting = false; i = (i + 1) % words.length; }
  setTimeout(type, isDeleting ? 60 : 120);
}
type();

// ── PARTICLES ─────────────────────────────────────────────────────
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize();
window.addEventListener("resize", resize);

const particles = Array.from({ length: 120 }, () => ({
  x: Math.random() * canvas.width, y: Math.random() * canvas.height,
  r: Math.random() * 2 + 0.5,
  dx: (Math.random() - 0.5) * 0.8, dy: (Math.random() - 0.5) * 0.8
}));

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "#00f7ff"; ctx.fill();
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0) p.x = canvas.width;  if (p.x > canvas.width)  p.x = 0;
    if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ── CURSOR + COMET TRAIL ──────────────────────────────────────────
const dot  = document.getElementById("cursor-dot");
const ring = document.getElementById("cursor-ring");
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0, dotX = 0, dotY = 0;

const TRAIL_LENGTH = 14;
const trailPositions = Array(TRAIL_LENGTH).fill({ x: 0, y: 0 });
const trailDots = Array.from({ length: TRAIL_LENGTH }, (_, idx) => {
  const el = document.createElement("div");
  el.className = "comet-dot";
  const size = Math.max(2, 8 - idx * 0.5);
  el.style.cssText = `
    width:${size}px; height:${size}px;
    background:${idx < 4 ? "#00f7ff" : idx < 9 ? "#7b61ff" : "#ff61d8"};
    box-shadow: 0 0 ${size*2}px ${idx < 4 ? "#00f7ff" : "#7b61ff"}88;
    opacity:${(1 - idx / TRAIL_LENGTH) * 0.75};
    mix-blend-mode:screen;
  `;
  document.body.appendChild(el);
  return el;
});

document.addEventListener("mousemove", e => { mouseX = e.clientX; mouseY = e.clientY; });

(function cursorLoop() {
  dotX  += (mouseX - dotX)  * 0.9;
  dotY  += (mouseY - dotY)  * 0.9;
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;
  dot.style.left  = dotX  + "px"; dot.style.top  = dotY  + "px";
  ring.style.left = ringX + "px"; ring.style.top = ringY + "px";
  trailPositions.unshift({ x: dotX, y: dotY });
  trailPositions.length = TRAIL_LENGTH;
  trailDots.forEach((el, idx) => {
    const pos = trailPositions[idx] || { x: dotX, y: dotY };
    el.style.left = pos.x + "px"; el.style.top = pos.y + "px";
  });
  requestAnimationFrame(cursorLoop);
})();

document.querySelectorAll("a, button, .card-btn, .tags span, .project-card, .hack-card, .cert-card, .achieve-card, .navbar a, .contact-links a, .modal-close").forEach(el => {
  el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
  el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
});
document.addEventListener("mousedown", () => document.body.classList.add("cursor-click"));
document.addEventListener("mouseup",   () => document.body.classList.remove("cursor-click"));

// ── 3D TILT CARDS ─────────────────────────────────────────────────
document.querySelectorAll(".project-card").forEach(card => {
  const shine = document.createElement("div");
  shine.className = "card-shine";
  card.appendChild(shine);
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width/2);
    const dy = e.clientY - (rect.top  + rect.height/2);
    card.style.transform = `perspective(800px) rotateX(${-(dy/(rect.height/2))*14}deg) rotateY(${(dx/(rect.width/2))*14}deg) scale(1.04)`;
    shine.style.setProperty("--mx", ((e.clientX-rect.left)/rect.width*100)+"%");
    shine.style.setProperty("--my", ((e.clientY-rect.top)/rect.height*100)+"%");
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform  = "perspective(800px) rotateX(0) rotateY(0) scale(1)";
    card.style.transition = "transform 0.5s ease, border-color 0.4s, background 0.4s, box-shadow 0.4s";
  });
  card.addEventListener("mouseenter", () => { card.style.transition = "border-color 0.4s, background 0.4s, box-shadow 0.4s"; });
});

// ── MAGNETIC BUTTONS ──────────────────────────────────────────────
document.querySelectorAll(".hero-buttons a, .card-btn, .modal-btn, .contact-links a, .back-to-top").forEach(btn => {
  btn.addEventListener("mousemove", e => {
    const r = btn.getBoundingClientRect();
    btn.style.transform  = `translate(${(e.clientX-(r.left+r.width/2))*0.38}px,${(e.clientY-(r.top+r.height/2))*0.38}px) scale(1.06)`;
    btn.style.transition = "transform 0.1s ease";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform  = "translate(0,0) scale(1)";
    btn.style.transition = "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)";
  });
});

// ── BUTTON CLICK FX ───────────────────────────────────────────────
const BURST_COLORS = ["#00f7ff","#7b61ff","#ffffff","#00ffaa","#ff61d8"];

function spawnRipple(el, e) {
  const rect = el.getBoundingClientRect(), size = Math.max(rect.width, rect.height);
  const r = document.createElement("span"); r.className = "ripple";
  r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;
  el.appendChild(r); r.addEventListener("animationend", () => r.remove());
}

function spawnShockwave(e) {
  const sw = document.createElement("div"); sw.className = "shockwave";
  sw.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;`;
  document.body.appendChild(sw); sw.addEventListener("animationend", () => sw.remove());
}

function spawnBurst(e) {
  for (let k = 0; k < 14; k++) {
    const bd = document.createElement("div"); bd.className = "burst-dot";
    const angle = (k/14)*2*Math.PI, dist = 55+Math.random()*50;
    bd.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;background:${BURST_COLORS[Math.floor(Math.random()*BURST_COLORS.length)]};--tx:${Math.cos(angle)*dist}px;--ty:${Math.sin(angle)*dist}px;--dur:${0.45+Math.random()*0.3}s;`;
    document.body.appendChild(bd); bd.addEventListener("animationend", () => bd.remove());
  }
}

function spawnGlitch(el) {
  const f = document.createElement("div"); f.className = "glitch-flash";
  el.appendChild(f); f.addEventListener("animationend", () => f.remove());
}

function spawnPress(el) {
  el.classList.remove("btn-press"); void el.offsetWidth; el.classList.add("btn-press");
  el.addEventListener("animationend", () => el.classList.remove("btn-press"), { once: true });
}

function triggerButtonFX(el, e) { spawnRipple(el,e); spawnShockwave(e); spawnBurst(e); spawnGlitch(el); spawnPress(el); }

document.querySelectorAll(".hero-buttons a, .card-btn, .modal-btn, .modal-close, .contact-links a, .back-to-top").forEach(btn => {
  btn.addEventListener("click", e => triggerButtonFX(btn, e));
});

document.querySelectorAll(".navbar a").forEach(link => {
  link.addEventListener("click", e => {
    const sw = document.createElement("span"); sw.className = "nav-sweep";
    link.appendChild(sw); sw.addEventListener("animationend", () => sw.remove());
    spawnShockwave(e); spawnBurst(e);
  });
});

// ── NAVBAR ACTIVE ─────────────────────────────────────────────────
const navLinks    = document.querySelectorAll(".navbar a[href^='#']");
const navSections = [...navLinks].map(l => document.querySelector(l.getAttribute("href"))).filter(Boolean);

function updateActiveNav() {
  let current = "";
  navSections.forEach(sec => { if (sec.getBoundingClientRect().top <= window.innerHeight * 0.4) current = sec.id; });
  navLinks.forEach(l => { l.classList.remove("active"); if (l.getAttribute("href") === `#${current}`) l.classList.add("active"); });
}
window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();

// ── SCROLL REVEAL ─────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.style.opacity = "1"; entry.target.style.transform = "translateY(0)"; }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".section").forEach(s => {
  s.style.opacity = "0"; s.style.transform = "translateY(40px)"; s.style.transition = "opacity 0.7s ease, transform 0.7s ease";
  revealObserver.observe(s);
});

// ── TIMELINE REVEAL ───────────────────────────────────────────────
const timelineObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) setTimeout(() => entry.target.classList.add("visible"), idx * 150);
  });
}, { threshold: 0.2 });

document.querySelectorAll(".timeline-item").forEach(item => timelineObserver.observe(item));

// ── PROJECT MODAL ─────────────────────────────────────────────────
const overlay  = document.getElementById("modalOverlay");
const closeBtn = document.getElementById("modalClose");

function openModal(card) {
  document.getElementById("modalIcon").textContent  = card.dataset.icon;
  document.getElementById("modalTitle").textContent = card.dataset.title;
  document.getElementById("modalTech").textContent  = card.dataset.tech;
  document.getElementById("modalDesc").textContent  = card.dataset.desc;
  document.getElementById("modalGithub").href       = card.dataset.github;
  const list = document.getElementById("modalPoints");
  list.innerHTML = "";
  JSON.parse(card.dataset.points).forEach(pt => { const li = document.createElement("li"); li.textContent = pt; list.appendChild(li); });
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
  const modalBtn = document.getElementById("modalGithub");
  if (modalBtn) {
    modalBtn.addEventListener("mousemove", e => {
      const r = modalBtn.getBoundingClientRect();
      modalBtn.style.transform  = `translate(${(e.clientX-(r.left+r.width/2))*0.38}px,${(e.clientY-(r.top+r.height/2))*0.38}px) scale(1.06)`;
      modalBtn.style.transition = "transform 0.1s ease";
    });
    modalBtn.addEventListener("mouseleave", () => { modalBtn.style.transform = "translate(0,0) scale(1)"; modalBtn.style.transition = "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)"; });
    modalBtn.addEventListener("click", e => triggerButtonFX(modalBtn, e));
    modalBtn.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    modalBtn.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  }
}

function closeModal() { overlay.classList.remove("active"); document.body.style.overflow = ""; }

document.querySelectorAll(".card-btn").forEach(btn => btn.addEventListener("click", () => openModal(btn.closest(".project-card"))));
closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });