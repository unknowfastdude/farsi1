/**
 * MyFarsi — adaptive HTML scraper for YOUR OWN licensed site (Nuvio provider).
 *
 * It never relies on fixed CSS selectors or URL formats. For every request it:
 *   1. Gets the title's names + year from TMDB (English, original, Persian, alternates).
 *   2. Finds the title's page on your site using whichever strategy works:
 *        site search  ->  sitemap.xml  ->  crawl homepage + listing pages
 *      Candidate links are scored by fuzzy title matching that tolerates
 *      Finglish spelling differences (Payetakht / Paytakht / پایتخت).
 *   3. For series, finds the episode link (Episode 3, E03, S01E03, قسمت ۳, select menus,
 *      season sub-pages).
 *   4. Pulls playable links out of whatever player markup is there: <video>/<source>,
 *      JS player configs, JSON-LD, og:video, escaped JSON, base64 strings, iframes,
 *      and "Play"/"Watch" sub-pages.
 * The search pattern that worked is remembered for the rest of the session.
 */

// ===================== CONFIG — edit these =====================
var CONFIG = {
  // Your sites. Add as many as you like; they are all searched at the same time.
  // name   = label shown in Nuvio's stream list
  // url    = site address, no trailing slash
  // search = optional: the site's search URL if you know it ({q} = the title)
  SITES: [
    { name: 'MyFarsi', url: 'https://YOUR-SITE.com' },
    // { name: 'MyFarsi 2', url: 'https://second-site.com', search: '/find?term={q}' },
  ],
  PROVIDER_NAME: 'MyFarsi',
  TMDB_API_KEY: 'YOUR_TMDB_API_KEY',          // free key from themoviedb.org
  TMDB_BASE: 'https://api.themoviedb.org/3',

  // Tried in order; {q} = URL-encoded title. Add your site's pattern first if you know it.
  SEARCH_PATTERNS: [
    '/search?q={q}', '/search?query={q}', '/search?keyword={q}', '/?s={q}',
    '/search/{q}', '/search/{q}.html', '/search.html?q={q}'
  ],
  SITEMAP_PATHS: ['/sitemap.xml', '/sitemap_index.xml', '/sitemap-index.xml', '/wp-sitemap.xml'],

  MATCH_THRESHOLD: 0.62,   // 0..1 — raise if wrong titles get picked, lower if nothing matches
  MAX_FETCHES: 30,         // per lookup, keeps it fast
  TIMEOUT_MS: 9000,
  USER_AGENT: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36'
};
// ===============================================================

var LEARNED = {};   // per-site memory: which search URL works, sitemap, found pages
function learnedFor(site) {
  return LEARNED[site.url] || (LEARNED[site.url] = { searchPattern: null, sitemapUrls: null, sitemapAt: 0, pages: {} });
}
var CACHE_TTL = 6 * 60 * 60 * 1000;

// ---------------------------------------------------------------- text utils
var FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
var AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';

function latinDigits(s) {
  return String(s).replace(/[۰-۹]/g, function (d) { return String(FA_DIGITS.indexOf(d)); })
    .replace(/[٠-٩]/g, function (d) { return String(AR_DIGITS.indexOf(d)); });
}

function decodeEntities(s) {
  return String(s || '')
    .replace(/&#x([0-9a-f]+);/gi, function (_, h) { return String.fromCharCode(parseInt(h, 16)); })
    .replace(/&#(\d+);/g, function (_, d) { return String.fromCharCode(parseInt(d, 10)); })
    .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

function stripTags(s) {
  return decodeEntities(String(s || '').replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

var STOP_WORDS = {
  serial: 1, series: 1, serie: 1, film: 1, movie: 1, full: 1, hd: 1, fhd: 1, uhd: 1, '4k': 1, online: 1,
  watch: 1, free: 1, the: 1, new: 1, kamel: 1, complete: 1, play: 1, stream: 1, streaming: 1, download: 1,
  'سریال': 1, 'فیلم': 1, 'کامل': 1, 'دانلود': 1, 'تماشا': 1, 'آنلاین': 1, 'انلاین': 1, 'پخش': 1, 'رایگان': 1
};

function normalize(s) {
  s = latinDigits(decodeEntities(s)).toLowerCase();
  s = s.replace(/ي/g, 'ی').replace(/ى/g, 'ی').replace(/ك/g, 'ک').replace(/ة/g, 'ه').replace(/[أإ]/g, 'ا')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[\u200c\u200d]/g, ' ');
  if (s.normalize) {
    try { s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) { /* runtime without ICU */ }
  }
  s = s.replace(/[^a-z0-9\u0600-\u06ff]+/g, ' ');
  return s.split(' ').filter(function (t) { return t && !STOP_WORDS[t]; }).join(' ');
}

// Persian script -> rough Latin so "پایتخت" can match "Payetakht"
var FINGLISH = {
  'ا': 'a', 'آ': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's', 'ج': 'j', 'چ': 'ch', 'ح': 'h', 'خ': 'kh',
  'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'z', 'ط': 't',
  'ظ': 'z', 'ع': '', 'غ': 'gh', 'ف': 'f', 'ق': 'gh', 'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n',
  'و': 'v', 'ه': 'h', 'ی': 'y', 'ء': '', 'ئ': 'y', 'ؤ': 'v'
};
function finglish(s) {
  var out = '';
  for (var i = 0; i < s.length; i++) out += (FINGLISH[s[i]] !== undefined ? FINGLISH[s[i]] : s[i]);
  return out;
}

// Consonant skeleton: tolerant of vowel/spelling differences in transliteration
function skeleton(s) {
  return finglish(s).replace(/kh/g, 'K').replace(/sh/g, 'S').replace(/ch/g, 'C').replace(/zh/g, 'Z')
    .replace(/gh|q/g, 'G').replace(/w/g, 'v').replace(/[aeiouyhv ]/g, '').replace(/(.)\1+/g, '$1');
}

function bigrams(s) {
  var out = {}, n = 0;
  s = s.replace(/ /g, '');
  for (var i = 0; i < s.length - 1; i++) { var g = s.substr(i, 2); out[g] = (out[g] || 0) + 1; n++; }
  return { map: out, n: n };
}
function dice(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  var A = bigrams(a), B = bigrams(b);
  if (!A.n || !B.n) return 0;
  var inter = 0;
  for (var g in A.map) if (B.map[g]) inter += Math.min(A.map[g], B.map[g]);
  return (2 * inter) / (A.n + B.n);
}

function similarity(title, text) {
  var a = normalize(title), b = normalize(text);
  if (!a || !b) return 0;
  if (a === b) return 1;
  var best = dice(a, b);
  var sa = skeleton(a), sb = skeleton(b);
  if (sa.length >= 3 && sb.length >= 3) best = Math.max(best, sa === sb ? 0.95 : dice(sa, sb) * 0.95);
  // whole title contained in a longer link text ("Payetakht Fasl 6 ...")
  var ta = a.split(' '), tb = ' ' + b + ' ';
  var allIn = ta.every(function (t) { return tb.indexOf(' ' + t + ' ') !== -1; });
  if (!allIn) {
    var skB = ' ' + b.split(' ').map(skeleton).join(' ') + ' ';
    allIn = ta.every(function (t) { var k = skeleton(t); return k.length >= 2 && skB.indexOf(' ' + k + ' ') !== -1; });
  }
  if (allIn) best = Math.max(best, 0.8 + 0.15 * Math.min(1, ta.length / b.split(' ').length));
  return best;
}

// ---------------------------------------------------------------- url utils
function originOf(u) { var m = String(u).match(/^(https?:\/\/[^\/?#]+)/i); return m ? m[1] : ''; }
function hostOf(u) { return originOf(u).replace(/^https?:\/\//i, '').replace(/:\d+$/, '').toLowerCase(); }

function normalizePath(p) {
  var parts = p.split('/'), out = [];
  for (var i = 0; i < parts.length; i++) {
    if (parts[i] === '..') { if (out.length > 1) out.pop(); }
    else if (parts[i] !== '.') out.push(parts[i]);
  }
  return out.join('/');
}

function resolveUrl(href, base) {
  if (!href) return null;
  href = decodeEntities(String(href).trim()).replace(/\\\//g, '/');
  if (!href || /^(javascript:|mailto:|tel:|#|data:|blob:)/i.test(href)) return null;
  if (/^https?:\/\//i.test(href)) return href;
  if (href.indexOf('//') === 0) return (base.match(/^(https?):/i) || [0, 'https'])[1] + ':' + href;
  var m = base.match(/^(https?:\/\/[^\/?#]+)([^?#]*)/i);
  if (!m) return null;
  var origin = m[1], path = m[2] || '/';
  if (href[0] === '/') return origin + href;
  if (href[0] === '?') return origin + path + href;
  return origin + normalizePath(path.replace(/[^\/]*$/, '') + href);
}

function isOwnSite(u, ctx) {
  var h = hostOf(u), s = hostOf(ctx.site.url).replace(/^www\./, '');
  return h === s || h === 'www.' + s || h.slice(-(s.length + 1)) === '.' + s;
}

function slugText(u) {
  var path = String(u).replace(/^https?:\/\/[^\/]+/i, '').split(/[?#]/)[0];
  var segs = path.split('/').filter(Boolean).map(function (x) {
    try { return decodeURIComponent(x); } catch (e) { return x; }
  });
  var generic = /^(watch|movie|movies|film|films|serial|series|tv|show|shows|video|videos|play|post|p|title|details|fa|en)$/i;
  var meaningful = segs.filter(function (x) { return !generic.test(x.replace(/\.\w+$/, '')); });
  return (meaningful.join(' ') || '').replace(/\.(html?|php|aspx?)$/i, '').replace(/[-_+.]+/g, ' ');
}

var NAV_RE = /\/(login|signin|signup|register|account|user|category|categories|tag|tags|genre|genres|contact|contact-us|privacy|dmca|terms|about|language|faq|cart|feed)(\/|\.|$|\?)|\/page\/\d+|[?&](page|lang)=/i;

// ---------------------------------------------------------------- fetching
function fetchText(url, ctx, referer) {
  if (ctx.fetches >= CONFIG.MAX_FETCHES) return Promise.resolve(null);
  ctx.fetches++;
  var headers = {
    'User-Agent': CONFIG.USER_AGENT,
    'Accept': 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en,fa;q=0.8'
  };
  if (referer) headers.Referer = referer;
  var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  var timer;
  var timeout = new Promise(function (resolve) {
    timer = setTimeout(function () { if (controller) controller.abort(); resolve(null); }, CONFIG.TIMEOUT_MS);
  });
  var req = fetch(url, { headers: headers, signal: controller ? controller.signal : undefined })
    .then(function (res) {
      if (!res.ok) return null;
      return res.text().then(function (t) { return { text: t, url: res.url || url }; });
    })
    .catch(function () { return null; });
  return Promise.race([req, timeout]).then(function (r) { clearTimeout(timer); return r; });
}

// ---------------------------------------------------------------- TMDB
async function getTitleInfo(tmdbId, type) {
  var url = CONFIG.TMDB_BASE + '/' + type + '/' + encodeURIComponent(tmdbId) +
    '?api_key=' + encodeURIComponent(CONFIG.TMDB_API_KEY) + '&append_to_response=alternative_titles,translations';
  var res = await fetchText(url, { fetches: 0 });
  if (!res) return null;
  var d;
  try { d = JSON.parse(res.text); } catch (e) { return null; }

  var names = [];
  function add(n) { if (n && typeof n === 'string' && names.indexOf(n) === -1) names.push(n); }
  add(d.title || d.name);
  add(d.original_title || d.original_name);
  var tr = (d.translations && d.translations.translations) || [];
  tr.forEach(function (t) {
    if (t.iso_639_1 === 'fa' || t.iso_639_1 === 'en') add(t.data && (t.data.title || t.data.name));
  });
  var alts = (d.alternative_titles && (d.alternative_titles.titles || d.alternative_titles.results)) || [];
  alts.sort(function (a, b) {
    var pa = /^(IR|US|GB|AF)$/.test(a.iso_3166_1) ? 0 : 1, pb = /^(IR|US|GB|AF)$/.test(b.iso_3166_1) ? 0 : 1;
    return pa - pb;
  }).forEach(function (a) { add(a.title || a.name); });

  var date = d.release_date || d.first_air_date || '';
  return { names: names.slice(0, 8), year: date ? date.slice(0, 4) : '' };
}

// ---------------------------------------------------------------- link extraction
function extractLinks(html, base) {
  var links = [], seen = {};
  function push(href, text) {
    var u = resolveUrl(href, base);
    if (!u || !/^https?:/i.test(u)) return;
    var key = u.split('#')[0];
    text = (text || '').replace(/\s+/g, ' ').trim();
    if (seen[key] !== undefined) {
      if (text && links[seen[key]].text.indexOf(text) === -1) links[seen[key]].text += ' | ' + text;
      return;
    }
    seen[key] = links.length;
    links.push({ url: key, text: text });
  }
  function attr(attrs, name) {
    var m = attrs.match(new RegExp('\\b' + name + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))', 'i'));
    return m ? (m[1] !== undefined ? m[1] : m[2] !== undefined ? m[2] : m[3]) : '';
  }
  var m, re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  while ((m = re.exec(html))) {
    var inner = m[2];
    var alt = (inner.match(/\balt\s*=\s*["']([^"']+)["']/i) || [])[1] || '';
    push(attr(m[1], 'href') || attr(m[1], 'data-href') || attr(m[1], 'data-url'),
      [stripTags(inner), attr(m[1], 'title'), alt].filter(Boolean).join(' '));
  }
  re = /<option\b([^>]*)>([\s\S]*?)<\/option>/gi;
  while ((m = re.exec(html))) {
    var v = attr(m[1], 'value') || attr(m[1], 'data-url') || attr(m[1], 'data-href');
    if (v && /[\/.]/.test(v)) push(v, stripTags(m[2]));
  }
  // clickable non-anchors: <div data-href="..."> / <li data-url="..."> / onclick="location='...'"
  re = /<(\w+)\b([^>]*\b(?:data-(?:href|url|link|episode-url)|onclick)\s*=[^>]*)>([\s\S]{0,300}?)<\/\1>/gi;
  while ((m = re.exec(html))) {
    var t = m[1].toLowerCase();
    if (t === 'a' || t === 'option' || t === 'script') continue;
    var h = attr(m[2], 'data-href') || attr(m[2], 'data-url') || attr(m[2], 'data-link') || attr(m[2], 'data-episode-url');
    if (!h) { var oc = attr(m[2], 'onclick').match(/['"]([^'"]+\/[^'"]*)['"]/); h = oc ? oc[1] : ''; }
    if (h) push(h, stripTags(m[3]) + ' ' + attr(m[2], 'title'));
  }
  return links;
}

// ---------------------------------------------------------------- matching
function titleScore(link, info) {
  var slug = slugText(link.url);
  var best = 0;
  for (var i = 0; i < info.names.length; i++) {
    var n = info.names[i];
    best = Math.max(best, similarity(n, link.text), similarity(n, slug));
    if (best === 1) break;
  }
  var hay = link.text + ' ' + link.url;
  if (info.year) {
    if (hay.indexOf(info.year) !== -1) best += 0.05;
    else {
      var ys = hay.match(/\b(19[5-9]\d|20[0-4]\d)\b/g);
      if (ys && ys.length) best -= 0.08;   // a different Gregorian year is shown
    }
  }
  if (NAV_RE.test(link.url)) best -= 1;
  return best;
}

function pickBest(links, info, ctx, opts) {
  var best = null;
  for (var i = 0; i < links.length; i++) {
    var l = links[i];
    if (!isOwnSite(l.url, ctx) || (opts && opts.exclude && opts.exclude[l.url])) continue;
    var s = titleScore(l, info);
    if (info.type === 'tv' && info.season) s += 0.15 * episodeScore(l.text + ' ' + slugText(l.url), info.season, info.episode);
    if (!best || s > best.score) best = { url: l.url, text: l.text, score: s };
  }
  return best;
}

// How well does this text describe season s / episode e? 0..1
function episodeScore(text, s, e) {
  var t = ' ' + latinDigits(decodeEntities(text)).toLowerCase().replace(/[_\-.\/|]+/g, ' ') + ' ';
  var m = t.match(/[^a-z]s\s?0*(\d{1,2})\s?e\s?0*(\d{1,4})(?!\d)/);
  if (m) return (+m[1] === +s && +m[2] === +e) ? 1 : 0;

  var epRe = /(?:^|[^a-z\u0600-\u06ff])(?:episode|epsiode|episod|epi|ep|e|qesmat|ghesmat|qesmate|ghesmate|part|قسمت|بخش)\s*0*(\d{1,4})(?!\d)/g;
  var eps = [], mm;
  while ((mm = epRe.exec(t))) eps.push(+mm[1]);
  var seasonRe = /(?:^|[^a-z\u0600-\u06ff])(?:season|fasl|fasle|faslu|s|فصل)\s*0*(\d{1,2})(?!\d)/g;
  var seasons = [];
  while ((mm = seasonRe.exec(t))) seasons.push(+mm[1]);

  if (!eps.length) {
    // bare number as the whole link text, e.g. episode grids "1 2 3 ..."
    var bare = t.trim();
    if (/^\d{1,4}$/.test(bare)) return +bare === +e ? 0.7 : 0;
    return 0;
  }
  if (eps.indexOf(+e) === -1) return 0;
  if (seasons.length) return seasons.indexOf(+s) !== -1 ? 1 : 0;
  return +s === 1 ? 0.9 : 0.6;
}

function seasonOnlyScore(text, s) {
  var t = ' ' + latinDigits(decodeEntities(text)).toLowerCase().replace(/[_\-.\/|]+/g, ' ') + ' ';
  var re = /(?:^|[^a-z\u0600-\u06ff])(?:season|fasl|fasle|s|فصل)\s*0*(\d{1,2})(?!\d)/g, mm;
  while ((mm = re.exec(t))) if (+mm[1] === +s) return 1;
  return 0;
}

// ---------------------------------------------------------------- discovery
async function viaSearch(info, ctx) {
  var patterns = (ctx.site.search ? [ctx.site.search] : []).concat(CONFIG.SEARCH_PATTERNS);
  if (ctx.learned.searchPattern) {
    patterns = [ctx.learned.searchPattern].concat(patterns.filter(function (p) { return p !== ctx.learned.searchPattern; }));
  }
  var queries = info.names.filter(function (n) { return /[a-z]/i.test(n); }).slice(0, 2);
  info.names.forEach(function (n) { if (queries.length < 3 && queries.indexOf(n) === -1) queries.push(n); });

  var best = null;
  for (var p = 0; p < patterns.length; p++) {
    var patternWorked = false;
    for (var q = 0; q < queries.length; q++) {
      var url = ctx.site.url + patterns[p].replace('{q}', encodeURIComponent(queries[q]));
      var res = await fetchText(url, ctx, ctx.site.url + '/');
      if (!res) break;                      // pattern not supported (404 etc.) -> next pattern
      patternWorked = true;
      var exclude = {}; exclude[url] = 1; exclude[res.url] = 1;
      var cand = pickBest(extractLinks(res.text, res.url), info, ctx, { exclude: exclude });
      if (cand && (!best || cand.score > best.score)) best = cand;
      if (best && best.score >= CONFIG.MATCH_THRESHOLD) {
        ctx.learned.searchPattern = patterns[p];
        return best;
      }
    }
    if (patternWorked && ctx.learned.searchPattern === patterns[p]) ctx.learned.searchPattern = null;
    if (ctx.fetches >= CONFIG.MAX_FETCHES) break;
  }
  return best;
}

async function loadSitemapUrls(ctx) {
  if (ctx.learned.sitemapUrls && Date.now() - ctx.learned.sitemapAt < CACHE_TTL) return ctx.learned.sitemapUrls;
  var roots = CONFIG.SITEMAP_PATHS.map(function (p) { return ctx.site.url + p; });
  var robots = await fetchText(ctx.site.url + '/robots.txt', ctx);
  if (robots) {
    var re = /^\s*sitemap:\s*(\S+)/gim, m;
    while ((m = re.exec(robots.text))) if (roots.indexOf(m[1]) === -1) roots.unshift(m[1]);
  }
  var urls = [], visited = {}, queue = roots.slice(), fetched = 0;
  while (queue.length && fetched < 8 && ctx.fetches < CONFIG.MAX_FETCHES) {
    var sm = queue.shift();
    if (visited[sm]) continue;
    visited[sm] = 1;
    var res = await fetchText(sm, ctx);
    if (!res || !/<(urlset|sitemapindex)/i.test(res.text)) continue;
    fetched++;
    var locs = [], lm, lre = /<loc>\s*(?:<!\[CDATA\[)?\s*([^<\]\s]+)/gi;
    while ((lm = lre.exec(res.text))) locs.push(decodeEntities(lm[1]));
    if (/<sitemapindex/i.test(res.text)) {
      // content sitemaps first
      locs.sort(function (a, b) {
        var pa = /movie|film|serial|series|video|post|title|watch/i.test(a) ? 0 : 1;
        var pb = /movie|film|serial|series|video|post|title|watch/i.test(b) ? 0 : 1;
        return pa - pb;
      });
      queue = queue.concat(locs);
    } else {
      urls = urls.concat(locs);
    }
    if (urls.length && roots.indexOf(sm) !== -1) queue = queue.filter(function (u) { return roots.indexOf(u) === -1; });
  }
  if (urls.length) { ctx.learned.sitemapUrls = urls; ctx.learned.sitemapAt = Date.now(); }
  return urls;
}

async function viaSitemap(info, ctx) {
  var urls = await loadSitemapUrls(ctx);
  if (!urls.length) return null;
  return pickBest(urls.map(function (u) { return { url: u, text: '' }; }), info, ctx);
}

var LISTING_RE = /movie|film|serial|series|show|az|a-z|list|archive|catalog|browse|latest|new|فیلم|سریال|آرشیو/i;

async function viaCrawl(info, ctx) {
  var home = await fetchText(ctx.site.url + '/', ctx);
  if (!home) return null;
  var links = extractLinks(home.text, home.url);
  var best = pickBest(links, info, ctx);
  if (best && best.score >= CONFIG.MATCH_THRESHOLD) return best;

  var listings = links.filter(function (l) {
    return isOwnSite(l.url, ctx) && !NAV_RE.test(l.url) && LISTING_RE.test(l.url + ' ' + l.text) && titleScore(l, info) < 0.5;
  }).slice(0, 6);
  for (var i = 0; i < listings.length && ctx.fetches < CONFIG.MAX_FETCHES; i++) {
    var res = await fetchText(listings[i].url, ctx, home.url);
    if (!res) continue;
    var c = pickBest(extractLinks(res.text, res.url), info, ctx);
    if (c && (!best || c.score > best.score)) best = c;
    if (best && best.score >= CONFIG.MATCH_THRESHOLD) return best;
  }
  return best;
}

async function findTitlePage(info, ctx) {
  var key = info.type + ':' + info.tmdbId;
  var cached = ctx.learned.pages[key];
  if (cached && Date.now() - cached.at < CACHE_TTL) return cached.page;

  var strategies = [viaSearch, viaSitemap, viaCrawl];
  var best = null;
  for (var i = 0; i < strategies.length; i++) {
    var c = await strategies[i](info, ctx);
    if (c && (!best || c.score > best.score)) best = c;
    if (best && best.score >= CONFIG.MATCH_THRESHOLD) break;
  }
  if (!best || best.score < CONFIG.MATCH_THRESHOLD) return null;
  ctx.learned.pages[key] = { page: best, at: Date.now() };
  return best;
}

async function findEpisodePage(page, info, ctx) {
  var s = info.season || 1, e = info.episode || 1;
  if (episodeScore(page.text + ' ' + slugText(page.url), s, e) >= 0.9) return { url: page.url };

  var visited = {}, toVisit = [page.url];
  for (var round = 0; round < 3 && toVisit.length; round++) {
    var url = toVisit.shift();
    if (visited[url]) continue;
    visited[url] = 1;
    var res = await fetchText(url, ctx, ctx.site.url + '/');
    if (!res) continue;
    var links = extractLinks(res.text, res.url).filter(function (l) { return isOwnSite(l.url, ctx); });

    var best = null;
    links.forEach(function (l) {
      var sc = episodeScore(l.text + ' ' + slugText(l.url), s, e);
      if (sc > 0 && (!best || sc > best.score)) best = { url: l.url, score: sc };
    });
    if (best && best.score >= 0.6) return { url: best.url, html: null };

    // Season sub-page ("Fasl 2", "Season 2") -> look there next
    links.forEach(function (l) {
      if (!visited[l.url] && seasonOnlyScore(l.text + ' ' + slugText(l.url), s) && episodeScore(l.text, s, e) === 0) {
        toVisit.push(l.url);
      }
    });
    // Remember series page HTML: episodes may be selectable in the player itself
    if (round === 0) page.html = res.text;
  }
  return null;
}

// ---------------------------------------------------------------- stream extraction
var MEDIA_EXT = '(?:m3u8|mp4|mkv|webm|mpd|m4v)';
var ABS_MEDIA_RE = new RegExp('(?:https?:)?//[^\\s"\'<>()\\\\]+?\\.' + MEDIA_EXT + '(?:\\?[^\\s"\'<>()\\\\]*)?', 'gi');
var ATTR_MEDIA_RE = new RegExp('(?:src|file|source|url|href|data-src|data-file|data-video|contentUrl|hls|video)["\']?\\s*[=:]\\s*["\']([^"\']+?\\.' + MEDIA_EXT + '(?:\\?[^"\']*)?)["\']', 'gi');

var B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function b64decode(s) {
  s = s.replace(/[^A-Za-z0-9+\/]/g, '');
  var out = '', buf = 0, bits = 0;
  for (var i = 0; i < s.length; i++) {
    buf = (buf << 6) | B64.indexOf(s[i]); bits += 6;
    if (bits >= 8) { bits -= 8; out += String.fromCharCode((buf >> bits) & 0xff); }
  }
  return out;
}

function qualityFrom(url, context) {
  var t = (url + ' ').toLowerCase();
  var m = t.match(/(?:^|[^0-9])(2160|1440|1080|720|576|480|360|240)p?(?:[^0-9]|$)/) || (/\b4k\b|uhd/.test(t) ? ['', '2160'] : null);
  if (!m && context) m = context.toLowerCase().match(/\b(2160|1440|1080|720|576|480|360)p\b/);
  if (!m) return 'Auto';
  return m[1] === '2160' ? '4K' : m[1] + 'p';
}

function extractMedia(html, pageUrl) {
  var found = [], seen = {};
  var text = html.replace(/\\\//g, '/').replace(/\\u0026/gi, '&').replace(/\\u002F/gi, '/').replace(/&amp;/g, '&');
  function add(raw, ctxText) {
    var u = resolveUrl(raw, pageUrl);
    if (!u || seen[u]) return;
    if (/\/(ads?|vast|preroll|trailer|teaser)\//i.test(u)) return;
    seen[u] = 1;
    found.push({ url: u, quality: qualityFrom(u, ctxText) });
  }
  function around(idx) { return stripTags(text.slice(Math.max(0, idx - 200), idx + 80)); }

  var m;
  ABS_MEDIA_RE.lastIndex = 0;
  while ((m = ABS_MEDIA_RE.exec(text))) add(m[0], around(m.index));
  ATTR_MEDIA_RE.lastIndex = 0;
  while ((m = ATTR_MEDIA_RE.exec(text))) add(m[1], around(m.index));

  // <video src> / <source src> without a file extension (e.g. /stream/123)
  var vre = /<(?:video|source)\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi;
  while ((m = vre.exec(text))) {
    var label = (m[0].match(/\b(?:label|res|size|title)\s*=\s*["']([^"']+)["']/i) || [])[1] || '';
    add(m[1], label);
  }
  // JSON-LD / og:video
  var jre = /"contentUrl"\s*:\s*"([^"]+)"/gi;
  while ((m = jre.exec(text))) add(m[1], '');
  var ogre = /<meta[^>]+property=["']og:video(?::url|:secure_url)?["'][^>]+content=["']([^"']+)["']/gi;
  while ((m = ogre.exec(text))) if (new RegExp('\\.' + MEDIA_EXT, 'i').test(m[1])) add(m[1], '');

  // base64-hidden links: atob("...") or long quoted base64 strings
  var bre = /["']([A-Za-z0-9+\/]{24,}={0,2})["']/g;
  while ((m = bre.exec(text))) {
    var dec = b64decode(m[1]);
    if (/^(https?:)?\/\//.test(dec) || /\.(m3u8|mp4|mpd)/i.test(dec)) {
      var inner = dec.match(ABS_MEDIA_RE);
      if (inner) inner.forEach(function (u) { add(u, around(m.index)); });
      else if (/^https?:\/\//.test(dec)) add(dec, around(m.index));
    }
  }
  return found;
}

function extractFrames(html, pageUrl) {
  var out = [], m;
  var re = /<iframe\b[^>]*?\b(?:data-src|src)\s*=\s*["']([^"']+)["']/gi;
  while ((m = re.exec(html))) out.push(m[1]);
  re = /"embedUrl"\s*:\s*"([^"]+)"/gi;
  while ((m = re.exec(html))) out.push(m[1]);
  re = /<meta[^>]+property=["']og:video(?::url)?["'][^>]+content=["']([^"']+)["']/gi;
  while ((m = re.exec(html))) out.push(m[1]);
  var seen = {};
  return out.map(function (u) { return resolveUrl(u, pageUrl); })
    .filter(function (u) {
      if (!u || seen[u] || /youtube\.com|youtu\.be|facebook|twitter|instagram|disqus|google/i.test(u)) return false;
      seen[u] = 1;
      return true;
    });
}

var PLAY_RE = /(^|[^a-z])(play|watch|player|stream|server|پخش|تماشا|مشاهده|سرور)([^a-z]|$)/i;

async function streamsFromPage(url, ctx, depth, referer, html) {
  if (!html) {
    var res = await fetchText(url, ctx, referer || ctx.site.url + '/');
    if (!res) return [];
    html = res.text;
  }
  var media = extractMedia(html, url).map(function (x) { x.referer = url; return x; });
  if (media.length || depth >= 2) return media;

  var frames = extractFrames(html, url).slice(0, 3);
  for (var i = 0; i < frames.length; i++) {
    media = media.concat(await streamsFromPage(frames[i], ctx, depth + 1, url));
  }
  if (media.length || depth > 0) return media;

  // nothing yet: follow "Play"/"Watch"/"Server" links on the same site
  var plays = extractLinks(html, url).filter(function (l) {
    return isOwnSite(l.url, ctx) && l.url !== url && !NAV_RE.test(l.url) && PLAY_RE.test(l.text + ' ' + l.url);
  }).slice(0, 2);
  for (var j = 0; j < plays.length; j++) {
    media = media.concat(await streamsFromPage(plays[j].url, ctx, depth + 1, url));
  }
  return media;
}

var Q_ORDER = { '4K': 0, '1440p': 1, '1080p': 2, '720p': 3, '576p': 4, '480p': 5, '360p': 6, '240p': 7, 'Auto': 8 };

// ---------------------------------------------------------------- entry point
function qRank(q) { return Q_ORDER[q] !== undefined ? Q_ORDER[q] : 9; }

async function streamsFromSite(site, info) {
  var ctx = { fetches: 0, site: site, learned: learnedFor(site) };
  var page = await findTitlePage(info, ctx);
  if (!page) { console.log('[' + site.name + '] no page found for ' + info.names[0]); return []; }

  var media;
  if (info.type === 'tv') {
    var ep = await findEpisodePage(page, info, ctx);
    if (ep) media = await streamsFromPage(ep.url, ctx, 0);
    else if (page.html) {
      // single page with all episodes in the player: keep only links naming this episode
      media = (await streamsFromPage(page.url, ctx, 0, null, page.html)).filter(function (x) {
        return episodeScore(slugText(x.url), info.season, info.episode) >= 0.6;
      });
    } else media = [];
  } else {
    media = await streamsFromPage(page.url, ctx, 0);
  }
  return media.map(function (x) { x.site = site.name; return x; });
}

async function getStreamsAsync(tmdbId, mediaType, season, episode) {
  var type = (mediaType === 'tv' || mediaType === 'series' || mediaType === 'show') ? 'tv' : 'movie';
  var meta = await getTitleInfo(tmdbId, type);
  if (!meta || !meta.names.length) return [];
  var info = { tmdbId: tmdbId, type: type, names: meta.names, year: meta.year,
    season: type === 'tv' ? (+season || 1) : 0, episode: type === 'tv' ? (+episode || 1) : 0 };

  // search every site at the same time; one failing site doesn't affect the others
  var sites = (CONFIG.SITES || []).filter(function (x) { return x && /^https?:\/\//i.test(x.url || ''); })
    .map(function (x) { return { name: x.name || CONFIG.PROVIDER_NAME, url: x.url.replace(/\/+$/, ''), search: x.search }; });
  var results = await Promise.all(sites.map(function (site) {
    return streamsFromSite(site, info).catch(function (err) {
      console.log('[' + site.name + '] error: ' + (err && err.message ? err.message : err));
      return [];
    });
  }));

  var media = [], unique = {};
  results.forEach(function (list) {
    list.forEach(function (x) { if (!unique[x.url]) { unique[x.url] = 1; media.push(x); } });
  });

  var label = meta.names[0] + (type === 'tv' ? ' S' + info.season + 'E' + info.episode : (meta.year ? ' (' + meta.year + ')' : ''));
  return media
    .sort(function (a, b) { return qRank(a.quality) - qRank(b.quality); })
    .map(function (x) {
      var fmt = (x.url.match(/\.(m3u8|mp4|mkv|webm|mpd)/i) || [0, ''])[1].toUpperCase();
      return {
        name: x.site + ' - ' + x.quality,
        title: label + (fmt ? ' • ' + fmt : ''),
        url: x.url,
        quality: x.quality,
        headers: { Referer: x.referer, Origin: originOf(x.referer), 'User-Agent': CONFIG.USER_AGENT },
        provider: 'myfarsi'
      };
    });
}

function getStreams(tmdbId, mediaType, season, episode) {
  return getStreamsAsync(tmdbId, mediaType, season, episode).catch(function (err) {
    console.log('[' + CONFIG.PROVIDER_NAME + '] error: ' + (err && err.message ? err.message : err));
    return [];
  });
}

module.exports = { getStreams: getStreams, _config: CONFIG, _learned: LEARNED };
