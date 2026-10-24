/*
 * Offline tests: fetch is mocked, so no real network is used.
 * Three mock sites with completely different layouts check that the scraper adapts.
 *   Site A: working search page, JS player config, season sub-pages, homepage fallback
 *   Site B: no search at all, sitemap index via robots.txt, iframe player with base64 link,
 *           episodes in a <select>, JSON-LD on the episode page
 *   Site C: search ignores the query (returns homepage), titles only in a listing page as
 *           clickable <div data-href>, separate "Watch" page, extension-less <video src>
 */
const path = require('path');

const TMDB = {
  'movie/101': { title: "Leila's Brothers", original_title: 'برادران لیلا', release_date: '2022-05-25' },
  'tv/202': { name: 'Capital', original_name: 'پایتخت', first_air_date: '2011-03-20',
    alternative_titles: { results: [{ iso_3166_1: 'IR', title: 'Paytakht' }] } },
  'tv/303': { name: 'Killing Wound', original_name: 'زخم کاری', first_air_date: '2021-06-01' },
  'movie/404': { title: 'Antique', original_title: 'آنتیک', release_date: '2023-01-10',
    translations: { translations: [{ iso_639_1: 'en', data: { title: 'Antik' } }] } },
  'movie/505': { title: 'Not On Any Site', original_title: 'هیچ', release_date: '2020-01-01' }
};

const page = (body) => `<!doctype html><html><head><title>x</title></head><body>
<nav><a href="/">Home</a><a href="/category/drama">Drama</a><a href="/user/login">Login</a></nav>${body}</body></html>`;

// ---------------- Site A
const A = {
  '/search': (u) => {
    const q = (u.searchParams.get('q') || '').toLowerCase();
    const items = [['Baradaran Leila', '/watch/baradaran-leilaa-hd.html'], ['Leila', '/watch/leila-1997.html']]
      .filter(([n]) => q && n.toLowerCase().includes(q.split(' ')[0].replace(/'s$/, '')));
    return page(`<h1>Results</h1>` + items.map(([n, h]) =>
      `<div class="card"><a href="${h}"><img src="/t.jpg" alt="${n}"></a><h3>${n}</h3></div>`).join(''));
  },
  '/': () => page(`<section><h2>Latest Series</h2>
      <div class="card"><a href="/watch/payetakht-hd1.html" title="Payetakht watch Online"><img alt="Payetakht"></a></div>
      <div class="card"><a href="/watch/payetakht-kids.html">Payetakht Kids Special 2019</a></div>
      <div class="card"><a href="/watch/pelake-13.html">Pelake 13</a></div></section>`),
  '/watch/baradaran-leilaa-hd.html': () => page(`<h1>Baradaran Leila</h1>
      <video controls><source src="/media/bl/720.mp4" label="720p"><source src="/media/bl/1080.mp4" label="1080p"></video>`),
  '/watch/leila-1997.html': () => page(`<h1>Leila (1997)</h1><video src="/media/leila/x.mp4"></video>`),
  '/watch/payetakht-hd1.html': () => page(`<h1>Payetakht</h1>
      <div class="seasons"><a href="/watch/payetakht-fasl-1.html">Fasl 1</a><a href="/watch/payetakht-fasl-2.html">Fasl 2</a></div>`),
  '/watch/payetakht-fasl-2.html': () => page(`<h1>Payetakht - Fasl 2</h1><ul>` +
      [1, 2, 3, 4].map(n => `<li><a href="/watch/payetakht-f2-e${n}.html">Fasl 2 Episode ${String(n).padStart(2, '0')}</a></li>`).join('') + '</ul>'),
  '/watch/payetakht-f2-e3.html': () => page(`<div id="player"></div><script>
      jwplayer("player").setup({"sources":[{"file":"https:\\/\\/cdn.site-a.test\\/hls\\/pt\\/s2e3\\/1080\\/index.m3u8","label":"1080p"},
      {"file":"https:\\/\\/cdn.site-a.test\\/hls\\/pt\\/s2e3\\/720\\/index.m3u8","label":"720p"}]});</script>`)
};

// ---------------- Site B
const B = {
  '/robots.txt': () => 'User-agent: *\nSitemap: https://site-b.test/maps/index.xml\n',
  '/maps/index.xml': () => `<?xml version="1.0"?><sitemapindex><sitemap><loc>https://site-b.test/maps/pages.xml</loc></sitemap>
      <sitemap><loc>https://site-b.test/maps/series.xml</loc></sitemap><sitemap><loc>https://site-b.test/maps/movies.xml</loc></sitemap></sitemapindex>`,
  '/maps/pages.xml': () => `<urlset><url><loc>https://site-b.test/about</loc></url></urlset>`,
  '/maps/series.xml': () => `<urlset><url><loc>https://site-b.test/series/zakhme-kari/</loc></url>
      <url><loc>https://site-b.test/series/zakhm/</loc></url><url><loc>https://site-b.test/series/kari-kids/</loc></url></urlset>`,
  '/maps/movies.xml': () => `<urlset><url><loc>https://site-b.test/films/antik-1998/</loc></url></urlset>`,
  '/series/zakhme-kari/': () => page(`<h1>زخم کاری</h1><select id="eps" onchange="location=this.value">` +
      [1, 2, 3, 4, 5, 6].map(n => `<option value="/series/zakhme-kari/s01e0${n}/">قسمت ${'۰۱۲۳۴۵۶۷۸۹'[n]}</option>`).join('') +
      `</select><iframe src="https://www.youtube.com/embed/trailer"></iframe>`),
  '/series/zakhme-kari/s01e05/': () => page(`<script type="application/ld+json">{"@type":"VideoObject","name":"Zakhm Kari E05",
      "embedUrl":"https://player.site-b.test/embed/zk5"}</script><iframe data-src="https://player.site-b.test/embed/zk5"></iframe>`),
  'player:/embed/zk5': () => `<html><script>var src = atob("${Buffer.from('https://media.site-b.test/v/zk/s1e5/master.m3u8').toString('base64')}");
      player.load(src);</script></html>`
};

// ---------------- Site C
const C = {
  '/': () => page(`<div class="menu"><a href="/list/movies">Movies A-Z</a><a href="/list/series">Series</a></div><p>Welcome</p>`),
  '/list/movies': () => page(`<div class="grid">
      <div class="item" data-href="/t/1171" title="Antik">Antik (2023)</div>
      <div class="item" data-href="/t/0988">Antik (1998)</div>
      <div class="item" data-href="/t/1170">Khab Nama</div></div>`),
  '/list/series': () => page(`<p>none</p>`),
  '/t/1171': () => page(`<h1>Antik</h1><p>2023</p><a class="btn" href="/t/1171/play">▶ Watch now</a>`),
  '/t/1171/play': () => page(`<video id="v" src="/stream/1171?token=abc"></video>`),
  '/t/0988': () => page(`<video src="/stream/0988"></video>`)
};

const SITES = { 'site-a.test': A, 'site-b.test': B, 'player.site-b.test': B, 'site-c.test': C };

function mockFetch(url) {
  const u = new URL(url);
  let body = null;
  if (u.hostname === 'api.themoviedb.org') {
    const key = u.pathname.replace('/3/', '');
    if (TMDB[key]) body = JSON.stringify(TMDB[key]);
  } else if (SITES[u.hostname]) {
    const routes = SITES[u.hostname];
    const prefix = u.hostname.startsWith('player.') ? 'player:' : '';
    let h = routes[prefix + u.pathname];
    // Site C "search": /?s= is served by the homepage, every other search path 404s
    if (h) body = h(u);
  }
  const ok = body !== null;
  return Promise.resolve({ ok, status: ok ? 200 : 404, url, text: () => Promise.resolve(ok ? body : 'Not found') });
}
global.fetch = mockFetch;

function freshProvider(bases) {
  const file = path.join(__dirname, '..', 'providers', 'myfarsi.js');
  delete require.cache[require.resolve(file)];
  const p = require(file);
  p._config.SITES = [].concat(bases).map((url, i) => ({ name: 'Site' + 'ABC'[i], url }));
  p._config.TMDB_API_KEY = 'test';
  return p;
}

let failures = 0;
async function check(name, base, args, expect) {
  const p = freshProvider(base);
  const t0 = Date.now();
  const out = await p.getStreams(...args);
  const urls = out.map(s => s.url);
  const ok = expect(urls, out);
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}  (${Date.now() - t0}ms)`);
  out.forEach(s => console.log(`        ${s.name.padEnd(16)} ${s.url}`));
  if (!out.length) console.log('        (no streams)');
}

(async () => {
  await check('A movie: Persian original -> Finglish slug, <source> tags', 'https://site-a.test', ['101', 'movie'],
    u => u.length === 2 && u[0].endsWith('/media/bl/1080.mp4') && u[1].endsWith('/media/bl/720.mp4'));
  await check('A series S2E3: search misses -> homepage crawl, season sub-page, escaped JS config', 'https://site-a.test', ['202', 'tv', 2, 3],
    u => u.length === 2 && u.every(x => x.includes('/s2e3/')) && u[0].includes('/1080/'));
  await check('B series S1E5: sitemap index via robots.txt, <select> in Persian digits, iframe + base64', 'https://site-b.test', ['303', 'tv', 1, 5],
    u => u.length === 1 && u[0] === 'https://media.site-b.test/v/zk/s1e5/master.m3u8');
  await check('C movie: data-href grid, year picks 2023 not 1998, Watch sub-page, extension-less src', 'https://site-c.test', ['404', 'movie'],
    u => u.length === 1 && u[0] === 'https://site-c.test/stream/1171?token=abc');
  await check('Multi-site: all three sites searched together, results labelled per site', ['https://site-a.test', 'https://site-b.test', 'https://site-c.test'], ['101', 'movie'],
    (u, out) => u.length === 2 && out.every(s => s.name.startsWith('SiteA')));
  await check('Multi-site: title only on the third site is still found', ['https://site-a.test', 'https://site-b.test', 'https://site-c.test'], ['404', 'movie'],
    (u, out) => u.length === 1 && out[0].name === 'SiteC - Auto');
  await check('Title not on site returns nothing', 'https://site-c.test', ['505', 'movie'], u => u.length === 0);
  await check('Episode that does not exist returns nothing', 'https://site-b.test', ['303', 'tv', 1, 9], u => u.length === 0);

  const p = freshProvider('https://site-c.test');
  const s = await p.getStreams('404', 'movie');
  const h = s[0] && s[0].headers;
  const hdrOk = h && h.Referer === 'https://site-c.test/t/1171/play' && h.Origin === 'https://site-c.test';
  if (!hdrOk) failures++;
  console.log(`${hdrOk ? 'PASS' : 'FAIL'}  Referer/Origin headers set from the page the link came from`);

  console.log(failures ? `\n${failures} test(s) failed` : '\nAll tests passed');
  process.exit(failures ? 1 : 0);
})();
