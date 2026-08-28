'use strict';

// Profilseite Laufbursche42. Theme- und Sprachlogik nach dem Muster aus sf-unlock.
// Die Repo-Liste kommt live von der GitHub-API; schlägt das fehl, greift eine
// eingebaute Fallback-Liste, damit die Seite nie leer bleibt.

const $ = (id) => document.getElementById(id);
const GH_USER = 'Laufbursche42';
const LS_THEME = 'lb_theme';
const LS_LANG = 'lb_lang';

let lang = 'de';

// Fallback, falls die API nicht erreichbar ist (Rate-Limit, offline). Wird nur
// angezeigt, wenn der Live-Abruf scheitert. Stand: manuell gepflegt.
const FALLBACK_REPOS = [
  { name: 'leat', description: 'Telemetry Data Charts for tr-lb-edition route and ride recordings.', language: 'Go', stargazers_count: 0 },
  { name: 'navee-unlock', description: 'Navee Tool', language: 'JavaScript', stargazers_count: 0 },
  { name: 'sf-unlock', description: 'SoFlow Tool', language: 'JavaScript', stargazers_count: 0 },
  { name: 'tb-unlock', description: 'Trittbrett Tool', language: 'JavaScript', stargazers_count: 0 },
  { name: 'tr-fw', description: 'Laufbursche Edition Firmware Patcher for Teverun Fighter Mini (eKFV)', language: 'JavaScript', stargazers_count: 2 },
  { name: 'tr-lb-edition', description: 'Alternative Android APP for Teverun E-Scooters', language: 'Java', stargazers_count: 4 },
  { name: 'trbm-unlock', description: 'Trittbrett Mini Tool', language: 'JavaScript', stargazers_count: 0 },
  { name: 'trfm-unlock', description: 'Laufbursche Edition Teverun Fighter Mini (eKFV) unlock', language: 'JavaScript', stargazers_count: 2 },
  { name: 'vr-unlock', description: 'Viron Tool', language: 'JavaScript', stargazers_count: 0 }
];

// Farbtupfer je Sprache. Bewusst schlicht, nur ein paar gängige Sprachen.
const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Java: '#b07219', Go: '#00ADD8',
  Python: '#3572A5', C: '#555555', 'C++': '#f34b7d', HTML: '#e34c26', CSS: '#563d7c',
  Shell: '#89e051', Kotlin: '#A97BFF', Dart: '#00B4AB', Rust: '#dea584'
};

function t(key) {
  const dict = window.I18N[lang] || window.I18N.de;
  return dict[key] != null ? dict[key] : key;
}

function applyLang() {
  document.documentElement.lang = lang;
  document.title = t('pageTitle');

  document.querySelectorAll('[data-t]').forEach((el) => {
    el.textContent = t(el.getAttribute('data-t'));
  });
  document.querySelectorAll('[data-t-attr]').forEach((el) => {
    const spec = el.getAttribute('data-t-attr'); // Form "attr:key"
    const [attr, key] = spec.split(':');
    if (attr && key) el.setAttribute(attr, t(key));
  });

  // Theme-Knopf-Titel spiegelt die nächste Aktion.
  const dark = document.documentElement.getAttribute('data-theme') !== 'light';
  const tb = $('btn-theme');
  if (tb) tb.title = dark ? t('themeToLight') : t('themeToDark');

  document.querySelectorAll('#langs button').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
  });

  renderRepos(); // Ladehinweis/Fehlertext in neuer Sprache nachziehen
}

function setLang(next) {
  lang = next;
  try { localStorage.setItem(LS_LANG, lang); } catch (e) {}
  applyLang();
}

function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  const tb = $('btn-theme');
  if (tb) {
    tb.innerHTML = dark ? '&#9728;' : '&#9790;'; // Sonne im Dark-, Mond im Light-Mode
    tb.title = dark ? t('themeToLight') : t('themeToDark');
  }
  try { localStorage.setItem(LS_THEME, dark ? 'dark' : 'light'); } catch (e) {}
}

// Zustand der Repo-Daten, damit ein Sprachwechsel neu rendern kann.
let repoState = { status: 'loading', repos: [] };

function repoCard(r) {
  const repoUrl = 'https://github.com/' + GH_USER + '/' + r.name;

  // Container ist ein div, nicht ein <a>, damit der Issue-Link darin ein eigener
  // Link sein kann (verschachtelte <a> sind ungültig). Der Name trägt einen
  // Overlay-Link (::after in CSS), sodass ein Klick auf die ganze Karte das Repo
  // öffnet; der Issue-Link liegt per z-index darüber.
  const card = document.createElement('div');
  card.className = 'repo';

  const top = document.createElement('div');
  top.className = 'repo-top';
  const name = document.createElement('a');
  name.className = 'repo-name';
  name.href = repoUrl;
  name.target = '_blank';
  name.rel = 'noopener';
  name.textContent = r.name;
  top.appendChild(name);
  if (r.stargazers_count > 0) {
    const star = document.createElement('span');
    star.className = 'repo-star';
    star.textContent = '★ ' + r.stargazers_count;
    top.appendChild(star);
  }
  card.appendChild(top);

  if (r.description) {
    const d = document.createElement('p');
    d.className = 'repo-desc';
    d.textContent = r.description;
    card.appendChild(d);
  }

  // Fußzeile: links Sprache (falls vorhanden), rechts der Neues-Issue-Link.
  const meta = document.createElement('div');
  meta.className = 'repo-meta';
  if (r.language) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.background = LANG_COLORS[r.language] || 'var(--gps)';
    const lg = document.createElement('span');
    lg.className = 'repo-lang';
    lg.textContent = r.language;
    meta.appendChild(dot);
    meta.appendChild(lg);
  }
  const issue = document.createElement('a');
  issue.className = 'repo-issue';
  issue.href = repoUrl + '/issues/new';
  issue.target = '_blank';
  issue.rel = 'noopener';
  issue.textContent = t('issueNew');
  issue.title = t('issueNewTitle');
  meta.appendChild(issue);
  card.appendChild(meta);

  return card;
}

function renderRepos() {
  const list = $('repo-list');
  const count = $('repo-count');
  if (!list) return;
  list.innerHTML = '';

  if (repoState.status === 'loading') {
    const li = document.createElement('li');
    li.className = 'repo-loading';
    li.textContent = t('reposLoading');
    list.appendChild(li);
    if (count) count.textContent = '';
    return;
  }

  if (repoState.status === 'error') {
    const li = document.createElement('li');
    li.className = 'repo-loading';
    li.textContent = t('reposError');
    list.appendChild(li);
  }

  repoState.repos.forEach((r) => {
    const li = document.createElement('li');
    li.appendChild(repoCard(r));
    list.appendChild(li);
  });
  if (count) count.textContent = repoState.repos.length ? String(repoState.repos.length) : '';
}

async function loadRepos() {
  try {
    const res = await fetch(
      'https://api.github.com/users/' + GH_USER + '/repos?per_page=100&sort=updated',
      { headers: { Accept: 'application/vnd.github+json' } }
    );
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const repos = data
      .filter((r) => !r.fork && !r.archived && r.name.toLowerCase() !== GH_USER.toLowerCase())
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    repoState = { status: 'ok', repos };
  } catch (e) {
    repoState = { status: 'error', repos: FALLBACK_REPOS };
  }
  renderRepos();
}

function init() {
  // Sprache: Deutsch ist Standard. Nur eine gespeicherte Wahl (Umschalter) hat Vorrang.
  let savedLang = null;
  try { savedLang = localStorage.getItem(LS_LANG); } catch (e) {}
  if (savedLang === 'de' || savedLang === 'en') {
    lang = savedLang;
  }

  // Theme: gespeichert, sonst Systemvorliebe, sonst Dark.
  let savedTheme = null;
  try { savedTheme = localStorage.getItem(LS_THEME); } catch (e) {}
  let dark = true;
  if (savedTheme === 'light') dark = false;
  else if (savedTheme === 'dark') dark = true;
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) dark = false;
  applyTheme(dark);

  const tb = $('btn-theme');
  if (tb) tb.addEventListener('click', () => {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'light');
  });
  document.querySelectorAll('#langs button').forEach((b) => {
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });

  const y = $('year');
  if (y) y.textContent = new Date().getFullYear();

  applyLang();
  loadRepos();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
