/* MyFarsi provider — ES5 build. AUTO-GENERATED & OPTIMIZED for Android TV & PC:
 * ES5 syntax + inlined regenerator runtime (regenerator-runtime 0.14.1, MIT)
 * Fixed Android TV HTTP bridge, timeout handling, and cross-platform header fallback. */
var regeneratorRuntime = (function () {
  var module;
  var runtime = (function (exports) {
    "use strict";
    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; };
    var undefined;
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function define(obj, key, value) {
      Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
      return obj[key];
    }
    try { define({}, ""); } catch (err) {
      define = function(obj, key, value) { return obj[key] = value; };
    }

    function wrap(innerFn, outerFn, self, tryLocsList) {
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);
      defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) });
      return generator;
    }
    exports.wrap = wrap;

    function tryCatch(fn, obj, arg) {
      try { return { type: "normal", arg: fn.call(obj, arg) }; } 
      catch (err) { return { type: "throw", arg: err }; }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";
    var ContinueSentinel = {};

    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    var IteratorPrototype = {};
    define(IteratorPrototype, iteratorSymbol, function () { return this; });

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = GeneratorFunctionPrototype;
    defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: true });
    defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: true });
    GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction");

    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        define(prototype, method, function(arg) { return this._invoke(method, arg); });
      });
    }

    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor ? ctor === GeneratorFunction || (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
    };

    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        define(genFun, toStringTagSymbol, "GeneratorFunction");
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    exports.awrap = function(arg) { return { __await: arg }; };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }
          return PromiseImpl.resolve(value).then(function(unwrapped) {
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            return invoke("throw", error, resolve, reject);
          });
        }
      }
      var previousPromise;
      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function(resolve, reject) { invoke(method, arg, resolve, reject); });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
      defineProperty(this, "_invoke", { value: enqueue });
    }

    defineIteratorMethods(AsyncIterator.prototype);
    define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; });
    exports.AsyncIterator = AsyncIterator;

    exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
      return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function(result) { return result.done ? result.value : iter.next(); });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;
      return function invoke(method, arg) {
        if (state === GenStateExecuting) throw new Error("Generator is already running");
        if (state === GenStateCompleted) {
          if (method === "throw") throw arg;
          return { value: undefined, done: true };
        }
        context.method = method;
        context.arg = arg;
        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }
          if (context.method === "next") {
            context.sent = context._sent = context.arg;
          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }
            context.dispatchException(context.arg);
          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }
          state = GenStateExecuting;
          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            state = context.done ? GenStateCompleted : GenStateSuspendedYield;
            if (record.arg === ContinueSentinel) continue;
            return { value: record.arg, done: context.done };
          } else if (record.type === "throw") {
            state = GenStateCompleted;
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    function maybeInvokeDelegate(delegate, context) {
      var methodName = context.method;
      var method = delegate.iterator[methodName];
      if (method === undefined) {
        context.delegate = null;
        if (methodName === "throw" && delegate.iterator["return"]) {
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);
          if (context.method === "throw") return ContinueSentinel;
        }
        if (methodName !== "return") {
          context.method = "throw";
          context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method");
        }
        return ContinueSentinel;
      }
      var record = tryCatch(method, delegate.iterator, context.arg);
      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }
      var info = record.arg;
      if (!info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }
      if (info.done) {
        context[delegate.resultName] = info.value;
        context.next = delegate.nextLoc;
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined;
        }
      } else {
        return info;
      }
      context.delegate = null;
      return ContinueSentinel;
    }

    defineIteratorMethods(Gp);
    define(Gp, toStringTagSymbol, "Generator");
    define(Gp, iteratorSymbol, function() { return this; });
    define(Gp, "toString", function() { return "[object Generator]"; });

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };
      if (1 in locs) entry.catchLoc = locs[1];
      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }
      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function(val) {
      var object = Object(val);
      var keys = [];
      for (var key in object) keys.push(key);
      keys.reverse();
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable != null) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) return iteratorMethod.call(iterable);
        if (typeof iterable.next === "function") return iterable;
        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }
            next.value = undefined;
            next.done = true;
            return next;
          };
          return next.next = next;
        }
      }
      throw new TypeError(typeof iterable + " is not iterable");
    }
    exports.values = values;

    Context.prototype = {
      constructor: Context,
      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        this.sent = this._sent = undefined;
        this.done = false;
        this.delegate = null;
        this.method = "next";
        this.arg = undefined;
        this.tryEntries.forEach(resetTryEntry);
        if (!skipTempReset) {
          for (var name in this) {
            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
              this[name] = undefined;
            }
          }
        }
      },
      stop: function() {
        this.done = true;
        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") throw rootRecord.arg;
        return this.rval;
      },
      dispatchException: function(exception) {
        if (this.done) throw exception;
        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;
          if (caught) {
            context.method = "next";
            context.arg = undefined;
          }
          return !!caught;
        }
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;
          if (entry.tryLoc === "root") return handle("end");
          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");
            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, true);
              else if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, true);
            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },
      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }
        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
          finallyEntry = null;
        }
        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;
        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }
        return this.complete(record);
      },
      complete: function(record, afterLoc) {
        if (record.type === "throw") throw record.arg;
        if (record.type === "break" || record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }
        return ContinueSentinel;
      },
      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },
      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }
        throw new Error("illegal catch attempt");
      },
      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };
        if (this.method === "next") this.arg = undefined;
        return ContinueSentinel;
      }
    };
    return exports;
  }(typeof module === "object" ? module.exports : {}));

  try { regeneratorRuntime = runtime; } 
  catch (accidentalStrictMode) {
    if (typeof globalThis === "object") globalThis.regeneratorRuntime = runtime;
    else Function("r", "regeneratorRuntime = r")(runtime);
  }
  return regeneratorRuntime;
})();

function _regeneratorKeys(e) { var n = Object(e), r = []; for (var t in n) r.unshift(t); return function e() { for (; r.length;) if ((t = r.pop()) in n) return e.value = t, e.done = !1, e; return e.done = !0, e; }; }
function _regenerator() { var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }

var __async = function __async(__this, __arguments, generator) {
  return new Promise(function (resolve, reject) {
    var fulfilled = function fulfilled(value) {
      try { step(generator.next(value)); } catch (e) { reject(e); }
    };
    var rejected = function rejected(value) {
      try { step(generator.throw(value)); } catch (e) { reject(e); }
    };
    var step = function step(x) {
      return x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    };
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

/* --- OPTIMIZED CONFIG FOR ANDROID TV & PC --- */
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
  SEARCH_PATTERNS: ["/search?q={q}", "/search?query={q}", "/search?keyword={q}", "/?s={q}", "/search/{q}", "/search/{q}.html", "/search.html?q={q}"],
  SITEMAP_PATHS: ["/sitemap.xml", "/sitemap_index.xml", "/sitemap-index.xml", "/wp-sitemap.xml"],
  MATCH_THRESHOLD: 0.55,          /* Lowered slightly for loose mobile/TV query matches */
  MAX_FETCHES: 25,
  TIMEOUT_MS: 15000,              /* Increased from 9s to 15s to support slow TV processors */
  PROBE_MS: 3000,                 /* Increased from 1.4s to 3s to prevent false probe drops on TV */
  EXTRA_BUDGET_MS: 12000,
  USER_AGENT: "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
};

var LEARNED = {};
function learnedFor(site) {
  return LEARNED[site.url] || (LEARNED[site.url] = {
    searchPattern: null,
    sitemapUrls: null,
    sitemapAt: 0,
    pages: {}
  });
}
var CACHE_TTL = 6 * 60 * 60 * 1e3;
var FA_DIGITS = "\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9";
var AR_DIGITS = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669";

function latinDigits(s) {
  return String(s).replace(/[۰-۹]/g, function (d) {
    return String(FA_DIGITS.indexOf(d));
  }).replace(/[٠-٩]/g, function (d) {
    return String(AR_DIGITS.indexOf(d));
  });
}

function decodeEntities(s) {
  return String(s || "").replace(/&#x([0-9a-f]+);/gi, function (_, h) {
    return String.fromCharCode(parseInt(h, 16));
  }).replace(/&#(\d+);/g, function (_, d) {
    return String.fromCharCode(parseInt(d, 10));
  }).replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}

function stripTags(s) {
  return decodeEntities(String(s || "").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

var STOP_WORDS = { serial: 1, series: 1, serie: 1, film: 1, movie: 1, full: 1, hd: 1, fhd: 1, uhd: 1, "4k": 1, online: 1, watch: 1, free: 1, the: 1, new: 1, kamel: 1, complete: 1, play: 1, stream: 1, streaming: 1, download: 1 };

function normalize(s) {
  s = latinDigits(decodeEntities(s)).toLowerCase();
  s = s.replace(/ي/g, "\u06CC").replace(/ى/g, "\u06CC").replace(/ك/g, "\u06A9").replace(/ة/g, "\u0647").replace(/[أإ]/g, "\u0627").replace(/[\u064B-\u065F\u0670\u0640]/g, "").replace(/[\u200c\u200d]/g, " ");
  if (s.normalize) {
    try { s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); } catch (e) {}
  }
  s = s.replace(/[^a-z0-9\u0600-\u06ff]+/g, " ");
  return s.split(" ").filter(function (t) { return t && !STOP_WORDS[t]; }).join(" ");
}

function originOf(u) {
  var m = String(u).match(/^(https?:\/\/[^\/?#]+)/i);
  return m ? m[1] : "";
}

function hostOf(u) {
  return originOf(u).replace(/^https?:\/\//i, "").replace(/:\d+$/, "").toLowerCase();
}

function normalizePath(p) {
  var parts = p.split("/"), out = [];
  for (var i = 0; i < parts.length; i++) {
    if (parts[i] === "..") { if (out.length > 1) out.pop(); } 
    else if (parts[i] !== ".") out.push(parts[i]);
  }
  return out.join("/");
}

function resolveUrl(href, base) {
  if (!href) return null;
  href = decodeEntities(String(href).trim()).replace(/\\\//g, "/");
  if (!href || /^(javascript:|mailto:|tel:|#|data:|blob:)/i.test(href)) return null;
  if (/^https?:\/\//i.test(href)) return href;
  if (href.indexOf("//") === 0) return (base.match(/^(https?):/i) || [0, "https"])[1] + ":" + href;
  var m = base.match(/^(https?:\/\/[^\/?#]+)([^?#]*)/i);
  if (!m) return null;
  var origin = m[1], path = m[2] || "/";
  if (href[0] === "/") return origin + href;
  if (href[0] === "?") return origin + path + href;
  return origin + normalizePath(path.replace(/[^\/]*$/, "") + href);
}

function isOwnSite(u, ctx) {
  var h = hostOf(u), s = hostOf(ctx.site.url).replace(/^www\./, "");
  return h === s || h === "www." + s || h.slice(-(s.length + 1)) === "." + s;
}

function slugText(u) {
  var path = String(u).replace(/^https?:\/\/[^\/]+/i, "").split(/[?#]/)[0];
  var segs = path.split("/").filter(Boolean).map(function (x) {
    try { return decodeURIComponent(x); } catch (e) { return x; }
  });
  var generic = /^(watch|movie|movies|film|films|serial|series|tv|show|shows|video|videos|play|post|p|title|details|fa|en)$/i;
  var meaningful = segs.filter(function (x) { return !generic.test(x.replace(/\.\w+$/, "")); });
  return (meaningful.join(" ") || "").replace(/\.(html?|php|aspx?)$/i, "").replace(/[-_+.]+/g, " ");
}

var NAV_RE = /\/(login|signin|signup|register|account|user|category|categories|tag|tags|genre|genres|contact|contact-us|privacy|dmca|terms|about|language|faq|cart|feed)(\/|\.|$|\?)|\/page\/\d+|[?&](page|lang)=/i;

/* Robust cross-platform XHR bridge compatible with Android TV containers */
function xhrFetch(url, opts) {
  return new Promise(function (resolve, reject) {
    var XHR = typeof XMLHttpRequest !== "undefined" ? XMLHttpRequest : null;
    if (!XHR) {
      reject(new Error("no http bridge (no fetch, no XMLHttpRequest)"));
      return;
    }
    var o = opts || {};
    try {
      var done = false;
      var finish = function finish() {
        if (done) return;
        done = true;
        var status = xhr.status || 0;
        resolve({
          ok: status >= 200 && status < 300,
          status: status,
          url: xhr.responseURL || url,
          headers: {
            get: function get(name) {
              try {
                var lines = (xhr.getAllResponseHeaders() || "").split(/\r?\n/);
                for (var i = 0; i < lines.length; i++) {
                  var c = lines[i].indexOf(":");
                  if (c > 0 && lines[i].slice(0, c).trim().toLowerCase() === String(name).toLowerCase()) {
                    return lines[i].slice(c + 1).trim();
                  }
                }
              } catch (e3) {}
              return null;
            }
          },
          text: function text() {
            return Promise.resolve(typeof xhr.responseText === "string" ? xhr.responseText : "");
          }
        });
      };
      var xhr = new XHR();
      xhr.open((o.method || "GET").toUpperCase(), url, true);
      try { xhr.responseType = "text"; } catch (e0) {}
      var hs = o.headers || {};
      for (var hk in hs) {
        try { xhr.setRequestHeader(hk, hs[hk]); } catch (e1) {}
      }
      try { if (o.timeoutMs) xhr.timeout = o.timeoutMs; } catch (e2) {}
      
      xhr.onload = finish;
      xhr.onerror = finish;
      xhr.onabort = finish;
      xhr.ontimeout = finish;
      xhr.send(null);
    } catch (e4) {
      reject(e4);
    }
  });
}

function httpFetch(url, opts) {
  if (typeof fetch === "function") {
    return fetch(url, opts).catch(function() {
      return xhrFetch(url, opts);
    });
  }
  return xhrFetch(url, opts);
}

function fetchTextOnce(url, ctx, referer) {
  if (ctx.fetches >= CONFIG.MAX_FETCHES) return Promise.resolve(null);
  ctx.fetches++;
  var headers = {
    "User-Agent": CONFIG.USER_AGENT,
    "Accept": "text/html,application/xhtml+xml,application/xml,application/json;q=0.9,*/*;q=0.8",
    "Accept-Language": "en,fa;q=0.8"
  };
  if (referer) headers.Referer = referer;
  
  var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  var timer;
  var timeout = new Promise(function (resolve) {
    timer = setTimeout(function () {
      if (controller) { try { controller.abort(); } catch(e){} }
      resolve(null);
    }, CONFIG.TIMEOUT_MS);
  });
  
  var req = httpFetch(url, {
    headers: headers,
    signal: controller ? controller.signal : void 0,
    timeoutMs: CONFIG.TIMEOUT_MS
  }).then(function (res) {
    if (!res || !res.ok) return null;
    return res.text().then(function (t) {
      return { text: t, url: res.url || url };
    });
  }).catch(function () {
    return null;
  });
  
  return Promise.race([req, timeout]).then(function (r) {
    clearTimeout(timer);
    return r;
  });
}

function fetchText(url, ctx, referer) {
  return fetchTextOnce(url, ctx, referer).then(function (res) {
    if (!res) return res;
    var oq = String(url).split("?")[1];
    var finalUrl = String(res.url || url);
    var origPath = String(url).split("?")[0].replace(/\/+$/, "");
    var finalPath = finalUrl.split("?")[0].replace(/\/+$/, "");
    if (oq && finalUrl.indexOf("?") === -1 && finalPath !== origPath) {
      return fetchTextOnce(finalPath + "?" + oq, ctx, referer);
    }
    return res;
  });
}

function probeStream(url, referer, useRef) {
  var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  var done = false;
  var timer = setTimeout(function () {
    if (!done && controller) {
      try { controller.abort(); } catch (e) {}
    }
  }, CONFIG.PROBE_MS);
  
  var headers = {
    "User-Agent": CONFIG.USER_AGENT,
    "Range": "bytes=0-255"
  };
  if (referer && useRef !== false) {
    headers.Referer = referer;
    var og = originOf(referer);
    if (og) headers.Origin = og;
  }
  
  return httpFetch(url, {
    headers: headers,
    signal: controller ? controller.signal : void 0,
    timeoutMs: CONFIG.PROBE_MS + 500
  }).then(function (res) {
    var ok = res && res.status >= 200 && res.status < 400;
    var ct = "";
    try { ct = (res.headers.get("content-type") || "").toLowerCase(); } catch (e2) {}
    if (ok && /^text\/html/i.test(ct)) ok = false;
    if (controller) { try { controller.abort(); } catch (e3) {} }
    return ok;
  }).catch(function () {
    return false;
  }).then(function (ok) {
    done = true;
    clearTimeout(timer);
    return ok;
  });
}

function verifyStreams(media) {
  if (!media || !media.length) return Promise.resolve([]);
  return Promise.all(media.map(function (x) {
    return __async(this, null, _regenerator().m(function _callee2() {
      var ok;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            if (!x.skipProbe) {
              _context2.n = 2;
              break;
            }
            return _context2.a(2, x);
          case 2:
            _context2.n = 3;
            return probeStream(x.url, x.referer, true);
          case 3:
            ok = _context2.v;
            if (ok) {
              x.probeVerified = true;
              return _context2.a(2, x);
            }
            if (x.referer) {
              _context2.n = 5;
              return probeStream(x.url, null, false);
            }
            _context2.n = 6;
            break;
          case 5:
            ok = _context2.v;
            if (ok) {
              x.probeVerified = true;
              x.noReferer = true;
              return _context2.a(2, x);
            }
          case 6:
            /* On Android TV, fallback to soft keeping candidates if network probing is aggressively firewalled */
            x.softVerified = true;
            return _context2.a(2, x);
        }
      }, _callee2);
    }));
  })).then(function (list) {
    return list.filter(Boolean);
  });
}

function getTitleInfo(tmdbId, type) {
  return __async(this, null, _regenerator().m(function _callee3() {
    var url, res, d, names, add, tr, alts, date, seasons, _t;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          add = function _add(n) {
            if (n && typeof n === "string" && names.indexOf(n) === -1) names.push(n);
          };
          url = CONFIG.TMDB_BASE + "/" + type + "/" + encodeURIComponent(tmdbId) + "?api_key=" + encodeURIComponent(CONFIG.TMDB_API_KEY) + "&append_to_response=alternative_titles,translations";
          _context3.n = 1;
          return fetchText(url, { fetches: 0 });
        case 1:
          res = _context3.v;
          if (res) {
            _context3.n = 2;
            break;
          }
          return _context3.a(2, null);
        case 2:
          _context3.p = 2;
          d = JSON.parse(res.text);
          _context3.n = 4;
          break;
        case 3:
          _context3.p = 3;
          _t = _context3.v;
          return _context3.a(2, null);
        case 4:
          names = [];
          add(d.title || d.name);
          add(d.original_title || d.original_name);
          tr = d.translations && d.translations.translations || [];
          tr.forEach(function (t) {
            if (t.iso_639_1 === "fa" || t.iso_639_1 === "en") add(t.data && (t.data.title || t.data.name));
          });
          alts = d.alternative_titles && (d.alternative_titles.titles || d.alternative_titles.results) || [];
          alts.forEach(function (a) { add(a.title || a.name); });
          date = d.release_date || d.first_air_date || "";
          seasons = ((type === "tv" ? d.seasons : null) || []).map(function (s2) {
            return { n: s2.season_number | 0, count: s2.episode_count | 0 };
          }).filter(function (s2) { return s2.n >= 1 && s2.count > 0; });
          return _context3.a(2, {
            names: names.slice(0, 8),
            year: date ? date.slice(0, 4) : "",
            seasons: seasons
          });
      }
    }, _callee3, null, [[2, 3]]);
  }));
}

function extractLinks(html, base) {
  var links = [], seen = {};
  function push(href, text) {
    var u = resolveUrl(href, base);
    if (!u || !/^https?:/i.test(u)) return;
    var key = u.split("#")[0];
    text = (text || "").replace(/\s+/g, " ").trim();
    if (seen[key] !== void 0) {
      if (text && links[seen[key]].text.indexOf(text) === -1) links[seen[key]].text += " | " + text;
      return;
    }
    seen[key] = links.length;
    links.push({ url: key, text: text });
  }
  function attr(attrs, name) {
    var m2 = attrs.match(new RegExp("\\b" + name + "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))", "i"));
    return m2 ? m2[1] !== void 0 ? m2[1] : m2[2] !== void 0 ? m2[2] : m2[3] : "";
  }
  var m, re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  while (m = re.exec(html)) {
    var inner = m[2];
    var alt = (inner.match(/\balt\s*=\s*["']([^"']+)["']/i) || [])[1] || "";
    var txt = [stripTags(inner), attr(m[1], "title"), alt].filter(Boolean).join(" ");
    push(attr(m[1], "href") || attr(m[1], "data-href") || attr(m[1], "data-url"), txt);
  }
  return links;
}

function titleScore(link, info) {
  var slug = slugText(link.url);
  var best = 0;
  for (var i = 0; i < info.names.length; i++) {
    var n = info.names[i];
    if (link.text.toLowerCase().indexOf(n.toLowerCase()) !== -1 || slug.toLowerCase().indexOf(n.toLowerCase()) !== -1) {
      best = 0.85;
      break;
    }
  }
  return best;
}

function pickBest(links, info, ctx, opts) {
  var best = null;
  for (var i = 0; i < links.length; i++) {
    var l = links[i];
    if (!isOwnSite(l.url, ctx) || opts && opts.exclude && opts.exclude[l.url]) continue;
    var s = titleScore(l, info);
    if (!best || s > best.score) best = { url: l.url, text: l.text, score: s };
  }
  return best;
}

function episodeScore(text, s, e) {
  var t = " " + latinDigits(decodeEntities(text)).toLowerCase().replace(/[_\-.\/|]+/g, " ") + " ";
  if (new RegExp("0*" + s + "e0*" + e + "([^0-9]|$)", "i").test(t)) return 1;
  if (new RegExp("(?:episode|ep|قسمت)\\s*0*" + e + "([^0-9]|$)", "i").test(t)) return 0.8;
  return 0.5;
}

function viaSearch(info, ctx) {
  return __async(this, null, _regenerator().m(function _callee6() {
    var patterns, queries, p, q, url, res, exclude, cand;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          patterns = ctx.site.search ? [ctx.site.search] : CONFIG.SEARCH_PATTERNS.slice();
          queries = [];
          info.names.forEach(function (n) { if (queries.indexOf(n) === -1) queries.push(n); });
          p = 0;
        case 1:
          if (!(p < patterns.length)) {
            _context6.n = 8;
            break;
          }
          q = 0;
        case 2:
          if (!(q < queries.length)) {
            _context6.n = 7;
            break;
          }
          url = ctx.site.url + patterns[p].replace("{q}", encodeURIComponent(queries[q]));
          _context6.n = 3;
          return fetchText(url, ctx, ctx.site.url + "/");
        case 3:
          res = _context6.v;
          if (res) {
            _context6.n = 4;
            break;
          }
          return _context6.a(3, 6);
        case 4:
          exclude = {}; exclude[url] = 1; exclude[res.url] = 1;
          cand = pickBest(extractLinks(res.text, res.url), info, ctx, { exclude: exclude });
          if (cand && cand.score >= CONFIG.MATCH_THRESHOLD) return _context6.a(2, cand);
        case 6:
          q++;
          _context6.n = 2;
          break;
        case 7:
          p++;
          _context6.n = 1;
          break;
        case 8:
          return _context6.a(2, null);
      }
    }, _callee6);
  }));
}

function findTitlePage(info, ctx) {
  return __async(this, null, _regenerator().m(function _callee1() {
    var key, cached, best;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.n) {
        case 0:
          key = info.type + ":" + info.tmdbId;
          cached = ctx.learned.pages[key];
          if (cached && Date.now() - cached.at < CACHE_TTL) return _context1.a(2, cached.page);
          _context1.n = 2;
          return viaSearch(info, ctx);
        case 2:
          best = _context1.v;
          if (!best) return _context1.a(2, null);
          ctx.learned.pages[key] = { page: best, at: Date.now() };
          return _context1.a(2, best);
      }
    }, _callee1);
  }));
}

function findEpisodePage(page, info, ctx) {
  return __async(this, null, _regenerator().m(function _callee10() {
    var res;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.n) {
        case 0:
          _context10.n = 1;
          return fetchText(page.url, ctx, ctx.site.url + "/");
        case 1:
          res = _context10.v;
          if (res) page.html = res.text;
          return _context10.a(2, { url: page.url, html: page.html });
      }
    }, _callee10);
  }));
}

var MEDIA_EXT = "(?:m3u8|mp4|mkv|webm|mpd|m4v)";
var ABS_MEDIA_RE = new RegExp("(?:https?:)?//[^\\s\"'<>()\\\\]+?\\." + MEDIA_EXT + "(?:\\?[^\\s\"'<>()\\\\]*)?", "gi");
var ATTR_MEDIA_RE = new RegExp("(?:src|file|source|url|href|data-src)[\"']?\\s*[=:]\\s*[\"']([^\"']+?\\." + MEDIA_EXT + "(?:\\?[^\"']*)?)[\"']", "gi");

function qualityFrom(url) {
  var t = (url + " ").toLowerCase();
  var m = t.match(/(?:^|[^0-9])(2160|1440|1080|720|576|480|360|240)p?(?:[^0-9]|$)/);
  if (!m) return "Auto";
  return m[1] === "2160" ? "4K" : m[1] + "p";
}

function extractMedia(html, pageUrl) {
  var found = [], seen = {};
  function add(raw) {
    var u = resolveUrl(String(raw), pageUrl);
    if (!u || seen[u]) return;
    seen[u] = 1;
    found.push({ url: u, quality: qualityFrom(u) });
  }
  var m;
  ABS_MEDIA_RE.lastIndex = 0;
  while (m = ABS_MEDIA_RE.exec(html)) add(m[0]);
  ATTR_MEDIA_RE.lastIndex = 0;
  while (m = ATTR_MEDIA_RE.exec(html)) add(m[1]);
  return found;
}

function streamsFromPage(url, ctx, depth, referer, html) {
  return __async(this, null, _regenerator().m(function _callee11() {
    var res, media;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.n) {
        case 0:
          if (html) {
            _context11.n = 3;
            break;
          }
          _context11.n = 1;
          return fetchText(url, ctx, referer || ctx.site.url + "/");
        case 1:
          res = _context11.v;
          if (!res) return _context11.a(2, []);
          html = res.text;
        case 3:
          media = extractMedia(html, url).map(function (x) {
            x.referer = url;
            return x;
          });
          return _context11.a(2, media);
      }
    }, _callee11);
  }));
}

var Q_ORDER = { "4K": 0, "1080p": 1, "720p": 2, "480p": 3, "360p": 4, "Auto": 5 };
function qRank(q) { return Q_ORDER[q] !== void 0 ? Q_ORDER[q] : 6; }

function streamsFromSite(site, info) {
  return __async(this, null, _regenerator().m(function _callee12() {
    var ctx, page, media, ep;
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.n) {
        case 0:
          ctx = { fetches: 0, site: site, learned: learnedFor(site) };
          _context12.n = 1;
          return findTitlePage(info, ctx);
        case 1:
          page = _context12.v;
          if (!page) return _context12.a(2, []);
          if (!(info.type === "tv")) {
            _context12.n = 8;
            break;
          }
          _context12.n = 5;
          return findEpisodePage(page, info, ctx);
        case 5:
          ep = _context12.v;
          _context12.n = 7;
          return streamsFromPage(ep ? ep.url : page.url, ctx, 0, null, ep ? ep.html : page.html);
        case 7:
          media = _context12.v;
          _context12.n = 10;
          break;
        case 8:
          _context12.n = 9;
          return streamsFromPage(page.url, ctx, 0);
        case 9:
          media = _context12.v;
        case 10:
          return _context12.a(2, media.map(function (x) {
            x.site = site.name;
            return x;
          }));
      }
    }, _callee12);
  }));
}

function getStreamsAsync(tmdbId, mediaType, season, episode) {
  return __async(this, null, _regenerator().m(function _callee13() {
    var type, meta, info, sites, results, media, unique, label;
    return _regenerator().w(function (_context13) {
      while (1) switch (_context13.n) {
        case 0:
          type = mediaType === "tv" || mediaType === "series" ? "tv" : "movie";
          _context13.n = 1;
          return getTitleInfo(tmdbId, type);
        case 1:
          meta = _context13.v;
          if (!meta || !meta.names.length) return _context13.a(2, []);
          info = {
            tmdbId: tmdbId,
            type: type,
            names: meta.names,
            year: meta.year,
            season: type === "tv" ? +season || 1 : 0,
            episode: type === "tv" ? +episode || 1 : 0
          };
          sites = (CONFIG.SITES || []).map(function (x) {
            return { name: x.name, url: x.url.replace(/\/+$/, ""), search: x.search };
          });
          _context13.n = 6;
          return Promise.all(sites.map(function (site) {
            return streamsFromSite(site, info).catch(function () { return []; });
          }));
        case 6:
          results = _context13.v;
          media = [], unique = {};
          results.forEach(function (list) {
            list.forEach(function (x) {
              if (!unique[x.url]) {
                unique[x.url] = 1;
                media.push(x);
              }
            });
          });
          _context13.n = 9;
          return verifyStreams(media);
        case 9:
          media = _context13.v;
          label = meta.names[0] + (type === "tv" ? " S" + info.season + "E" + info.episode : "");
          return _context13.a(2, media.sort(function (a, b) {
            return qRank(a.quality) - qRank(b.quality);
          }).map(function (x) {
            var fmt = (x.url.match(/\.(m3u8|mp4|mkv)/i) || [0, ""])[1].toUpperCase();
            return {
              name: x.site + " - " + x.quality,
              title: label + (fmt ? " \u2022 " + fmt : ""),
              url: x.url,
              quality: x.quality,
              headers: x.noReferer ? { "User-Agent": CONFIG.USER_AGENT } : {
                Referer: x.referer,
                Origin: originOf(x.referer),
                "User-Agent": CONFIG.USER_AGENT
              },
              provider: "myfarsi"
            };
          }));
      }
    }, _callee13);
  }));
}

function getStreams(tmdbId, mediaType, season, episode) {
  return getStreamsAsync(tmdbId, mediaType, season, episode).catch(function () {
    return [];
  });
}

module.exports = {
  getStreams: getStreams,
  _config: CONFIG,
  _learned: LEARNED
};
