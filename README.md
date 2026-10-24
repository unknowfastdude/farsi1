# MyFarsi — adaptive Nuvio scraper for your own site

Finds movies and episodes on your licensed site by reading its HTML, and keeps working when you
change page layouts or URL formats. It doesn't depend on fixed selectors or URL patterns.

## Setup (2 minutes)
1. Open `src/myfarsi.js` and edit the `CONFIG` block at the top:
   - `SITES` → one line per site. All of them are searched in parallel:
     ```js
     SITES: [
       { name: 'MyFarsi', url: 'https://myfarsi.com' },
       { name: 'MyFarsi Kids', url: 'https://kids.myfarsi.com', search: '/find?term={q}' },
     ],
     ```
     `name` is the label shown in Nuvio, and `search` is optional.
   - `TMDB_API_KEY` → free key from themoviedb.org (Settings → API)
2. Build: `npm install` then `npm run build` → writes `providers/myfarsi.js` (what Nuvio loads)
3. Test: `npm test` (offline, uses mock sites)
4. Push to a public GitHub repo. In Nuvio: Settings → Plugins → Add repository:
   `https://raw.githubusercontent.com/<you>/<repo>/refs/heads/main`
   (some versions want the full `.../manifest.json` URL)

## How it adapts
**Finding the title page**, trying each until one matches:
1. Your site's search, trying common URL patterns. The one that works is remembered for the session.
2. `sitemap.xml`, including sitemap indexes listed in `robots.txt`
3. Crawling the homepage plus listing pages (Movies, Series, A–Z…)

Links are scored by fuzzy title matching against every name TMDB has (English, original Persian,
alternates). It tolerates Finglish spelling (پایتخت = Paytakht = Payetakht), Persian/Arabic
digits, stop-words like "serial", "watch online" and "HD", and uses the release year to separate
remakes and same-name titles.

**Finding the episode** works from link text or URL: `Episode 03`, `E3`, `S01E03`, `Fasl 2 Episode 3`,
`قسمت ۳`, bare numbers in episode grids, `<select>` dropdowns and clickable `data-href` elements.
It follows season sub-pages when needed.

**Finding the video** works with whatever the player uses: `<video>`/`<source>`, JS player configs
(including escaped JSON), JSON-LD, og:video, base64-encoded links, iframes (two levels deep),
and separate "Play"/"Watch"/"Server" pages. It sends the right Referer/Origin headers.

## Tuning
- Wrong title picked → raise `MATCH_THRESHOLD` (e.g. 0.7)
- Nothing found → lower it (e.g. 0.55), or add your search pattern / sitemap path
- Slow → lower `MAX_FETCHES`

Tip: a sitemap.xml on your site makes lookups faster and more reliable.

## Files
- `src/myfarsi.js` — source (edit this)
- `providers/myfarsi.js` — built output for Nuvio (don't edit by hand)
- `manifest.json` — repository manifest
- `test/run-tests.js` — offline tests against three mock site layouts
