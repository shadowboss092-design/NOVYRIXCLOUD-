document.addEventListener("DOMContentLoaded", () => {
  const cfg = window.NOVYRIX_CONFIG || {};
  document.querySelectorAll("[data-brand]").forEach(el => el.textContent = cfg.brand || "NOVYRIXCLOUD");
  document.querySelectorAll("[data-logo]").forEach(el => { if (cfg.logo) el.src = cfg.logo; });
  document.querySelectorAll("[data-discord]").forEach(el => el.href = cfg.discord || "#");
  document.querySelectorAll("[data-email]").forEach(el => el.href = "mailto:" + (cfg.supportEmail || "support@example.com"));
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
  const loader = document.querySelector(".loader");
  window.setTimeout(() => loader?.classList.add("done"), 520);
  const toggle = document.querySelector(".menu-toggle"), nav = document.querySelector(".nav-links");
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.innerHTML = open ? "&#10005;" : "&#9776;";
  });
  nav?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${Math.min(index * 55, 220)}ms`;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }), {threshold:.12});
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
  } else document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
  const top = document.querySelector(".to-top");
  window.addEventListener("scroll", () => top?.classList.toggle("show", window.scrollY > 420), {passive:true});
  top?.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));
  const planRoot = document.querySelector("[data-plans]");
  if (planRoot && cfg.plans) {
    const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
    let livePlans = cfg.plans;
    const render = (filter = "All") => {
      planRoot.innerHTML = livePlans.filter(p => filter === "All" || (p.type || p.category) === filter).map((p, i) => `
        <article class="plan-card reveal ${p.badge === "POPULAR" ? "featured" : ""}">
          ${p.badge ? `<span class="tag">${p.badge}</span>` : `<span class="tag">${p.type || p.category}</span>`}
          <h3>${escapeHTML(p.name)}</h3>
          <div class="price">${p.price === 0 ? "FREE" : `${Number(p.price).toLocaleString()} ${cfg.currency || "PKR"}`}<small>${p.price === 0 ? "" : p.unit}</small></div>
          <div class="plan-specs"><div><small>MEMORY</small><strong>${escapeHTML(p.ram)}</strong></div><div><small>CPU</small><strong>${escapeHTML(p.cpu)}</strong></div><div><small>STORAGE</small><strong>${escapeHTML(p.storage)}</strong></div><div><small>SUPPORT</small><strong>Community</strong></div></div>
          <ul>${p.features.map(f => `<li>${escapeHTML(f)}</li>`).join("")}</ul>
          <a class="btn ${p.badge === "POPULAR" ? "btn-primary" : "btn-secondary"}" href="${cfg.discord || "#"}" target="_blank" rel="noopener">Get this plan ↗</a>
        </article>`).join("");
      planRoot.querySelectorAll(".reveal").forEach(el => requestAnimationFrame(() => el.classList.add("visible")));
    };
    fetch("/api/plans").then(r => r.ok ? r.json() : Promise.reject()).then(data => { if (Array.isArray(data.plans)) { livePlans = data.plans; render(document.querySelector("[data-filter].active")?.dataset.filter || "All"); } }).catch(() => {});
    render();
    document.querySelectorAll("[data-filter]").forEach(btn => btn.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach(b => b.classList.toggle("active", b === btn));
      render(btn.dataset.filter);
    }));
  }
});
