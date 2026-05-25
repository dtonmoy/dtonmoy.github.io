'use strict';

async function loadProfile() {
  const res = await fetch('data/profile.json');
  if (!res.ok) throw new Error('Could not load profile.json');
  return res.json();
}

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  for (const child of children) {
    if (typeof child === 'string') node.appendChild(document.createTextNode(child));
    else if (child) node.appendChild(child);
  }
  return node;
}

function tag(t, cls, html) {
  const n = document.createElement(t);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
}

// ── Icons (inline SVG) ────────────────────────────────
const ICONS = {
  github: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`,
  email:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>`,
  scholar:`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>`,
  linkedin:`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  orcid:  `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 01-.947-.947c0-.516.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c2.359 0 3.872-1.528 3.872-3.722 0-1.922-1.306-3.722-3.872-3.722h-2.297z"/></svg>`,
  link:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
};

// ── Render sections ───────────────────────────────────

function renderHero(p) {
  const hero = document.getElementById('hero');
  hero.innerHTML = '';
  const inner = el('div', { class: 'container' },
    el('div', { class: 'hero-inner' },
      el('div', { class: 'hero-avatar' },
        p.photo
          ? el('img', { src: p.photo, alt: p.name })
          : document.createTextNode('👤')
      ),
      el('div', { class: 'hero-text' },
        el('h1', {}, p.name),
        el('div', { class: 'hero-title' }, p.title),
        el('div', { class: 'hero-institution' },
          p.institutionUrl
            ? el('a', { href: p.institutionUrl, target: '_blank', rel: 'noopener' }, p.institution)
            : document.createTextNode(p.institution)
        ),
        p.bio ? el('p', { class: 'hero-bio' }, p.bio) : null
      )
    )
  );
  hero.appendChild(inner);
}

function renderSkills(skills) {
  const sec = document.getElementById('skills');
  const grid = sec.querySelector('.skills-grid');
  grid.innerHTML = '';

  const groups = [
    { label: 'Languages', items: skills.languages },
    { label: 'Tools & Libraries', items: skills.tools },
    { label: 'Domains', items: skills.domains },
  ];

  let any = false;
  for (const g of groups) {
    if (!g.items?.length) continue;
    any = true;
    const tagsDiv = el('div', { class: 'skill-tags' },
      ...g.items.map(s => el('span', { class: 'tag' }, s))
    );
    grid.appendChild(el('div', { class: 'skill-group' },
      el('h3', {}, g.label),
      tagsDiv
    ));
  }

  if (!any) {
    sec.style.display = 'none';
    const navLink = document.querySelector('.nav-links a[href="#skills"]');
    if (navLink) navLink.parentElement.style.display = 'none';
  }
}

function renderProjects(projects) {
  const sec = document.getElementById('projects');
  const grid = sec.querySelector('.projects-grid');
  grid.innerHTML = '';

  for (const p of projects) {
    const tags = (p.tags || []).map(t => el('span', { class: 'tag' }, t));
    const card = el('div', { class: 'project-card' },
      el('div', { class: 'project-card-header' },
        el('h3', {}, p.name),
        p.year ? el('span', { class: 'project-year' }, p.year) : null
      ),
      p.description ? el('p', {}, p.description) : null,
      el('div', { class: 'project-footer' },
        p.url
          ? el('a', { class: 'project-link', href: p.url, target: '_blank', rel: 'noopener' },
              el('span', { html: ICONS.link }),
              'View on GitHub'
            )
          : el('span', {}),
        el('div', { class: 'skill-tags' }, ...tags)
      )
    );
    grid.appendChild(card);
  }
}

function renderExperience(experience) {
  const sec = document.getElementById('experience');
  const timeline = sec.querySelector('.timeline');
  timeline.innerHTML = '';

  for (const e of experience) {
    timeline.appendChild(
      el('div', { class: 'timeline-item' },
        e.period ? el('div', { class: 'timeline-period' }, e.period) : null,
        el('h3', {}, e.role),
        el('div', { class: 'timeline-org' }, e.org),
        e.description ? el('p', { class: 'timeline-desc' }, e.description) : null
      )
    );
  }
}

function renderContact(contact) {
  const sec = document.getElementById('contact');
  const links = sec.querySelector('.contact-links');
  links.innerHTML = '';

  const items = [
    contact.github   && { href: `https://github.com/${contact.github}`, icon: 'github',   label: `github.com/${contact.github}` },
    contact.email    && { href: `mailto:${contact.email}`,               icon: 'email',    label: contact.email },
    contact.scholar  && { href: contact.scholar,                          icon: 'scholar',  label: 'Google Scholar' },
    contact.linkedin && { href: contact.linkedin,                         icon: 'linkedin', label: 'LinkedIn' },
    contact.orcid    && { href: contact.orcid,                            icon: 'orcid',    label: 'ORCID' },
  ].filter(Boolean);

  for (const item of items) {
    links.appendChild(
      el('a', { class: 'contact-link', href: item.href, target: '_blank', rel: 'noopener' },
        el('span', { html: ICONS[item.icon] }),
        item.label
      )
    );
  }
}

function setNavBrand(name) {
  const brand = document.querySelector('.nav-brand');
  if (brand) brand.textContent = name;
}

function setPageTitle(name) {
  document.title = `${name} — Portfolio`;
}

// ── Boot ──────────────────────────────────────────────
(async () => {
  try {
    const profile = await loadProfile();
    setPageTitle(profile.name);
    setNavBrand(profile.name);
    renderHero(profile);
    if (profile.skills)     renderSkills(profile.skills);
    if (profile.projects)   renderProjects(profile.projects);
    if (profile.experience) renderExperience(profile.experience);
    if (profile.contact)    renderContact(profile.contact);
  } catch (err) {
    console.error('Failed to load profile:', err);
  }
})();
