/* MyFarsi provider — Pure ES5 Promise-based build for Nuvio (Android TV & PC compatible) */

var CONFIG = {
  SITES: [{
    name: "MyFarsi",
    url: "https://mobile.namakade.com:8443",
    search: "/search?page=search&searchField={q}"
  }, {
    name: "LiveFarsi",
    url: "https://www.diycraftsguide.com",
    search: "/search?q={q}"
  }],
  PROVIDER_NAME: "MyFarsi",
  TMDB_API_KEY: "570e659354bbb65a671cd0f627f65aab",
  TMDB_BASE: "https://api.themoviedb.org/3",
  USER_AGENT: "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
  TIMEOUT_MS: 12000
};

function decodeEntities(s) {
  return String(s || "").replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}

function stripTags(s) {
  return decodeEntities(String(s || "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function resolveUrl(href, base) {
  if (!href) return null;
  href = decodeEntities(String(href).trim());
  if (/^https?:\/\//i.test(href)) return href;
  if (href.indexOf("//") === 0) return "https:" + href;
  var m = base.match(/^(https?:\/\/[^\/?#]+)/i);
  if (!m) return null;
  return href[0] === "/" ? m[1] + href : m[1] + "/" + href;
}

function safeFetch(url) {
  var fetchFn = typeof fetch === "function" ? fetch : null;
  if (!fetchFn) return Promise.resolve(null);
  
  return fetchFn(url, {
    headers: {
      "User-Agent": CONFIG.USER_AGENT,
      "Accept": "text/html,application/json,*/*"
    }
  }).then(function(res) {
    if (!res.ok) return null;
    return res.text();
  }).catch(function() {
    return null;
  });
}

function getTitleInfo(tmdbId, type) {
  var url = CONFIG.TMDB_BASE + "/" + type + "/" + encodeURIComponent(tmdbId) + "?api_key=" + encodeURIComponent(CONFIG.TMDB_API_KEY) + "&append_to_response=alternative_titles";
  return safeFetch(url).then(function(text) {
    if (!text) return null;
    try {
      var d = JSON.parse(text);
      var names = [d.title || d.name, d.original_title || d.original_name].filter(Boolean);
      var date = d.release_date || d.first_air_date || "";
      return {
        names: names,
        year: date ? date.slice(0, 4) : ""
      };
    } catch (e) {
      return null;
    }
  });
}

function extractStreams(html, pageUrl) {
  var found = [], seen = {};
  var regex = /(?:src|file|url|href)\s*=\s*["']([^"']+?\.(?:m3u8|mp4|mkv)(?:\?[^"']*)?)["']/gi;
  var m;
  while ((m = regex.exec(html)) !== null) {
    var u = resolveUrl(m[1], pageUrl);
    if (u && !seen[u]) {
      seen[u] = true;
      var quality = u.indexOf("1080") !== -1 ? "1080p" : (u.indexOf("720") !== -1 ? "720p" : "Auto");
      found.push({
        url: u,
        quality: quality
      });
    }
  }
  return found;
}

function getStreams(tmdbId, mediaType, season, episode) {
  var type = (mediaType === "tv" || mediaType === "series") ? "tv" : "movie";
  
  return getTitleInfo(tmdbId, type).then(function(meta) {
    if (!meta || !meta.names.length) return [];
    var query = encodeURIComponent(meta.names[0]);
    var site = CONFIG.SITES[0];
    var searchUrl = site.url + site.search.replace("{q}", query);
    
    return safeFetch(searchUrl).then(function(html) {
      if (!html) return [];
      
      // Simple link parser to find detail page
      var linkRegex = /href\s*=\s*["']([^"']+)["']/gi;
      var match, detailUrl = "";
      while ((match = linkRegex.exec(html)) !== null) {
        var candidate = resolveUrl(match[1], site.url);
        if (candidate && candidate.indexOf(site.url) !== -1 && !detailUrl) {
          detailUrl = candidate;
          break;
        }
      }
      
      if (!detailUrl) return [];
      
      return safeFetch(detailUrl).then(function(detailHtml) {
        if (!detailHtml) return [];
        var rawStreams = extractStreams(detailHtml, detailUrl);
        
        var label = meta.names[0] + (type === "tv" ? " S" + season + "E" + episode : "");
        return rawStreams.map(function(x) {
          return {
            name: CONFIG.PROVIDER_NAME + " - " + x.quality,
            title: label,
            url: x.url,
            quality: x.quality,
            headers: {
              "User-Agent": CONFIG.USER_AGENT,
              "Referer": detailUrl
            },
            provider: "myfarsi"
          };
        });
      });
    });
  }).catch(function(err) {
    console.log("[MyFarsi Error]:", err);
    return [];
  });
}

module.exports = {
  getStreams: getStreams
};
