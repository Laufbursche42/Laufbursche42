'use strict';

// Profile page Laufbursche42. Theme and language logic follow the sf-unlock pattern.
// The repo list is loaded live from the GitHub API; if that fails, a built-in
// fallback list is used so the page is never empty.
//
// Each repo shows the matching actions: website (when GitHub Pages is active),
// downloads from the latest release (APK plus Windows, macOS and Linux files,
// detected by file name) and always the link to report a bug.

const $ = (id) => document.getElementById(id);
const GH_USER = 'Laufbursche42';
const LS_THEME = 'lb_theme';
const LS_LANG = 'lb_lang';
const LS_REL_PREFIX = 'lb_rel_';        // per-repo cache for the release downloads
const REL_TTL = 30 * 60 * 1000;         // 30 minutes, eases the API rate limit

let lang = 'de';

// Fallback if the API is unreachable (rate limit, offline). Shown only when the
// live fetch fails. Manually maintained. hasPages and downloads are hardcoded
// here so that sensible buttons appear even without a network connection.
const RELEASE_BASE = 'https://github.com/' + GH_USER + '/';
const FALLBACK_REPOS = [
  { name: 'leat', description: 'Telemetry Data Charts for tr-lb-edition route and ride recordings.', language: 'Go', stargazers_count: 0, hasPages: false,
    downloads: { win: RELEASE_BASE + 'leat/releases/latest', mac: RELEASE_BASE + 'leat/releases/latest', linux: RELEASE_BASE + 'leat/releases/latest' } },
  { name: 'navee-unlock', description: 'Navee Tool', language: 'JavaScript', stargazers_count: 0, hasPages: true },
  { name: 'sf-unlock', description: 'SoFlow Tool', language: 'JavaScript', stargazers_count: 0, hasPages: true },
  { name: 'tb-unlock', description: 'Trittbrett Tool', language: 'JavaScript', stargazers_count: 0, hasPages: true },
  { name: 'tr-fw', description: 'Laufbursche Edition Firmware Patcher for Teverun Fighter Mini (eKFV)', language: 'JavaScript', stargazers_count: 2, hasPages: true },
  { name: 'tr-lb-edition', description: 'Alternative Android APP for Teverun E-Scooters', language: 'Java', stargazers_count: 4, hasPages: false,
    downloads: { apk: RELEASE_BASE + 'tr-lb-edition/releases/latest' } },
  { name: 'trbm-unlock', description: 'Trittbrett Mini Tool', language: 'JavaScript', stargazers_count: 0, hasPages: true },
  { name: 'trfm-unlock', description: 'Laufbursche Edition Teverun Fighter Mini (eKFV) unlock', language: 'JavaScript', stargazers_count: 2, hasPages: true },
  { name: 'vr-unlock', description: 'Viron Tool', language: 'JavaScript', stargazers_count: 0, hasPages: true }
];

// a splash of color per language. Deliberately simple, only a few common languages.
const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Java: '#b07219', Go: '#00ADD8', // scan-ok: language-name keys, not a javascript: URI
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
    const spec = el.getAttribute('data-t-attr'); // form "attr:key"
    const [attr, key] = spec.split(':');
    if (attr && key) el.setAttribute(attr, t(key));
  });

  // theme-button title reflects the next action.
  const dark = document.documentElement.getAttribute('data-theme') !== 'light';
  const tb = $('btn-theme');
  if (tb) tb.title = dark ? t('themeToLight') : t('themeToDark');

  document.querySelectorAll('#langs button').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
  });

  renderRepos(); // refresh loading/error text and button labels
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
    tb.innerHTML = dark ? '&#9728;' : '&#9790;'; // scan-ok: fixed characters (sun/moon), not user input
    tb.title = dark ? t('themeToLight') : t('themeToDark');
  }
  try { localStorage.setItem(LS_THEME, dark ? 'dark' : 'light'); } catch (e) {}
}

// Website address of a repo: its own homepage if set, otherwise the usual
// github.io address if Pages is active, otherwise none.
function computePageUrl(r) {
  if (r.homepage && /^https?:\/\//i.test(r.homepage)) return r.homepage;
  if (r.hasPages) return 'https://' + GH_USER.toLowerCase() + '.github.io/' + r.name + '/';
  return null;
}

// Maps release files to a platform by their name. First matching file per
// platform wins.
function classifyAssets(assets) {
  const out = {};
  (assets || []).forEach((a) => {
    const n = (a.name || '').toLowerCase();
    const url = a.browser_download_url;
    if (!url) return;
    if (!out.apk && n.endsWith('.apk')) out.apk = url;
    else if (!out.win && (n.endsWith('.exe') || n.endsWith('.msi') || /(^|[-_.])win(dows|64|32)?([-_.]|$)/.test(n))) out.win = url;
    else if (!out.mac && (n.endsWith('.dmg') || n.endsWith('.pkg') || /(^|[-_.])(mac(os)?|osx|darwin)([-_.]|$)/.test(n))) out.mac = url;
    else if (!out.linux && (n.endsWith('.appimage') || n.endsWith('.deb') || n.endsWith('.rpm') || /(^|[-_.])linux([-_.]|$)/.test(n))) out.linux = url;
  });
  return out;
}

// repo data state so a language switch can re-render.
let repoState = { status: 'loading', repos: [] };
let repoQuery = '';

// Match when all search terms (whitespace-separated) appear in the name or the
// description. q is already lowercased and trimmed.
function repoMatches(r, q) {
  const hay = ((r.name || '') + ' ' + (r.description || '')).toLowerCase();
  return q.split(/\s+/).filter(Boolean).every((term) => hay.includes(term));
}

// small pill link for a card's action bar.
function actPill(label, title, href, cls) {
  const a = document.createElement('a');
  a.className = 'repo-act ' + cls;
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener';
  a.textContent = label;
  if (title) a.title = title;
  return a;
}

function repoCard(r) {
  const repoUrl = 'https://github.com/' + GH_USER + '/' + r.name;

  // The container is a div, not an <a>, so the action links inside can be their
  // own links (nested <a> is invalid). The name carries an overlay link (::after
  // in CSS) so a click on the free card area opens the repo; the pills sit above
  // it via z-index.
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

  if (r.language) {
    const meta = document.createElement('div');
    meta.className = 'repo-meta';
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.background = LANG_COLORS[r.language] || 'var(--gps)';
    const lg = document.createElement('span');
    lg.className = 'repo-lang';
    lg.textContent = r.language;
    meta.appendChild(dot);
    meta.appendChild(lg);
    card.appendChild(meta);
  }

  // action bar: website, per-platform downloads, and report-a-bug on the far right.
  const actions = document.createElement('div');
  actions.className = 'repo-actions';
  const pageUrl = r.pageUrl || computePageUrl(r);
  if (pageUrl) actions.appendChild(actPill(t('pagesLink'), t('pagesTitle'), pageUrl, 'is-page'));

  const dl = r.downloads || {};
  if (dl.apk) actions.appendChild(actPill(t('dlApk'), t('dlApkTitle'), dl.apk, 'is-dl'));
  if (dl.win) actions.appendChild(actPill(t('dlWin'), t('dlWinTitle'), dl.win, 'is-dl'));
  if (dl.mac) actions.appendChild(actPill(t('dlMac'), t('dlMacTitle'), dl.mac, 'is-dl'));
  if (dl.linux) actions.appendChild(actPill(t('dlLinux'), t('dlLinuxTitle'), dl.linux, 'is-dl'));

  actions.appendChild(actPill(t('issueNew'), t('issueNewTitle'), repoUrl + '/issues/new', 'is-issue'));
  card.appendChild(actions);

  return card;
}

function renderRepos() {
  const list = $('repo-list');
  const count = $('repo-count');
  if (!list) return;
  list.textContent = '';

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

  const q = repoQuery.trim().toLowerCase();
  const shown = q ? repoState.repos.filter((r) => repoMatches(r, q)) : repoState.repos;

  shown.forEach((r) => {
    const li = document.createElement('li');
    li.appendChild(repoCard(r));
    list.appendChild(li);
  });

  if (q && shown.length === 0) {
    const li = document.createElement('li');
    li.className = 'repo-loading';
    li.textContent = t('reposNoMatch');
    list.appendChild(li);
  }

  if (count) {
    const total = repoState.repos.length;
    count.textContent = total ? (q ? shown.length + ' / ' + total : String(total)) : '';
  }
}

// Fetches the downloads of a repo's latest release, with a localStorage cache.
// Empty results (no release, 404) are cached too, so repos without a release
// are not re-queried on every visit. On a rate limit (403) or a network error
// nothing is cached.
async function fetchDownloads(name) {
  try {
    const raw = localStorage.getItem(LS_REL_PREFIX + name);
    if (raw) {
      const c = JSON.parse(raw);
      if (c && typeof c.t === 'number' && (Date.now() - c.t) < REL_TTL) return c.d || {};
    }
  } catch (e) {}

  try {
    const res = await fetch(
      'https://api.github.com/repos/' + GH_USER + '/' + name + '/releases/latest',
      { headers: { Accept: 'application/vnd.github+json' } }
    );
    if (res.ok) {
      const rel = await res.json();
      const d = classifyAssets(rel.assets);
      try { localStorage.setItem(LS_REL_PREFIX + name, JSON.stringify({ t: Date.now(), d })); } catch (e) {}
      return d;
    }
    if (res.status === 404) {
      try { localStorage.setItem(LS_REL_PREFIX + name, JSON.stringify({ t: Date.now(), d: {} })); } catch (e) {}
      return {};
    }
  } catch (e) {}
  return {};
}

// loads the downloads of all shown repos in parallel, then re-renders.
async function loadReleases() {
  if (repoState.status !== 'ok') return;
  const repos = repoState.repos;
  await Promise.all(repos.map(async (r) => {
    r.downloads = await fetchDownloads(r.name);
  }));
  renderRepos();
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
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
      .map((r) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stargazers_count: r.stargazers_count,
        hasPages: !!r.has_pages,
        homepage: r.homepage || '',
        pageUrl: null,
        downloads: null
      }));
    repos.forEach((r) => { r.pageUrl = computePageUrl(r); });
    repoState = { status: 'ok', repos };
    renderRepos();
    loadReleases(); // load downloads afterwards, then re-render
    return;
  } catch (e) {
    const repos = FALLBACK_REPOS.map((r) => Object.assign({}, r));
    repos.forEach((r) => { r.pageUrl = computePageUrl(r); });
    repoState = { status: 'error', repos };
    renderRepos();
  }
}

function init() {
  // language: German is the default. Only a stored choice (the switch) takes precedence.
  let savedLang = null;
  try { savedLang = localStorage.getItem(LS_LANG); } catch (e) {}
  if (savedLang === 'de' || savedLang === 'en') {
    lang = savedLang;
  }

  // theme: stored, else system preference, else dark.
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

  const rs = $('repo-search');
  if (rs) rs.addEventListener('input', () => { repoQuery = rs.value; renderRepos(); });

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
