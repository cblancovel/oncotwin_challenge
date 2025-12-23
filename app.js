const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value ?? "";
}

function safeLink(el, url) {
  if (!el) return;
  if (!url || String(url).trim() === "") {
    el.setAttribute("aria-disabled", "true");
    el.classList.add("is-disabled");
    el.removeAttribute("href");
    el.style.opacity = "0.55";
    el.style.pointerEvents = "none";
    return;
  }
  el.href = url;
}

function renderBadges(badges = []) {
  const wrap = $("#heroBadges");
  if (!wrap) return;
  wrap.innerHTML = "";
  badges.forEach((b) => {
    const span = document.createElement("span");
    span.className = "badge";
    span.textContent = b;
    wrap.appendChild(span);
  });
}

function renderDeliverables(items = []) {
  const ul = $("#deliverablesList");
  if (!ul) return;
  ul.innerHTML = "";
  items.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    ul.appendChild(li);
  });
}

function renderMiniStrip(items = []) {
  const wrap = $("#miniStrip");
  if (!wrap) return;
  wrap.innerHTML = "";
  items.slice(0, 3).forEach((it) => {
    const div = document.createElement("div");
    div.className = "mini";
    div.innerHTML = `<div class="mini__k">${it.k}</div><div class="mini__v">${it.v}</div>`;
    wrap.appendChild(div);
  });
}

function renderCards(containerId, cards = []) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  wrap.innerHTML = "";
  cards.forEach((c) => {
    const div = document.createElement("div");
    div.className = "card";
    const meta = (c.tags || []).map(t => `<span class="pill2">${t}</span>`).join("");
    div.innerHTML = `
      <h3>${c.title}</h3>
      <p>${c.text}</p>
      ${meta ? `<div class="meta">${meta}</div>` : ""}
    `;
    wrap.appendChild(div);
  });
}

function renderTracks(tracks = []) {
  const wrap = $("#tracksGrid");
  if (!wrap) return;
  wrap.innerHTML = "";
  tracks.forEach((t) => {
    const meta = (t.tags || []).map(x => `<span class="pill2">${x}</span>`).join("");
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${t.title}</h3>
      <p>${t.text}</p>
      <div class="meta">${meta}</div>
    `;
    wrap.appendChild(div);
  });
}

function renderTimeline(slots = []) {
  const wrap = $("#programTimeline");
  if (!wrap) return;
  wrap.innerHTML = "";
  slots.forEach((s) => {
    const div = document.createElement("div");
    div.className = "slot";
    div.innerHTML = `
      <div class="slot__time">${s.time}</div>
      <div>
        <div class="slot__title">${s.title}</div>
        <p class="slot__desc">${s.text}</p>
      </div>
    `;
    wrap.appendChild(div);
  });
}

function renderProjects(projects = []) {
  const wrap = $("#projectsGrid");
  if (!wrap) return;

  const make = (p) => {
    const div = document.createElement("div");
    div.className = "card";
    div.dataset.category = p.category || "all";
    const meta = (p.tags || []).map(t => `<span class="pill2">${t}</span>`).join("");
    const links = (p.links || []).map(l => `<a class="pill2" href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`).join("");
    div.innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.text}</p>
      ${(meta || links) ? `<div class="meta">${meta}${links}</div>` : ""}
    `;
    return div;
  };

  wrap.innerHTML = "";
  projects.forEach(p => wrap.appendChild(make(p)));

  // filter chips
  const chips = $$(".chip");
  chips.forEach(ch => {
    ch.addEventListener("click", () => {
      chips.forEach(x => x.classList.remove("chip--active"));
      ch.classList.add("chip--active");

      const f = ch.dataset.filter;
      $$("#projectsGrid .card").forEach(card => {
        const cat = card.dataset.category;
        card.style.display = (f === "all" || cat === f) ? "" : "none";
      });
    });
  });
}

function renderCollaborators(items = []) {
  const wrap = $("#collaboratorsGrid");
  if (!wrap) return;
  wrap.innerHTML = "";

  items.forEach((c) => {
    const div = document.createElement("div");
    div.className = "logoItem";

    if (c.logo) {
      const img = document.createElement("img");
      img.src = c.logo;
      img.alt = c.name;
      div.appendChild(img);
    } else {
      const span = document.createElement("span");
      span.textContent = c.name;
      div.appendChild(span);
    }

    if (c.url) {
      const a = document.createElement("a");
      a.href = c.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.style.position = "absolute";
      a.style.inset = "0";
      a.style.borderRadius = "16px";
      a.setAttribute("aria-label", `Abrir ${c.name}`);
      div.appendChild(a);
    }

    wrap.appendChild(div);
  });
}

function renderRegisterBullets(items = []) {
  const wrap = $("#registerBullets");
  if (!wrap) return;
  wrap.innerHTML = "";
  items.forEach((t) => {
    const span = document.createElement("span");
    span.className = "pill2";
    span.textContent = t;
    wrap.appendChild(span);
  });
}

function renderFAQ(items = []) {
  const wrap = $("#faqList");
  if (!wrap) return;
  wrap.innerHTML = "";

  items.forEach((it, idx) => {
    const div = document.createElement("div");
    div.className = "faqItem";
    div.dataset.open = "false";

    const btn = document.createElement("button");
    btn.className = "faqQ";
    btn.type = "button";
    btn.innerHTML = `<div>${it.q}</div><span>+</span>`;

    const ans = document.createElement("div");
    ans.className = "faqA";
    ans.textContent = it.a;

    btn.addEventListener("click", () => {
      const open = div.dataset.open === "true";
      div.dataset.open = open ? "false" : "true";
      btn.querySelector("span").textContent = open ? "+" : "–";
    });

    if (idx === 0) {
      div.dataset.open = "true";
      btn.querySelector("span").textContent = "–";
    }

    div.appendChild(btn);
    div.appendChild(ans);
    wrap.appendChild(div);
  });
}

function setupMobileMenu() {
  const btn = $(".hamburger");
  const menu = $("#mobileMenu");
  if (!btn || !menu) return;

  const close = () => {
    menu.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  };

  btn.addEventListener("click", () => {
    const open = menu.hidden === false;
    menu.hidden = open;
    btn.setAttribute("aria-expanded", String(!open));
  });

  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
  window.addEventListener("scroll", close, { passive: true });
}

async function loadContent() {
  const res = await fetch("content.json", { cache: "no-store" });
  const data = await res.json();

  // Hero
  setText("heroPill", data.hero?.pill);
  setText("heroTitle", data.hero?.title);
  setText("heroSubtitle", data.hero?.subtitle);
  setText("heroLead", data.hero?.lead);

  setText("eventDate", data.event?.date);
  setText("eventLocation", data.event?.location);
  setText("eventTeams", data.event?.teams);

  renderBadges(data.hero?.badges || []);
  setText("heroTag", data.hero?.tag);

  renderDeliverables(data.hero?.deliverables || []);
  renderMiniStrip(data.hero?.mini || []);

  setText("stat1n", data.hero?.stats?.[0]?.n);
  setText("stat1l", data.hero?.stats?.[0]?.l);
  setText("stat2n", data.hero?.stats?.[1]?.n);
  setText("stat2l", data.hero?.stats?.[1]?.l);
  setText("stat3n", data.hero?.stats?.[2]?.n);
  setText("stat3l", data.hero?.stats?.[2]?.l);

  // About cards
  setText("aboutLead", data.about?.lead);
  renderCards("aboutCards", data.about?.cards || []);

  // Tracks
  renderTracks(data.tracks || []);

  // Program
  renderTimeline(data.program || []);

  // Projects
  renderProjects(data.projects || []);

  // Collaborators
  renderCollaborators(data.collaborators || []);
  setText("collaborateText", data.collaborate?.text);
  const collabCta = $("#collaborateCta");
  if (collabCta) safeLink(collabCta, data.collaborate?.ctaUrl || collabCta.href);

  // Register
  setText("registerTitle", data.register?.title);
  setText("registerText", data.register?.text);
  renderRegisterBullets(data.register?.bullets || []);
  const regBtn = $("#registerCta");
  if (regBtn) safeLink(regBtn, data.register?.formUrl);

  // CTA links (top buttons) -> use register url if exists
  const ctas = $$("[data-cta]");
  ctas.forEach(a => {
    if (data.register?.formUrl && String(data.register.formUrl).trim() !== "") {
      a.setAttribute("href", data.register.formUrl);
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    } else {
      a.setAttribute("href", "#register");
      a.removeAttribute("target");
    }
  });

  // Footer
  $("#year").textContent = new Date().getFullYear();
  const footerEmail = $("#footerEmail");
  if (footerEmail && data.footer?.email) {
    footerEmail.textContent = data.footer.email;
    footerEmail.href = `mailto:${data.footer.email}`;
  }
  const footerLine = $("#footerLine");
  if (footerLine && data.footer?.line) {
    footerLine.textContent = data.footer.line.replace("{year}", new Date().getFullYear());
  }

  // FAQ
  renderFAQ(data.faq || []);
}

setupMobileMenu();
loadContent().catch((e) => {
  console.error(e);
});
