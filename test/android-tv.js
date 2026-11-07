const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const code = fs.readFileSync(path.join(__dirname, '..', 'providers', 'myfarsi.js'), 'utf8');
const video = 'https://media.test/movie-1080.mp4';
function load(globals = {}) {
  const calls = [];
  const context = vm.createContext({
    module: { exports: {} },
    console: { log() {} },
    fetch(url) {
      calls.push(url);
      let body;
      if (url.includes('api.themoviedb.org')) {
        body = JSON.stringify({ title: 'Example Movie', release_date: '2023-01-01' });
      } else if (url.startsWith('https://site.test/search?')) {
        body = '<a href="/example-movie-2023">Example Movie (2023)</a>';
      } else if (url === 'https://site.test/example-movie-2023') {
        body = '<video src="' + video + '"></video>';
      } else if (url === video) {
        body = '';
      }
      return Promise.resolve({
        ok: body !== undefined, status: body === undefined ? 404 : 200, url,
        headers: { get: () => url === video ? 'video/mp4' : 'text/html' },
        text: () => Promise.resolve(body || '')
      });
    },
    ...globals
  });
  vm.runInContext(code, context);
  context.module.exports._config.SITES = [
    { name: 'Fixture', url: 'https://site.test', search: '/search?q={q}' }
  ];
  return { context, calls, provider: context.module.exports };
}

(async () => {
  // No timer, URL, XMLHttpRequest or AbortController globals, like an embedded host.
  const tv = load();
  const streams = await tv.provider.getStreams('101', 'movie');
  assert.equal(streams.length, 1);
  assert.equal(streams[0].url, video);
  assert.equal(streams[0].headers.Referer, 'https://site.test/example-movie-2023');
  assert(tv.calls.includes(video), 'stream verification must run without timers');
  assert(!streams[0].name.startsWith('DIAG'));
  console.log('PASS  Android TV without browser globals: lookup, extraction and verification');

  const fallback = await tv.context.delayFallback(2500);
  assert.equal(JSON.stringify(fallback), '[[],[]]');
  console.log('PASS  Android TV without timers: grace-period fallback settles');

  // Force the slow-source branch while leaving the extra source pending forever.
  vm.runInContext(`
    CONFIG.EXTRA_BUDGET_MS = -1;
    dailymotionSource = function () { return new Promise(function () {}); };
  `, tv.context);
  const slowStreams = await tv.provider.getStreams('102', 'movie');
  assert.equal(slowStreams[0].url, video);
  console.log('PASS  Slow extra source cannot hold up results on a host without timers');

  const browser = load({ setTimeout, clearTimeout, AbortController });
  assert.equal((await browser.provider.getStreams('101', 'movie'))[0].url, video);
  console.log('PASS  Timer-enabled hosts still return streams');

  let aborted = false;
  const stalled = load({
    setTimeout, clearTimeout, AbortController,
    fetch(url, options) {
      options.signal.addEventListener('abort', () => { aborted = true; });
      return new Promise(() => {});
    }
  });
  stalled.provider._config.TIMEOUT_MS = 5;
  assert.equal(await stalled.context.fetchTextOnce('https://stalled.test', { fetches: 0 }), null);
  assert(aborted, 'a real timer must still abort a stalled request');
  console.log('PASS  Timer-enabled hosts retain request timeouts and cancellation');
})().catch(error => { console.error(error); process.exitCode = 1; });
