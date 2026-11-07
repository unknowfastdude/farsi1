/* Generated from src/myfarsi.js by npm run build. */
/* MyFarsi provider source. Kept in ES5 syntax for embedded JavaScript runtimes.
 * Edit this file and run npm run build to update providers/myfarsi.js.
 * Includes regenerator-runtime 0.14.1 (MIT) and generated async helpers. */
var regeneratorRuntime = (function () {
  var module; // shadow outer CommonJS module — keep runtime off provider exports
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; };
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) });

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: true });
  defineProperty(
    GeneratorFunctionPrototype,
    "constructor",
    { value: GeneratorFunction, configurable: true }
  );
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
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

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    defineProperty(this, "_invoke", { value: enqueue });
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per GeneratorResume behavior specified since ES2015:
        // ES2015 spec, step 3: https://262.ecma-international.org/6.0/#sec-generatorresume
        // Latest spec, step 2: https://tc39.es/ecma262/#sec-generatorresume
        return doneResult();
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
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
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
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method;
    var method = delegate.iterator[methodName];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method, or a missing .next method, always terminate the
      // yield* loop.
      context.delegate = null;

      // Note: ["return"] must be used for ES3 parsing compatibility.
      if (methodName === "throw" && delegate.iterator["return"]) {
        // If the delegate iterator has a return method, give it a
        // chance to clean up.
        context.method = "return";
        context.arg = undefined;
        maybeInvokeDelegate(delegate, context);

        if (context.method === "throw") {
          // If maybeInvokeDelegate(context) changed context.method from
          // "return" to "throw", let that override the TypeError below.
          return ContinueSentinel;
        }
      }
      if (methodName !== "return") {
        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a '" + methodName + "' method");
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

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

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
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(val) {
    var object = Object(val);
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable != null) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

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

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
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
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
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

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

  return regeneratorRuntime;
})();
function _regeneratorKeys(e) { var n = Object(e), r = []; for (var t in n) r.unshift(t); return function e() { for (; r.length;) if ((t = r.pop()) in n) return e.value = t, e.done = !1, e; return e.done = !0, e; }; }
function _regenerator() { var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
var __async = function __async(__this, __arguments, generator) {
  return new Promise(function (resolve, reject) {
    var fulfilled = function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = function rejected(value) {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = function step(x) {
      return x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    };
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var CONFIG = {
  SITES: [{
    name: "MyFarsi v2",
    url: "https://mobile.namakade.com:8443",
    search: "/search?page=search&searchField={q}"
  }, {
    name: "LiveFarsi",
    url: "https://www.diycraftsguide.com",
    search: "/search?q={q}"
  }],
  PROVIDER_NAME: "MyFarsi v2",
  TMDB_API_KEY: "570e659354bbb65a671cd0f627f65aab",
  TMDB_BASE: "https://api.themoviedb.org/3",
  SEARCH_PATTERNS: ["/search?q={q}", "/search?query={q}", "/search?keyword={q}", "/?s={q}", "/search/{q}", "/search/{q}.html", "/search.html?q={q}"],
  SITEMAP_PATHS: ["/sitemap.xml", "/sitemap_index.xml", "/sitemap-index.xml", "/wp-sitemap.xml"],
  MATCH_THRESHOLD: 0.62,
  MAX_FETCHES: 30,
  TIMEOUT_MS: 6500,
  PROBE_MS: 1400,
  EXTRA_BUDGET_MS: 7000,
  EXTRA_GRACE_MS: 2500,
  USER_AGENT: "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36"
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
var STOP_WORDS = {
  serial: 1,
  series: 1,
  serie: 1,
  film: 1,
  movie: 1,
  full: 1,
  hd: 1,
  fhd: 1,
  uhd: 1,
  "4k": 1,
  online: 1,
  watch: 1,
  free: 1,
  the: 1,
  new: 1,
  kamel: 1,
  complete: 1,
  play: 1,
  stream: 1,
  streaming: 1,
  download: 1,
  "\u0633\u0631\u06CC\u0627\u0644": 1,
  "\u0641\u06CC\u0644\u0645": 1,
  "\u06A9\u0627\u0645\u0644": 1,
  "\u062F\u0627\u0646\u0644\u0648\u062F": 1,
  "\u062A\u0645\u0627\u0634\u0627": 1,
  "\u0622\u0646\u0644\u0627\u06CC\u0646": 1,
  "\u0627\u0646\u0644\u0627\u06CC\u0646": 1,
  "\u067E\u062E\u0634": 1,
  "\u0631\u0627\u06CC\u06AF\u0627\u0646": 1
};
function normalize(s) {
  s = latinDigits(decodeEntities(s)).toLowerCase();
  s = s.replace(/ي/g, "\u06CC").replace(/ى/g, "\u06CC").replace(/ك/g, "\u06A9").replace(/ة/g, "\u0647").replace(/[أإ]/g, "\u0627").replace(/[\u064B-\u065F\u0670\u0640]/g, "").replace(/[\u200c\u200d]/g, " ");
  if (s.normalize) {
    try {
      s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    } catch (e) {}
  }
  s = s.replace(/[^a-z0-9\u0600-\u06ff]+/g, " ");
  return s.split(" ").filter(function (t) {
    return t && !STOP_WORDS[t];
  }).join(" ");
}
var FINGLISH = {
  "\u0627": "a",
  "\u0622": "a",
  "\u0628": "b",
  "\u067E": "p",
  "\u062A": "t",
  "\u062B": "s",
  "\u062C": "j",
  "\u0686": "ch",
  "\u062D": "h",
  "\u062E": "kh",
  "\u062F": "d",
  "\u0630": "z",
  "\u0631": "r",
  "\u0632": "z",
  "\u0698": "zh",
  "\u0633": "s",
  "\u0634": "sh",
  "\u0635": "s",
  "\u0636": "z",
  "\u0637": "t",
  "\u0638": "z",
  "\u0639": "",
  "\u063A": "gh",
  "\u0641": "f",
  "\u0642": "gh",
  "\u06A9": "k",
  "\u06AF": "g",
  "\u0644": "l",
  "\u0645": "m",
  "\u0646": "n",
  "\u0648": "v",
  "\u0647": "h",
  "\u06CC": "y",
  "\u0621": "",
  "\u0626": "y",
  "\u0624": "v"
};
function finglish(s) {
  var out = "";
  for (var i = 0; i < s.length; i++) out += FINGLISH[s[i]] !== void 0 ? FINGLISH[s[i]] : s[i];
  return out;
}
function skeleton(s) {
  return finglish(s).replace(/kh/g, "K").replace(/sh/g, "S").replace(/ch/g, "C").replace(/zh/g, "Z").replace(/gh|q/g, "G").replace(/w/g, "v").replace(/[aeiouyhv ]/g, "").replace(/(.)\1+/g, "$1");
}
function bigrams(s) {
  var out = {},
    n = 0;
  s = s.replace(/ /g, "");
  for (var i = 0; i < s.length - 1; i++) {
    var g = s.substr(i, 2);
    out[g] = (out[g] || 0) + 1;
    n++;
  }
  return {
    map: out,
    n: n
  };
}
function dice(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  var A = bigrams(a),
    B = bigrams(b);
  if (!A.n || !B.n) return 0;
  var inter = 0;
  for (var g in A.map) if (B.map[g]) inter += Math.min(A.map[g], B.map[g]);
  return 2 * inter / (A.n + B.n);
}
function similarity(title, text) {
  var a = normalize(title),
    b = normalize(text);
  if (!a || !b) return 0;
  if (a === b) return 1;
  var best = dice(a, b);
  var sa = skeleton(a),
    sb = skeleton(b);
  if (sa.length >= 3 && sb.length >= 3) best = Math.max(best, sa === sb ? 0.95 : dice(sa, sb) * 0.95);
  var ta = a.split(" "),
    tb = " " + b + " ";
  var allIn = ta.every(function (t) {
    return tb.indexOf(" " + t + " ") !== -1;
  });
  var viaSkeleton = false;
  if (!allIn) {
    var skB = " " + b.split(" ").map(skeleton).join(" ") + " ";
    allIn = ta.every(function (t) {
      var k = skeleton(t);
      return k.length >= 2 && skB.indexOf(" " + k + " ") !== -1;
    });
    viaSkeleton = allIn;
  }
  if (allIn) {
    var base = 0.8 + 0.15 * Math.min(1, ta.length / b.split(" ").length);
    if (viaSkeleton) {
      var minSk = 9;
      ta.forEach(function (t) {
        var k = skeleton(t);
        if (k.length < minSk) minSk = k.length;
      });
      best = Math.max(best, minSk >= 4 ? base : minSk === 3 ? base * 0.82 : base * 0.62);
    } else {
      best = Math.max(best, base);
    }
  }
  return best;
}
function originOf(u) {
  var m = String(u).match(/^(https?:\/\/[^\/?#]+)/i);
  return m ? m[1] : "";
}
function hostOf(u) {
  return originOf(u).replace(/^https?:\/\//i, "").replace(/:\d+$/, "").toLowerCase();
}
function normalizePath(p) {
  var parts = p.split("/"),
    out = [];
  for (var i = 0; i < parts.length; i++) {
    if (parts[i] === "..") {
      if (out.length > 1) out.pop();
    } else if (parts[i] !== ".") out.push(parts[i]);
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
  var origin = m[1],
    path = m[2] || "/";
  if (href[0] === "/") return origin + href;
  if (href[0] === "?") return origin + path + href;
  return origin + normalizePath(path.replace(/[^\/]*$/, "") + href);
}
function isOwnSite(u, ctx) {
  var h = hostOf(u),
    s = hostOf(ctx.site.url).replace(/^www\./, "");
  return h === s || h === "www." + s || h.slice(-(s.length + 1)) === "." + s;
}
function slugText(u) {
  var path = String(u).replace(/^https?:\/\/[^\/]+/i, "").split(/[?#]/)[0];
  var segs = path.split("/").filter(Boolean).map(function (x) {
    try {
      return decodeURIComponent(x);
    } catch (e) {
      return x;
    }
  });
  var generic = /^(watch|movie|movies|film|films|serial|series|tv|show|shows|video|videos|play|post|p|title|details|fa|en)$/i;
  var meaningful = segs.filter(function (x) {
    return !generic.test(x.replace(/\.\w+$/, ""));
  });
  return (meaningful.join(" ") || "").replace(/\.(html?|php|aspx?)$/i, "").replace(/[-_+.]+/g, " ");
}
var NAV_RE = /\/(login|signin|signup|register|account|user|category|categories|tag|tags|genre|genres|contact|contact-us|privacy|dmca|terms|about|language|faq|cart|feed)(\/|\.|$|\?)|\/page\/\d+|[?&](page|lang)=/i;
function xhrFetch(url, opts) {
  return new Promise(function (resolve, reject) {
    var XHR = typeof XMLHttpRequest !== "undefined" ? XMLHttpRequest : null;
    if (!XHR) {
      reject(new Error("no http bridge (no fetch, no XMLHttpRequest)"));
      return;
    }
    var o = opts || {};
    try {
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
                  if (c > 0 && lines[i].slice(0, c).trim().toLowerCase() === String(name).toLowerCase()) return lines[i].slice(c + 1).trim();
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
      try {
        xhr.responseType = "text";
      } catch (e0) {}
      var hs = o.headers || {};
      for (var hk in hs) {
        try {
          xhr.setRequestHeader(hk, hs[hk]);
        } catch (e1) {}
      }
      try {
        if (o.timeoutMs) xhr.timeout = o.timeoutMs;
      } catch (e2) {}
      try {
        if (o.signal) {
          if (o.signal.aborted) {
            try {
              xhr.abort();
            } catch (e5) {}
          } else if (typeof o.signal.addEventListener === "function") {
            o.signal.addEventListener("abort", function () {
              try {
                xhr.abort();
              } catch (e6) {}
            });
          }
        }
      } catch (e7) {}
      var done = false;
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
  if (typeof fetch === "function") return fetch(url, opts);
  return xhrFetch(url, opts);
}
// Android TV supplies fetch but may omit browser timer globals. In that case,
// use the host network timeout and plugin execution deadline. Never emulate
// timers with an immediate callback: that would cancel every request.
function scheduleTimeout(callback, ms) {
  return typeof setTimeout === "function" ? setTimeout(callback, ms) : null;
}
function cancelTimeout(timer) {
  if (timer !== null && typeof clearTimeout === "function") clearTimeout(timer);
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
    timer = scheduleTimeout(function () {
      if (controller) controller.abort();
      resolve(null);
    }, CONFIG.TIMEOUT_MS);
  });
  var req = httpFetch(url, {
    headers: headers,
    signal: controller ? controller.signal : void 0,
    timeoutMs: CONFIG.TIMEOUT_MS
  }).then(function (res) {
    if (!res.ok) return null;
    return res.text().then(function (t) {
      return {
        text: t,
        url: res.url || url
      };
    });
  }).catch(function () {
    return null;
  });
  return Promise.race([req, timeout]).then(function (r) {
    cancelTimeout(timer);
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
  var timer = scheduleTimeout(function () {
    if (!done && controller) {
      try {
        controller.abort();
      } catch (e) {}
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
    var ok = res.status >= 200 && res.status < 400;
    var ct = "";
    try {
      ct = (res.headers.get("content-type") || "").toLowerCase();
    } catch (e2) {}
    if (ok && /^text\/html/i.test(ct)) ok = false;
    if (controller) {
      try {
        controller.abort();
      } catch (e3) {}
    }
    return ok;
  }).catch(function () {
    return false;
  }).then(function (ok) {
    done = true;
    cancelTimeout(timer);
    return ok;
  });
}
function learnCdnHint(ctx, html) {
  if (!ctx.learned || !html) return;
  var m = String(html).match(/id="videoTagSrc"[^>]*?src\s*=\s*["']([^"']+)["']/i);
  if (!m) return;
  var file = m[1].split("?")[0].split("/").pop();
  var pm = file.match(/^(.+)_S(\d{1,2})_E(\d{1,4})\.(?:mp4|m3u8|mkv)$/i);
  if (!pm) return;
  var dir = m[1].split("?")[0].replace(/[^\/]*$/, "");
  var dirs = [dir];
  var nm = dir.match(/^(https?:\/\/[^\/]+)\/ipnx\/media\/(.+)$/i);
  if (nm) {
    dirs.push(nm[1] + "/vod/mp4:" + nm[2]);
    dirs.push(nm[1].replace(/media\.negahestan\.com/i, "media.iranproud2.net") + "/ipnx/media/" + nm[2]);
  }
  if (!ctx.learned.cdnHint) {
    ctx.learned.cdnHint = {
      prefix: pm[1],
      sLen: pm[2].length,
      eLen: pm[3].length,
      dirs: dirs
    };
    console.log("[cdn-hint] learned prefix '" + pm[1] + "' from " + file);
  }
}
function cdnConstructStreams(info, ctx) {
  var hint = ctx.learned && ctx.learned.cdnHint;
  if (!hint || info.type !== "tv") return [];
  function pad(n, len) {
    var str = "" + n;
    if (len > 1 && str.length < len) str = new Array(len - str.length + 1).join("0") + str;
    return str;
  }
  var s = +info.season || 1,
    e = +info.episode || 1;
  var sVs = [pad(s, hint.sLen || 1), "" + s],
    eVs = [pad(e, hint.eLen || 1), "" + e];
  var out = [],
    seen = {};
  (hint.dirs || []).forEach(function (dir) {
    sVs.forEach(function (sv) {
      eVs.forEach(function (ev) {
        var u = dir + hint.prefix + "_S" + sv + "_E" + ev + ".mp4";
        if (!seen[u]) {
          seen[u] = 1;
          out.push({
            url: u,
            quality: "Auto",
            referer: ctx.site.url + "/"
          });
        }
      });
    });
  });
  if (out.length > 4) out = out.slice(0, 4);
  return out;
}
function farsicdnVariants(u) {
  var m = String(u).match(/^(https?:\/\/)s(\d+)\.farsicdn\.site(\/.*)$/i);
  if (!m) return [u];
  var out = [u];
  ["1", "2", "3"].forEach(function (n) {
    if (n === m[2]) return;
    var v = m[1] + "s" + n + ".farsicdn.site" + m[3];
    if (out.indexOf(v) === -1) out.push(v);
  });
  return out;
}
function diagStream(reason, title) {
  return {
    name: "DIAG - provider running (" + reason + ")",
    title: title || "Test clip: the MyFarsi provider is running on this device",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    quality: "TEST",
    headers: {
      "User-Agent": CONFIG.USER_AGENT
    },
    provider: "myfarsi"
  };
}
function delayFallback(ms) {
  // A host without timers cannot provide an additional grace period.
  if (typeof setTimeout !== "function") return Promise.resolve([[], []]);
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve([[], []]);
    }, ms);
  });
}
function verifyStreams(media) {
  if (!media || !media.length) return Promise.resolve([]);
  var total = media.length;
  return Promise.all(media.map(function (x) {
    return __async(this, null, _regenerator().m(function _callee2() {
      var softOk, variants, results, i;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            if (!x.skipProbe) {
              _context2.n = 2;
              break;
            }
            _context2.n = 1;
            return probeStream(x.url, x.referer, true);
          case 1:
            softOk = _context2.v;
            if (softOk) x.softVerified = true;else console.log("[probe] soft-fail (kept, demoted): " + x.url);
            return _context2.a(2, x);
          case 2:
            variants = farsicdnVariants(x.url);
            _context2.n = 3;
            return Promise.all(variants.map(function (v, vi) {
              return __async(this, null, _regenerator().m(function _callee() {
                var ok, noRef;
                return _regenerator().w(function (_context) {
                  while (1) switch (_context.n) {
                    case 0:
                      _context.n = 1;
                      return probeStream(v, x.referer, true);
                    case 1:
                      ok = _context.v;
                      noRef = false;
                      if (!(!ok && x.referer)) {
                        _context.n = 3;
                        break;
                      }
                      _context.n = 2;
                      return probeStream(v, null, false);
                    case 2:
                      ok = _context.v;
                      noRef = ok;
                    case 3:
                      return _context.a(2, {
                        vi: vi,
                        ok: ok,
                        noRef: noRef
                      });
                  }
                }, _callee);
              }));
            }));
          case 3:
            results = _context2.v;
            i = 0;
          case 4:
            if (!(i < results.length)) {
              _context2.n = 6;
              break;
            }
            if (!(results[i] && results[i].ok)) {
              _context2.n = 5;
              break;
            }
            if (i) console.log("[probe] dead source replaced: " + x.url + " -> " + variants[i]);
            x.url = variants[i];
            x.probeVerified = true;
            if (results[i].noRef) x.noReferer = true;
            return _context2.a(2, x);
          case 5:
            i++;
            _context2.n = 4;
            break;
          case 6:
            console.log("[probe] unreachable, dropped: " + x.url);
            return _context2.a(2, null);
        }
      }, _callee2);
    }));
  })).then(function (list) {
    var kept = list.filter(Boolean);
    if (!kept.length && total) {
      console.log("[probe] all " + total + " probe(s) failed — returning candidates unverified");
      return media;
    }
    return kept;
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
          return fetchText(url, {
            fetches: 0
          });
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
          alts.sort(function (a, b) {
            var pa = /^(IR|US|GB|AF)$/.test(a.iso_3166_1) ? 0 : 1,
              pb = /^(IR|US|GB|AF)$/.test(b.iso_3166_1) ? 0 : 1;
            return pa - pb;
          }).forEach(function (a) {
            add(a.title || a.name);
          });
          date = d.release_date || d.first_air_date || "";
          seasons = ((type === "tv" ? d.seasons : null) || []).map(function (s2) {
            return {
              n: s2.season_number | 0,
              count: s2.episode_count | 0
            };
          }).filter(function (s2) {
            return s2.n >= 1 && s2.count > 0;
          });
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
  var links = [],
    seen = {};
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
    links.push({
      url: key,
      text: text
    });
  }
  function attr(attrs, name) {
    var m2 = attrs.match(new RegExp("\\b" + name + "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))", "i"));
    return m2 ? m2[1] !== void 0 ? m2[1] : m2[2] !== void 0 ? m2[2] : m2[3] : "";
  }
  var m,
    re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  while (m = re.exec(html)) {
    var inner = m[2];
    var alt = (inner.match(/\balt\s*=\s*["']([^"']+)["']/i) || [])[1] || "";
    var txt = [stripTags(inner), attr(m[1], "title"), alt].filter(Boolean).join(" ");
    if (!txt) {
      var im2 = inner.match(/<img[^>]*\bsrc\s*=\s*["']([^"']+)["']/i);
      if (im2) txt = im2[1].split("?")[0].split("/").pop().replace(/\.(jpg|jpeg|png|webp|gif)$/i, "").replace(/_(small|smallthumb|thumb|med|medium|large)$/i, "").replace(/[-_+.]+/g, " ");
    }
    push(attr(m[1], "href") || attr(m[1], "data-href") || attr(m[1], "data-url"), txt);
  }
  re = /<option\b([^>]*)>([\s\S]*?)<\/option>/gi;
  while (m = re.exec(html)) {
    var v = attr(m[1], "value") || attr(m[1], "data-url") || attr(m[1], "data-href");
    if (v && /[\/.]/.test(v)) push(v, stripTags(m[2]));
  }
  re = /<(\w+)\b([^>]*\b(?:data-(?:href|url|link|episode-url)|onclick)\s*=[^>]*)>([\s\S]{0,300}?)<\/\1>/gi;
  while (m = re.exec(html)) {
    var t = m[1].toLowerCase();
    if (t === "a" || t === "option" || t === "script") continue;
    var h = attr(m[2], "data-href") || attr(m[2], "data-url") || attr(m[2], "data-link") || attr(m[2], "data-episode-url");
    if (!h) {
      var oc = attr(m[2], "onclick").match(/['"]([^'"]+\/[^'"]*)['"]/);
      h = oc ? oc[1] : "";
    }
    if (h) push(h, stripTags(m[3]) + " " + attr(m[2], "title"));
  }
  return links;
}
function titleScore(link, info) {
  var slug = slugText(link.url);
  var best = 0;
  for (var i = 0; i < info.names.length; i++) {
    var n = info.names[i];
    best = Math.max(best, similarity(n, link.text), similarity(n, slug));
    if (best === 1) break;
  }
  var hay = link.text + " " + link.url;
  if (info.year) {
    if (hay.indexOf(info.year) !== -1) best += 0.05;else {
      var ys = hay.match(/\b(19[5-9]\d|20[0-4]\d)\b/g);
      if (ys && ys.length) best -= 0.08;
    }
  }
  if (NAV_RE.test(link.url)) best -= 1;
  return best;
}
function pickBest(links, info, ctx, opts) {
  var best = null;
  for (var i = 0; i < links.length; i++) {
    var l = links[i];
    if (!isOwnSite(l.url, ctx) || opts && opts.exclude && opts.exclude[l.url]) continue;
    var s = titleScore(l, info);
    if (info.type === "tv" && info.season) s += 0.15 * episodeScore(l.text + " " + slugText(l.url), info.season, info.episode);
    if (!best || s > best.score) best = {
      url: l.url,
      text: l.text,
      score: s
    };
  }
  return best;
}
function episodeScore(text, s, e) {
  var t = " " + latinDigits(decodeEntities(text)).toLowerCase().replace(/[_\-.\/|]+/g, " ") + " ";
  var m = t.match(/[^a-z]s\s?0*(\d{1,2})\s?e\s?0*(\d{1,4})(?!\d)/);
  if (m) return +m[1] === +s && +m[2] === +e ? 1 : 0;
  var epRe = /(?:^|[^a-z\u0600-\u06ff])(?:episode|epsiode|episod|epi|ep|e|qesmat|ghesmat|qesmate|ghesmate|part|قسمت|بخش)\s*0*(\d{1,4})(?!\d)/g;
  var eps = [],
    mm;
  while (mm = epRe.exec(t)) eps.push(+mm[1]);
  var seasonRe = /(?:^|[^a-z\u0600-\u06ff])(?:season|fasl|fasle|faslu|s|فصل)\s*0*(\d{1,2})(?!\d)/g;
  var seasons = [];
  while (mm = seasonRe.exec(t)) seasons.push(+mm[1]);
  if (!eps.length) {
    var bare = t.trim();
    if (/^\d{1,4}$/.test(bare)) return +bare === +e ? 0.7 : 0;
    return 0;
  }
  if (eps.indexOf(+e) === -1) return 0;
  if (seasons.length) return seasons.indexOf(+s) !== -1 ? 1 : 0;
  return +s === 1 ? 0.9 : 0.6;
}
var FA_ORDINALS = {
  "\u0627\u0648\u0644": 1,
  "\u062F\u0648\u0645": 2,
  "\u0633\u0648\u0645": 3,
  "\u0686\u0647\u0627\u0631\u0645": 4,
  "\u067E\u0646\u062C\u0645": 5,
  "\u0634\u0634\u0645": 6,
  "\u0647\u0641\u062A\u0645": 7,
  "\u0647\u0634\u062A\u0645": 8,
  "\u0646\u0647\u0645": 9,
  "\u062F\u0647\u0645": 10,
  "\u06CC\u0627\u0632\u062F\u0647\u0645": 11,
  "\u062F\u0648\u0627\u0632\u062F\u0647\u0645": 12,
  "\u0633\u06CC\u0632\u062F\u0647\u0645": 13,
  "\u0686\u0647\u0627\u0631\u062F\u0647\u0645": 14,
  "\u067E\u0627\u0646\u0632\u062F\u0647\u0645": 15,
  "\u0634\u0627\u0646\u0632\u062F\u0647\u0645": 16,
  "\u0647\u0641\u062F\u0647\u0645": 17,
  "\u0647\u062C\u062F\u0647\u0645": 18,
  "\u0646\u0648\u0632\u062F\u0647\u0645": 19,
  "\u0628\u06CC\u0633\u062A\u0645": 20
};
var FA_ORD_RE = "\u0627\u0648\u0644|\u062F\u0648\u0645|\u0633\u0648\u0645|\u0686\u0647\u0627\u0631\u0645|\u067E\u0646\u062C\u0645|\u0634\u0634\u0645|\u0647\u0641\u062A\u0645|\u0647\u0634\u062A\u0645|\u0646\u0647\u0645|\u062F\u0647\u0645|\u06CC\u0627\u0632\u062F\u0647\u0645|\u062F\u0648\u0627\u0632\u062F\u0647\u0645|\u0633\u06CC\u0632\u062F\u0647\u0645|\u0686\u0647\u0627\u0631\u062F\u0647\u0645|\u067E\u0627\u0646\u0632\u062F\u0647\u0645|\u0634\u0627\u0646\u0632\u062F\u0647\u0645|\u0647\u0641\u062F\u0647\u0645|\u0647\u062C\u062F\u0647\u0645|\u0646\u0648\u0632\u062F\u0647\u0645|\u0628\u06CC\u0633\u062A\u0645";
function ordinalsEpisodeScore(text, s, e) {
  var t = " " + latinDigits(decodeEntities(text)).toLowerCase().replace(/[_\-.\/|,]+/g, " ") + " ";
  var seasons = [];
  var mm;
  var seasonRe = /(?:^|[^a-z\u0600-\u06ff])(?:season|fasl|fasle|s|\u0641\u0635\u0644)\s*0*(\d{1,2})(?!\d)/g;
  while (mm = seasonRe.exec(t)) seasons.push(+mm[1]);
  var wsm = t.match(new RegExp("\u0641\u0635\u0644\\s*(" + FA_ORD_RE + ")"));
  if (wsm) seasons.push(FA_ORDINALS[wsm[1]]);
  var eps = [];
  var epRe = /(?:^|[^a-z\u0600-\u06ff])(?:episode|epsiode|episod|epi|ep|e|qesmat|ghesmat|part|\u0642\u0633\u0645\u062A|\u0628\u062E\u0634)\s*0*(\d{1,4})(?!\d)/g;
  while (mm = epRe.exec(t)) eps.push(+mm[1]);
  var wom = t.match(new RegExp("(?:\u0642\u0633\u0645\u062A|\u0628\u062E\u0634)\\s*(" + FA_ORD_RE + ")"));
  if (wom) eps.push(FA_ORDINALS[wom[1]]);
  if (!eps.length) return episodeScore(text, s, e);
  if (eps.indexOf(+e) === -1) return 0;
  if (seasons.length) return seasons.indexOf(+s) !== -1 ? 1 : 0;
  return +s === 1 ? 0.9 : 0.4;
}
var NON_EPISODE_RE = /\u0631\u0645\u0627\u0646|\u0635\u0648\u062A\u06CC|\u0622\u0647\u0646\u06AF|\u0645\u0648\u0633\u06CC\u0642\u06CC|\u062A\u06CC\u0632\u0631|\u062A\u0631\u06CC\u0644\u0631|\u0646\u0642\u062F|\u0628\u0631\u0631\u0633\u06CC|\u0645\u0639\u0631\u0641\u06CC|\u067E\u0634\u062A\s*\u0635\u062D\u0646\u0647|\u0645\u0635\u0627\u062D\u0628\u0647/;
function isNonEpisodeTitle(t) {
  return NON_EPISODE_RE.test(String(t || ""));
}
function episodeScoreAny(text, s, e) {
  return ordinalsEpisodeScore(text, s, e);
}
function faNameOf(info) {
  for (var i = 0; i < info.names.length; i++) if (/[\u0600-\u06FF]/.test(info.names[i])) return info.names[i];
  return info.names[0] || "";
}
function fetchJson(url, ctx) {
  return fetchTextOnce(url, ctx).then(function (res) {
    if (!res || !res.text) return null;
    try {
      return JSON.parse(res.text);
    } catch (e) {
      return null;
    }
  });
}
var DAILYMOTION = {
  SEARCH: "https://api.dailymotion.com/videos?search={q}&fields=id,title,duration&limit=50&page=1",
  META: "https://www.dailymotion.com/player/metadata/video/{id}?app=com.dailymotion.neon",
  MIN_TV_SECS: 1200,
  MIN_MOVIE_SECS: 2400
};
function dailymotionSource(info) {
  return __async(this, null, _regenerator().m(function _callee4() {
    var fa, ctx, minSecs, queries, candidates, order, qi, data, list, i, v, score, out, k, meta, q, m3u8, key, qLabel, sf, maxH, h, n, _t2, _t3;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          fa = faNameOf(info);
          if (fa) {
            _context4.n = 1;
            break;
          }
          return _context4.a(2, []);
        case 1:
          ctx = {
            fetches: 0
          };
          minSecs = info.type === "tv" ? DAILYMOTION.MIN_TV_SECS : DAILYMOTION.MIN_MOVIE_SECS;
          queries = [];
          if (info.type === "tv") {
            queries.push(fa + " \u0642\u0633\u0645\u062A " + info.episode);
            if (info.season > 1) queries.push(fa + " \u0641\u0635\u0644 " + info.season);
          }
          queries.push(fa);
          candidates = {}, order = [];
          qi = 0;
        case 2:
          if (!(qi < queries.length)) {
            _context4.n = 12;
            break;
          }
          _context4.n = 3;
          return fetchJson(DAILYMOTION.SEARCH.replace("{q}", encodeURIComponent(queries[qi])), ctx);
        case 3:
          data = _context4.v;
          list = data && data.list || [];
          i = 0;
        case 4:
          if (!(i < list.length)) {
            _context4.n = 10;
            break;
          }
          v = list[i];
          if (!(!v || !v.id || candidates[v.id])) {
            _context4.n = 5;
            break;
          }
          return _context4.a(3, 9);
        case 5:
          if (!((v.duration | 0) < minSecs)) {
            _context4.n = 6;
            break;
          }
          return _context4.a(3, 9);
        case 6:
          if (!isNonEpisodeTitle(v.title)) {
            _context4.n = 7;
            break;
          }
          return _context4.a(3, 9);
        case 7:
          score = episodeScoreAny(v.title + " " + v.id, info.season, info.episode);
          if (!(info.type === "tv" && score < 0.6)) {
            _context4.n = 8;
            break;
          }
          return _context4.a(3, 9);
        case 8:
          candidates[v.id] = {
            id: v.id,
            title: v.title || "",
            score: score
          };
          order.push(v.id);
        case 9:
          i++;
          _context4.n = 4;
          break;
        case 10:
          if (!(order.length >= 3)) {
            _context4.n = 11;
            break;
          }
          return _context4.a(3, 12);
        case 11:
          qi++;
          _context4.n = 2;
          break;
        case 12:
          if (order.length) {
            _context4.n = 13;
            break;
          }
          console.log("[Dailymotion] no full episode found for " + fa);
          return _context4.a(2, []);
        case 13:
          order.sort(function (a, b) {
            return candidates[b].score - candidates[a].score;
          });
          out = [];
          k = 0;
        case 14:
          if (!(k < Math.min(2, order.length))) {
            _context4.n = 23;
            break;
          }
          _context4.n = 15;
          return fetchJson(DAILYMOTION.META.replace("{id}", encodeURIComponent(candidates[order[k]].id)), ctx);
        case 15:
          meta = _context4.v;
          if (!(!meta || meta.error)) {
            _context4.n = 16;
            break;
          }
          return _context4.a(3, 22);
        case 16:
          q = meta.qualities || {};
          m3u8 = "";
          if (!(q.auto && q.auto[0] && q.auto[0].url)) {
            _context4.n = 17;
            break;
          }
          m3u8 = q.auto[0].url;
          _context4.n = 20;
          break;
        case 17:
          _t2 = _regeneratorKeys(q);
        case 18:
          if ((_t3 = _t2()).done) {
            _context4.n = 20;
            break;
          }
          key = _t3.value;
          if (!(q[key] && q[key][0] && q[key][0].url)) {
            _context4.n = 19;
            break;
          }
          m3u8 = q[key][0].url;
          return _context4.a(3, 20);
        case 19:
          _context4.n = 18;
          break;
        case 20:
          if (m3u8) {
            _context4.n = 21;
            break;
          }
          return _context4.a(3, 22);
        case 21:
          qLabel = "Auto";
          sf = meta.stream_formats || {};
          maxH = 0;
          for (h in sf) {
            n = parseInt(h, 10);
            if (n > maxH) maxH = n;
          }
          if (maxH) qLabel = maxH >= 2160 ? "4K" : maxH + "p";
          out.push({
            url: m3u8,
            quality: qLabel,
            site: "Dailymotion",
            referer: "https://www.dailymotion.com/",
            skipProbe: true
          });
        case 22:
          k++;
          _context4.n = 14;
          break;
        case 23:
          console.log("[Dailymotion] " + out.length + " stream(s) for " + info.names[0] + (info.type === "tv" ? " S" + info.season + "E" + info.episode : ""));
          return _context4.a(2, out);
      }
    }, _callee4);
  }));
}
var APARAT = {
  SEARCH: "https://www.aparat.com/etc/api/videoBySearch/text/{q}/perpage/30",
  SHOW: "https://www.aparat.com/api/fa/v1/video/video/show/videohash/{uid}",
  MIN_TV_SECS: 1200,
  MIN_MOVIE_SECS: 2400
};
function aparatSource(info) {
  return __async(this, null, _regenerator().m(function _callee5() {
    var fa, ctx, minSecs, queries, candidates, order, qi, data, list, i, v, score, out, k, show, attrs, best, bestN, fla, fi, u, n;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          fa = faNameOf(info);
          if (fa) {
            _context5.n = 1;
            break;
          }
          return _context5.a(2, []);
        case 1:
          ctx = {
            fetches: 0
          };
          minSecs = info.type === "tv" ? APARAT.MIN_TV_SECS : APARAT.MIN_MOVIE_SECS;
          queries = [];
          if (info.type === "tv") queries.push(fa + " \u0642\u0633\u0645\u062A " + info.episode);
          queries.push(fa);
          candidates = {}, order = [];
          qi = 0;
        case 2:
          if (!(qi < queries.length)) {
            _context5.n = 12;
            break;
          }
          _context5.n = 3;
          return fetchJson(APARAT.SEARCH.replace("{q}", encodeURIComponent(queries[qi])), ctx);
        case 3:
          data = _context5.v;
          list = data && data.videobysearch || [];
          i = 0;
        case 4:
          if (!(i < list.length)) {
            _context5.n = 10;
            break;
          }
          v = list[i];
          if (!(!v || !v.uid || candidates[v.uid])) {
            _context5.n = 5;
            break;
          }
          return _context5.a(3, 9);
        case 5:
          if (!((v.duration | 0) < minSecs)) {
            _context5.n = 6;
            break;
          }
          return _context5.a(3, 9);
        case 6:
          if (!isNonEpisodeTitle(v.title)) {
            _context5.n = 7;
            break;
          }
          return _context5.a(3, 9);
        case 7:
          score = episodeScoreAny(v.title + " " + (v.uid || ""), info.season, info.episode);
          if (!(info.type === "tv" && score < 0.6)) {
            _context5.n = 8;
            break;
          }
          return _context5.a(3, 9);
        case 8:
          candidates[v.uid] = {
            uid: v.uid,
            title: v.title || "",
            score: score
          };
          order.push(v.uid);
        case 9:
          i++;
          _context5.n = 4;
          break;
        case 10:
          if (!(order.length >= 3)) {
            _context5.n = 11;
            break;
          }
          return _context5.a(3, 12);
        case 11:
          qi++;
          _context5.n = 2;
          break;
        case 12:
          if (order.length) {
            _context5.n = 13;
            break;
          }
          console.log("[Aparat] no full episode found for " + fa);
          return _context5.a(2, []);
        case 13:
          order.sort(function (a, b) {
            return candidates[b].score - candidates[a].score;
          });
          out = [];
          k = 0;
        case 14:
          if (!(k < Math.min(2, order.length))) {
            _context5.n = 19;
            break;
          }
          _context5.n = 15;
          return fetchJson(APARAT.SHOW.replace("{uid}", encodeURIComponent(candidates[order[k]].uid)), ctx);
        case 15:
          show = _context5.v;
          attrs = show && show.data && show.data.attributes || null;
          if (attrs) {
            _context5.n = 16;
            break;
          }
          return _context5.a(3, 18);
        case 16:
          best = null, bestN = -1;
          fla = attrs.file_link_all || [];
          for (fi = 0; fi < fla.length; fi++) {
            u = fla[fi] && fla[fi].urls && fla[fi].urls[0];
            n = parseInt(fla[fi] && fla[fi].profile || "0", 10) || 0;
            if (u && n > bestN) {
              bestN = n;
              best = {
                url: u,
                quality: n >= 2160 ? "4K" : n + "p"
              };
            }
          }
          if (!best && attrs.hls_link) best = {
            url: attrs.hls_link,
            quality: "Auto"
          };
          if (!best && attrs.file_link) best = {
            url: attrs.file_link,
            quality: "Auto"
          };
          if (best) {
            _context5.n = 17;
            break;
          }
          return _context5.a(3, 18);
        case 17:
          out.push({
            url: best.url,
            quality: best.quality,
            site: "Aparat",
            referer: "https://www.aparat.com/"
          });
        case 18:
          k++;
          _context5.n = 14;
          break;
        case 19:
          console.log("[Aparat] " + out.length + " stream(s) for " + info.names[0] + (info.type === "tv" ? " S" + info.season + "E" + info.episode : ""));
          return _context5.a(2, out);
      }
    }, _callee5);
  }));
}
function seasonOnlyScore(text, s) {
  var t = " " + latinDigits(decodeEntities(text)).toLowerCase().replace(/[_\-.\/|]+/g, " ") + " ";
  var re = /(?:^|[^a-z\u0600-\u06ff])(?:season|fasl|fasle|s|فصل)\s*0*(\d{1,2})(?!\d)/g,
    mm;
  while (mm = re.exec(t)) if (+mm[1] === +s) return 1;
  return 0;
}
function viaSearch(info, ctx) {
  return __async(this, null, _regenerator().m(function _callee6() {
    var patterns, queries, insertedOriginal, ni, on, best, p, patternWorked, q, url, res, exclude, cand;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          patterns = ctx.site.search ? [ctx.site.search] : CONFIG.SEARCH_PATTERNS.slice();
          if (ctx.learned.searchPattern) {
            patterns = [ctx.learned.searchPattern].concat(patterns.filter(function (p2) {
              return p2 !== ctx.learned.searchPattern;
            }));
          }
          queries = [];
          if (info.type === "tv" && info.season > 1) {
            info.names.forEach(function (n) {
              if (!/[a-z]/i.test(n) || queries.length >= 2) return;
              var sq = n + " " + info.season;
              if (queries.indexOf(sq) === -1) queries.push(sq);
            });
          }
          info.names.forEach(function (n) {
            if (!/[a-z]/i.test(n) || queries.length >= 5) return;
            if (queries.indexOf(n) === -1) queries.push(n);
            var alt = n.replace(/^(?:al|el|ar)\s+/i, "");
            if (alt !== n && queries.length < 5 && queries.indexOf(alt) === -1) queries.push(alt);
            var noThe = n.replace(/^the\s+/i, "");
            if (noThe !== n && queries.length < 5 && queries.indexOf(noThe) === -1) queries.push(noThe);
          });
          insertedOriginal = false;
          ni = 0;
        case 1:
          if (!(ni < info.names.length && queries.length < 6)) {
            _context6.n = 4;
            break;
          }
          on = info.names[ni];
          if (!(/[a-z]/i.test(on) || queries.indexOf(on) !== -1)) {
            _context6.n = 2;
            break;
          }
          return _context6.a(3, 3);
        case 2:
          if (!insertedOriginal) {
            queries.splice(queries.length >= 2 ? 2 : queries.length, 0, on);
            insertedOriginal = true;
          } else if (queries.indexOf(on) === -1) {
            queries.push(on);
          }
        case 3:
          ni++;
          _context6.n = 1;
          break;
        case 4:
          info.names.forEach(function (n) {
            if (queries.length < 3 && queries.indexOf(n) === -1) queries.push(n);
          });
          best = null;
          p = 0;
        case 5:
          if (!(p < patterns.length)) {
            _context6.n = 12;
            break;
          }
          patternWorked = false;
          q = 0;
        case 6:
          if (!(q < queries.length)) {
            _context6.n = 10;
            break;
          }
          url = ctx.site.url + patterns[p].replace("{q}", encodeURIComponent(queries[q]));
          _context6.n = 7;
          return fetchText(url, ctx, ctx.site.url + "/");
        case 7:
          res = _context6.v;
          if (res) {
            _context6.n = 8;
            break;
          }
          return _context6.a(3, 10);
        case 8:
          patternWorked = true;
          exclude = {};
          exclude[url] = 1;
          exclude[res.url] = 1;
          cand = pickBest(extractLinks(res.text, res.url), info, ctx, {
            exclude: exclude
          });
          if (cand && (!best || cand.score > best.score)) best = cand;
          if (!(best && best.score >= CONFIG.MATCH_THRESHOLD)) {
            _context6.n = 9;
            break;
          }
          ctx.learned.searchPattern = patterns[p];
          return _context6.a(2, best);
        case 9:
          q++;
          _context6.n = 6;
          break;
        case 10:
          if (patternWorked && ctx.learned.searchPattern === patterns[p]) ctx.learned.searchPattern = null;
          if (!(ctx.fetches >= CONFIG.MAX_FETCHES)) {
            _context6.n = 11;
            break;
          }
          return _context6.a(3, 12);
        case 11:
          p++;
          _context6.n = 5;
          break;
        case 12:
          return _context6.a(2, best);
      }
    }, _callee6);
  }));
}
function loadSitemapUrls(ctx) {
  return __async(this, null, _regenerator().m(function _callee7() {
    var roots, robots, re, m, urls, visited, queue, fetched, sm, res, locs, lm, lre;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          if (!(ctx.learned.sitemapUrls && Date.now() - ctx.learned.sitemapAt < CACHE_TTL)) {
            _context7.n = 1;
            break;
          }
          return _context7.a(2, ctx.learned.sitemapUrls);
        case 1:
          roots = CONFIG.SITEMAP_PATHS.map(function (p) {
            return ctx.site.url + p;
          });
          _context7.n = 2;
          return fetchText(ctx.site.url + "/robots.txt", ctx);
        case 2:
          robots = _context7.v;
          if (robots) {
            re = /^\s*sitemap:\s*(\S+)/gim;
            while (m = re.exec(robots.text)) if (roots.indexOf(m[1]) === -1) roots.unshift(m[1]);
          }
          urls = [], visited = {}, queue = roots.slice(), fetched = 0;
        case 3:
          if (!(queue.length && fetched < 8 && ctx.fetches < CONFIG.MAX_FETCHES)) {
            _context7.n = 7;
            break;
          }
          sm = queue.shift();
          if (!visited[sm]) {
            _context7.n = 4;
            break;
          }
          return _context7.a(3, 3);
        case 4:
          visited[sm] = 1;
          _context7.n = 5;
          return fetchText(sm, ctx);
        case 5:
          res = _context7.v;
          if (!(!res || !/<(urlset|sitemapindex)/i.test(res.text))) {
            _context7.n = 6;
            break;
          }
          return _context7.a(3, 3);
        case 6:
          fetched++;
          locs = [], lre = /<loc>\s*(?:<!\[CDATA\[)?\s*([^<\]\s]+)/gi;
          while (lm = lre.exec(res.text)) locs.push(decodeEntities(lm[1]));
          if (/<sitemapindex/i.test(res.text)) {
            locs.sort(function (a, b) {
              var pa = /movie|film|serial|series|video|post|title|watch/i.test(a) ? 0 : 1;
              var pb = /movie|film|serial|series|video|post|title|watch/i.test(b) ? 0 : 1;
              return pa - pb;
            });
            queue = queue.concat(locs);
          } else {
            urls = urls.concat(locs);
          }
          if (urls.length && roots.indexOf(sm) !== -1) queue = queue.filter(function (u) {
            return roots.indexOf(u) === -1;
          });
          _context7.n = 3;
          break;
        case 7:
          if (urls.length) {
            ctx.learned.sitemapUrls = urls;
            ctx.learned.sitemapAt = Date.now();
          }
          return _context7.a(2, urls);
      }
    }, _callee7);
  }));
}
function viaSitemap(info, ctx) {
  return __async(this, null, _regenerator().m(function _callee8() {
    var urls;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.n) {
        case 0:
          _context8.n = 1;
          return loadSitemapUrls(ctx);
        case 1:
          urls = _context8.v;
          if (urls.length) {
            _context8.n = 2;
            break;
          }
          return _context8.a(2, null);
        case 2:
          return _context8.a(2, pickBest(urls.map(function (u) {
            return {
              url: u,
              text: ""
            };
          }), info, ctx));
      }
    }, _callee8);
  }));
}
var LISTING_RE = /movie|film|serial|series|show|az|a-z|list|archive|catalog|browse|latest|new|فیلم|سریال|آرشیو/i;
function viaCrawl(info, ctx) {
  return __async(this, null, _regenerator().m(function _callee9() {
    var home, links, best, listings, i, res, c;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.n) {
        case 0:
          _context9.n = 1;
          return fetchText(ctx.site.url + "/", ctx);
        case 1:
          home = _context9.v;
          if (home) {
            _context9.n = 2;
            break;
          }
          return _context9.a(2, null);
        case 2:
          links = extractLinks(home.text, home.url);
          best = pickBest(links, info, ctx);
          if (!(best && best.score >= CONFIG.MATCH_THRESHOLD)) {
            _context9.n = 3;
            break;
          }
          return _context9.a(2, best);
        case 3:
          listings = links.filter(function (l) {
            return isOwnSite(l.url, ctx) && !NAV_RE.test(l.url) && LISTING_RE.test(l.url + " " + l.text) && titleScore(l, info) < 0.5;
          }).slice(0, 6);
          i = 0;
        case 4:
          if (!(i < listings.length && ctx.fetches < CONFIG.MAX_FETCHES)) {
            _context9.n = 8;
            break;
          }
          _context9.n = 5;
          return fetchText(listings[i].url, ctx, home.url);
        case 5:
          res = _context9.v;
          if (res) {
            _context9.n = 6;
            break;
          }
          return _context9.a(3, 7);
        case 6:
          c = pickBest(extractLinks(res.text, res.url), info, ctx);
          if (c && (!best || c.score > best.score)) best = c;
          if (!(best && best.score >= CONFIG.MATCH_THRESHOLD)) {
            _context9.n = 7;
            break;
          }
          return _context9.a(2, best);
        case 7:
          i++;
          _context9.n = 4;
          break;
        case 8:
          return _context9.a(2, best);
      }
    }, _callee9);
  }));
}
function viaAutocomplete(info, ctx) {
  return __async(this, null, _regenerator().m(function _callee0() {
    var best, i, url, res, arr, _t4;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.p = _context0.n) {
        case 0:
          if (ctx.site.autocomplete) {
            _context0.n = 1;
            break;
          }
          return _context0.a(2, null);
        case 1:
          best = null;
          i = 0;
        case 2:
          if (!(i < info.names.length && i < 3)) {
            _context0.n = 9;
            break;
          }
          url = ctx.site.url + ctx.site.autocomplete.replace("{q}", encodeURIComponent(info.names[i]));
          _context0.n = 3;
          return fetchText(url, ctx);
        case 3:
          res = _context0.v;
          if (res) {
            _context0.n = 4;
            break;
          }
          return _context0.a(3, 8);
        case 4:
          _context0.p = 4;
          arr = JSON.parse(res.text);
          _context0.n = 6;
          break;
        case 5:
          _context0.p = 5;
          _t4 = _context0.v;
          return _context0.a(3, 8);
        case 6:
          if (!(!arr || !arr.length)) {
            _context0.n = 7;
            break;
          }
          return _context0.a(3, 8);
        case 7:
          arr.forEach(function (it) {
            if (!it || !it.url) return;
            var u = resolveUrl(it.url, ctx.site.url + "/");
            if (!u || !/^https?:/i.test(u) || !isOwnSite(u, ctx)) return;
            var l = {
              url: u.split("#")[0],
              text: (it.title || "") + " " + (it.type || "")
            };
            var s2 = titleScore(l, info);
            var t = String(it.type || "").toLowerCase();
            if (info.type === "tv" && /tv[-_ ]?series|series|serial/.test(t)) s2 += 0.3;
            if (info.type !== "tv" && /movie|film/.test(t)) s2 += 0.3;
            if (!best || s2 > best.score) best = {
              url: l.url,
              text: l.text,
              score: s2
            };
          });
          if (!(best && best.score >= CONFIG.MATCH_THRESHOLD)) {
            _context0.n = 8;
            break;
          }
          return _context0.a(3, 9);
        case 8:
          i++;
          _context0.n = 2;
          break;
        case 9:
          return _context0.a(2, best);
      }
    }, _callee0, null, [[4, 5]]);
  }));
}
function findTitlePage(info, ctx) {
  return __async(this, null, _regenerator().m(function _callee1() {
    var key, cached, strategies, best, i, c;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.n) {
        case 0:
          key = info.type + ":" + info.tmdbId;
          cached = ctx.learned.pages[key];
          if (!(cached && Date.now() - cached.at < CACHE_TTL)) {
            _context1.n = 1;
            break;
          }
          return _context1.a(2, cached.page);
        case 1:
          strategies = [viaAutocomplete, viaSearch, viaSitemap, viaCrawl];
          best = null;
          i = 0;
        case 2:
          if (!(i < strategies.length)) {
            _context1.n = 5;
            break;
          }
          _context1.n = 3;
          return strategies[i](info, ctx);
        case 3:
          c = _context1.v;
          if (c && (!best || c.score > best.score)) best = c;
          if (!(best && best.score >= CONFIG.MATCH_THRESHOLD)) {
            _context1.n = 4;
            break;
          }
          return _context1.a(3, 5);
        case 4:
          i++;
          _context1.n = 2;
          break;
        case 5:
          if (!(!best || best.score < CONFIG.MATCH_THRESHOLD)) {
            _context1.n = 6;
            break;
          }
          return _context1.a(2, null);
        case 6:
          ctx.learned.pages[key] = {
            page: best,
            at: Date.now()
          };
          return _context1.a(2, best);
      }
    }, _callee1);
  }));
}
function lfSeasonSections(html, baseUrl) {
  var entries = [];
  var seenU = {};
  var secRe = /<span>\s*(?:Season|\u0641\u0635\u0644)\s*0*(\d{1,2})\s*<\/span>/gi;
  var carRe = /<div[^>]*class\s*=\s*["'][^"']*owl-carousel\s+season_\d+["'][^>]*>/gi;
  var heads = [],
    sm;
  while (sm = secRe.exec(html)) heads.push({
    season: +sm[1],
    start: sm.index
  });
  function scanChunk(chunk, season) {
    var itRe = /<a\b([^>]*)>([\s\S]{0,800}?)<\/a>/gi,
      im;
    while (im = itRe.exec(chunk)) {
      var hm = im[1].match(/href\s*=\s*["']([^"']+)["']/i);
      if (!hm || !/[?&]key=/.test(hm[1])) continue;
      var em = im[2].match(/\bE\s*0*(\d{1,4})\b/i);
      if (!em) continue;
      var u = resolveUrl(hm[1], baseUrl);
      if (!u || !/^https?:/i.test(u)) continue;
      var k = u.split("#")[0];
      if (seenU[k]) continue;
      seenU[k] = 1;
      entries.push({
        season: season | 0,
        ep: +em[1],
        url: k
      });
    }
  }
  if (heads.length) {
    for (var i = 0; i < heads.length; i++) {
      var end = i + 1 < heads.length ? heads[i + 1].start : Math.min(html.length, heads[i].start + 9e4);
      scanChunk(html.slice(heads[i].start, end), heads[i].season);
    }
  } else {
    var cars = [],
      cm;
    while (cm = carRe.exec(html)) cars.push(cm.index);
    if (cars.length > 1) {
      for (var c2 = 0; c2 < cars.length; c2++) {
        var cend = c2 + 1 < cars.length ? cars[c2 + 1] : Math.min(html.length, cars[c2] + 15e4);
        scanChunk(html.slice(cars[c2], cend), 0);
      }
    } else {
      scanChunk(html, 0);
    }
  }
  return entries;
}
function findEpisodePage(page, info, ctx) {
  return __async(this, null, _regenerator().m(function _callee10() {
    var s, e, visited, toVisit, round, url, res, entries, pick, wild, gCands, gi, links, best, pairRe, pm, pseen, pairs, pu, pi, pres, pv, cands, ci, tryUrl, proto, eres, vsrc, clean;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.n) {
        case 0:
          s = info.season || 1, e = info.episode || 1;
          if (!(episodeScore(page.text + " " + slugText(page.url), s, e) >= 0.9)) {
            _context10.n = 1;
            break;
          }
          return _context10.a(2, {
            url: page.url
          });
        case 1:
          visited = {}, toVisit = [page.url];
          round = 0;
        case 2:
          if (!(round < 3 && toVisit.length)) {
            _context10.n = 31;
            break;
          }
          url = toVisit.shift();
          if (!visited[url]) {
            _context10.n = 3;
            break;
          }
          return _context10.a(3, 30);
        case 3:
          visited[url] = 1;
          _context10.n = 4;
          return fetchText(url, ctx, ctx.site.url + "/");
        case 4:
          res = _context10.v;
          if (res) {
            _context10.n = 5;
            break;
          }
          return _context10.a(3, 30);
        case 5:
          if (!(round === 0)) {
            _context10.n = 10;
            break;
          }
          page.html = res.text;
          if (!/owl-carousel\s+season_/i.test(res.text)) {
            _context10.n = 10;
            break;
          }
          entries = lfSeasonSections(latinDigits(res.text), res.url || page.url);
          pick = null, wild = null;
          entries.forEach(function (en) {
            if (en.ep !== +e) return;
            if (en.season === +s) pick = pick || en;else if (!en.season) wild = wild || en;
          });
          if (!pick) pick = wild;
          if (!(!pick && info.globalEp)) {
            _context10.n = 9;
            break;
          }
          gCands = [+info.globalEp, +info.globalEp - 1, +info.globalEp - 2];
          gi = 0;
        case 6:
          if (!(gi < gCands.length && !pick)) {
            _context10.n = 9;
            break;
          }
          if (!(gCands[gi] <= 0)) {
            _context10.n = 7;
            break;
          }
          return _context10.a(3, 8);
        case 7:
          entries.forEach(function (en) {
            if (!pick && en.ep === gCands[gi] && en.season === +s) pick = en;
          });
          if (!pick) entries.forEach(function (en) {
            if (!pick && en.ep === gCands[gi]) pick = en;
          });
        case 8:
          gi++;
          _context10.n = 6;
          break;
        case 9:
          return _context10.a(2, pick ? {
            url: pick.url
          } : null);
        case 10:
          links = extractLinks(res.text, res.url).filter(function (l) {
            return isOwnSite(l.url, ctx);
          });
          best = null;
          links.forEach(function (l) {
            var sc = episodeScore(l.text + " " + slugText(l.url), s, e);
            if (sc > 0 && (!best || sc > best.score)) best = {
              url: l.url,
              score: sc
            };
          });
          if (!(best && best.score >= 0.6)) {
            _context10.n = 11;
            break;
          }
          return _context10.a(2, {
            url: best.url,
            html: best.html || null
          });
        case 11:
          if (best) {
            _context10.n = 21;
            break;
          }
          pairRe = /href="([^"]*\/episodes\/([^"]*))"[\s\S]{0,800}?id="divEpiNo\d*"[^>]*>\s*(\d{1,4})\s*</gi, pseen = {}, pairs = [];
        case 12:
          if (!((pm = pairRe.exec(res.text)) && pairs.length < 6)) {
            _context10.n = 14;
            break;
          }
          pu = resolveUrl(pm[1], res.url);
          if (!(!pu || !isOwnSite(pu, ctx) || pseen[pu] || +pm[3] !== +e)) {
            _context10.n = 13;
            break;
          }
          return _context10.a(3, 12);
        case 13:
          pseen[pu] = 1;
          pairs.push(pu);
          _context10.n = 12;
          break;
        case 14:
          pi = 0;
        case 15:
          if (!(pi < pairs.length && pi < 3 && !best)) {
            _context10.n = 21;
            break;
          }
          if (!visited[pairs[pi]]) {
            _context10.n = 16;
            break;
          }
          return _context10.a(3, 20);
        case 16:
          visited[pairs[pi]] = 1;
          _context10.n = 17;
          return fetchText(pairs[pi], ctx, ctx.site.url + "/");
        case 17:
          pres = _context10.v;
          if (pres) {
            _context10.n = 18;
            break;
          }
          return _context10.a(3, 20);
        case 18:
          learnCdnHint(ctx, pres.text);
          pv = (pres.text.match(/id="videoTagSrc"[^>]*?src\s*=\s*["']([^"]+)["']/i) || [0, ""])[1];
          if (pv) {
            _context10.n = 19;
            break;
          }
          return _context10.a(3, 20);
        case 19:
          if (!new RegExp("0*" + s + "e0*" + e + "([^0-9]|$)", "i").test(pv.replace(/[_\-\s]/g, "").toLowerCase())) {
            _context10.n = 20;
            break;
          }
          return _context10.a(2, {
            url: pairs[pi],
            html: pres.text
          });
        case 20:
          pi++;
          _context10.n = 15;
          break;
        case 21:
          if (!(!best && info.globalEp)) {
            _context10.n = 29;
            break;
          }
          cands = [+info.globalEp, +info.globalEp - 1, +info.globalEp - 2];
          ci = 0;
        case 22:
          if (!(ci < cands.length && cands[ci] >= 0 && !best)) {
            _context10.n = 29;
            break;
          }
          tryUrl = null;
          links.forEach(function (l) {
            var m3 = String(l.url).match(/\/episodes\/([^\/?#]*?)(\d+)\/?$/i);
            if (!tryUrl && m3 && +m3[2] === cands[ci]) tryUrl = l.url;
          });
          if (!tryUrl) {
            proto = null;
            links.forEach(function (l) {
              if (!proto && /\/episodes\//i.test(l.url)) proto = String(l.url);
            });
            if (proto) tryUrl = proto.replace(/(\d+)(\/?)$/i, cands[ci] + "$2");
          }
          if (!(!tryUrl || visited[tryUrl])) {
            _context10.n = 23;
            break;
          }
          return _context10.a(3, 28);
        case 23:
          visited[tryUrl] = 1;
          _context10.n = 24;
          return fetchText(tryUrl, ctx, ctx.site.url + "/");
        case 24:
          eres = _context10.v;
          if (eres) {
            _context10.n = 25;
            break;
          }
          return _context10.a(3, 28);
        case 25:
          learnCdnHint(ctx, eres.text);
          vsrc = (eres.text.match(/id="videoTagSrc"[^>]*?src\s*=\s*["']([^"']+)["']/i) || [0, ""])[1];
          if (vsrc) {
            _context10.n = 26;
            break;
          }
          return _context10.a(3, 28);
        case 26:
          clean = vsrc.replace(/[_\-\s]/g, "").toLowerCase();
          if (!new RegExp("0*" + s + "e0*" + e + "([^0-9]|$)", "i").test(clean)) {
            _context10.n = 27;
            break;
          }
          return _context10.a(2, {
            url: tryUrl,
            html: eres.text
          });
        case 27:
          if (new RegExp("0*\\d{1,2}e0*\\d{1,4}([^0-9]|$)", "i").test(clean)) {
            _context10.n = 28;
            break;
          }
          return _context10.a(2, {
            url: tryUrl,
            html: eres.text
          });
        case 28:
          ci++;
          _context10.n = 22;
          break;
        case 29:
          links.forEach(function (l) {
            if (!visited[l.url] && seasonOnlyScore(l.text + " " + slugText(l.url), s) && episodeScore(l.text, s, e) === 0) {
              toVisit.push(l.url);
            }
          });
          if (round === 0) page.html = res.text;
        case 30:
          round++;
          _context10.n = 2;
          break;
        case 31:
          return _context10.a(2, null);
      }
    }, _callee10);
  }));
}
var MEDIA_EXT = "(?:m3u8|mp4|mkv|webm|mpd|m4v)";
var ABS_MEDIA_RE = new RegExp("(?:https?:)?//[^\\s\"'<>()\\\\]+?\\." + MEDIA_EXT + "(?:\\?[^\\s\"'<>()\\\\]*)?", "gi");
var ATTR_MEDIA_RE = new RegExp("(?:src|file|source|url|href|data-src|data-file|data-video|contentUrl|hls|video)[\"']?\\s*[=:]\\s*[\"']([^\"']+?\\." + MEDIA_EXT + "(?:\\?[^\"']*)?)[\"']", "gi");
var B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64decode(s) {
  s = s.replace(/[^A-Za-z0-9+\/]/g, "");
  var out = "",
    buf = 0,
    bits = 0;
  for (var i = 0; i < s.length; i++) {
    buf = buf << 6 | B64.indexOf(s[i]);
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out += String.fromCharCode(buf >> bits & 255);
    }
  }
  return out;
}
function qualityFrom(url, context) {
  var t = (url + " ").toLowerCase();
  var m = t.match(/(?:^|[^0-9])(2160|1440|1080|720|576|480|360|240)p?(?:[^0-9]|$)/) || (/\b4k\b|uhd/.test(t) ? ["", "2160"] : null);
  if (!m && context) m = context.toLowerCase().match(/\b(2160|1440|1080|720|576|480|360)p\b/);
  if (!m) return "Auto";
  return m[1] === "2160" ? "4K" : m[1] + "p";
}
function extractMedia(html, pageUrl) {
  var found = [],
    seen = {};
  var text = html.replace(/\\\//g, "/").replace(/\\u0026/gi, "&").replace(/\\u002F/gi, "/").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
  function add(raw, ctxText, qOverride) {
    var rawStr = String(raw).replace(/&(?:quot|lt|gt|#39|apos);/gi, "");
    if (rawStr.indexOf(",") !== -1 && /,(?:[a-z0-9]+:)?(?:https?:)?\/\//i.test(rawStr)) {
      rawStr.split(/,(?=(?:[a-z0-9]+:)?(?:https?:)?\/\/)/i).forEach(function (part) {
        if (/\.(?:m3u8|mp4|mkv|webm|mpd|m4v)(?:\?|$)/i.test(part)) add(part, ctxText, qOverride);
      });
      return;
    }
    var u = resolveUrl(rawStr, pageUrl);
    if (!u || seen[u]) return;
    if (/\/(ads?|vast|preroll|trailer|teaser)\//i.test(u)) return;
    seen[u] = 1;
    found.push({
      url: u,
      quality: qOverride || qualityFrom(u, ctxText)
    });
  }
  function around(idx) {
    return stripTags(text.slice(Math.max(0, idx - 200), idx + 80));
  }
  var m;
  ABS_MEDIA_RE.lastIndex = 0;
  while (m = ABS_MEDIA_RE.exec(text)) add(m[0], around(m.index));
  ATTR_MEDIA_RE.lastIndex = 0;
  while (m = ATTR_MEDIA_RE.exec(text)) add(m[1], around(m.index));
  var vre = /<(?:video|source)\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi;
  while (m = vre.exec(text)) {
    var label = (m[0].match(/\b(?:label|res|size|title)\s*=\s*["']([^"']+)["']/i) || [])[1] || "";
    add(m[1], label);
  }
  var jre = /"contentUrl"\s*:\s*"([^"]+)"/gi;
  while (m = jre.exec(text)) add(m[1], "");
  var ogre = /<meta[^>]+property=["']og:video(?::url|:secure_url)?["'][^>]+content=["']([^"']+)["']/gi;
  while (m = ogre.exec(text)) if (new RegExp("\\." + MEDIA_EXT, "i").test(m[1])) add(m[1], "");
  var bre = /["']([A-Za-z0-9+\/]{24,}={0,2})["']/g;
  while (m = bre.exec(text)) {
    var dec = b64decode(m[1]);
    if (/^(https?:)?\/\//.test(dec) || /\.(m3u8|mp4|mpd)/i.test(dec)) {
      var inner = dec.match(ABS_MEDIA_RE);
      if (inner) inner.forEach(function (u) {
        add(u, around(m.index));
      });else if (/^https?:\/\//.test(dec)) add(dec, around(m.index));
    }
  }
  var dom = html.match(/data-options="([\s\S]+?)"/);
  if (dom) {
    try {
      var okj = JSON.parse(dom[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
      var okmd = okj.flashvars && okj.flashvars.metadata || okj.metadata;
      if (okmd) {
        if (okmd.hlsManifestUrl) add(okmd.hlsManifestUrl, "hls");
        var OKQ = {
          lowest: "240p",
          low: "360p",
          mobile: "360p",
          sd: "480p",
          hd: "720p",
          full: "1080p"
        };
        (okmd.videos || []).forEach(function (v) {
          if (!v || !v.url) return;
          add(v.url, "", OKQ[String(v.name || "").toLowerCase()] || "Auto");
        });
      }
    } catch (e) {}
  }
  return found;
}
function extractFrames(html, pageUrl) {
  var out = [],
    m;
  var re = /<iframe\b[^>]*?\b(?:data-src|src)\s*=\s*["']([^"']+)["']/gi;
  while (m = re.exec(html)) out.push(m[1]);
  re = /"embedUrl"\s*:\s*"([^"]+)"/gi;
  while (m = re.exec(html)) out.push(m[1]);
  re = /<meta[^>]+property=["']og:video(?::url)?["'][^>]+content=["']([^"']+)["']/gi;
  while (m = re.exec(html)) out.push(m[1]);
  var seen = {};
  return out.map(function (u) {
    return resolveUrl(u, pageUrl);
  }).filter(function (u) {
    if (!u || seen[u] || /youtube\.com|youtu\.be|facebook|twitter|instagram|disqus|google/i.test(u)) return false;
    seen[u] = 1;
    return true;
  });
}
var PLAY_RE = /(^|[^a-z])(play|watch|player|stream|server|پخش|تماشا|مشاهده|سرور)([^a-z]|$)/i;
function streamsFromPage(url, ctx, depth, referer, html) {
  return __async(this, null, _regenerator().m(function _callee11() {
    var res, media, frames, i, plays, j, _t5, _t6;
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
          if (res) {
            _context11.n = 2;
            break;
          }
          return _context11.a(2, []);
        case 2:
          html = res.text;
        case 3:
          media = extractMedia(html, url).map(function (x) {
            x.referer = url;
            return x;
          });
          if (!(media.length || depth >= 2)) {
            _context11.n = 4;
            break;
          }
          return _context11.a(2, media);
        case 4:
          frames = extractFrames(html, url).slice(0, 3);
          i = 0;
        case 5:
          if (!(i < frames.length)) {
            _context11.n = 8;
            break;
          }
          _t5 = media;
          _context11.n = 6;
          return streamsFromPage(frames[i], ctx, depth + 1, url);
        case 6:
          media = _t5.concat.call(_t5, _context11.v);
        case 7:
          i++;
          _context11.n = 5;
          break;
        case 8:
          if (!(media.length || depth > 0)) {
            _context11.n = 9;
            break;
          }
          return _context11.a(2, media);
        case 9:
          plays = extractLinks(html, url).filter(function (l) {
            return isOwnSite(l.url, ctx) && l.url !== url && !NAV_RE.test(l.url) && PLAY_RE.test(l.text + " " + l.url);
          }).slice(0, 2);
          j = 0;
        case 10:
          if (!(j < plays.length)) {
            _context11.n = 13;
            break;
          }
          _t6 = media;
          _context11.n = 11;
          return streamsFromPage(plays[j].url, ctx, depth + 1, url);
        case 11:
          media = _t6.concat.call(_t6, _context11.v);
        case 12:
          j++;
          _context11.n = 10;
          break;
        case 13:
          return _context11.a(2, media);
      }
    }, _callee11);
  }));
}
var Q_ORDER = {
  "4K": 0,
  "1440p": 1,
  "1080p": 2,
  "720p": 3,
  "576p": 4,
  "480p": 5,
  "360p": 6,
  "240p": 7,
  "Auto": 8
};
function qRank(q) {
  return Q_ORDER[q] !== void 0 ? Q_ORDER[q] : 9;
}
function streamsFromSite(site, info) {
  return __async(this, null, _regenerator().m(function _callee12() {
    var ctx, page, media, ep, cdn;
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.n) {
        case 0:
          ctx = {
            fetches: 0,
            site: site,
            learned: learnedFor(site)
          };
          _context12.n = 1;
          return findTitlePage(info, ctx);
        case 1:
          page = _context12.v;
          if (page) {
            _context12.n = 2;
            break;
          }
          console.log("[" + site.name + "] no page found for " + info.names[0]);
          return _context12.a(2, []);
        case 2:
          if (!(info.type === "tv")) {
            _context12.n = 9;
            break;
          }
          _context12.n = 3;
          return findEpisodePage(page, info, ctx);
        case 3:
          ep = _context12.v;
          if (!ep) {
            _context12.n = 5;
            break;
          }
          _context12.n = 4;
          return streamsFromPage(ep.url, ctx, 0, null, ep.html || null);
        case 4:
          media = _context12.v;
          _context12.n = 8;
          break;
        case 5:
          if (!page.html) {
            _context12.n = 7;
            break;
          }
          _context12.n = 6;
          return streamsFromPage(page.url, ctx, 0, null, page.html);
        case 6:
          media = _context12.v.filter(function (x) {
            return episodeScore(slugText(x.url), info.season, info.episode) >= 0.6;
          });
          _context12.n = 8;
          break;
        case 7:
          media = [];
        case 8:
          _context12.n = 11;
          break;
        case 9:
          _context12.n = 10;
          return streamsFromPage(page.url, ctx, 0);
        case 10:
          media = _context12.v;
        case 11:
          if (info.type === "tv" && (!media || !media.length)) {
            cdn = cdnConstructStreams(info, ctx);
            if (cdn.length) console.log("[" + site.name + "] cdn-fallback: trying " + cdn.length + " constructed episode url(s)");
            media = media.concat(cdn);
          }
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
    var t0, type, meta, info, sFound, si, gEp, sj, sites, extrasP, results, extras, media, unique, label, out;
    return _regenerator().w(function (_context13) {
      while (1) switch (_context13.n) {
        case 0:
          t0 = Date.now();
          type = mediaType === "tv" || mediaType === "series" || mediaType === "show" ? "tv" : "movie";
          _context13.n = 1;
          return getTitleInfo(tmdbId, type);
        case 1:
          meta = _context13.v;
          if (!(!meta || !meta.names.length)) {
            _context13.n = 2;
            break;
          }
          return _context13.a(2, [diagStream("no TMDB metadata", "Title lookup failed (TMDB unreachable or unknown id) — test clip confirms the provider itself works")]);
        case 2:
          info = {
            tmdbId: tmdbId,
            type: type,
            names: meta.names,
            year: meta.year,
            season: type === "tv" ? +season || 1 : 0,
            episode: type === "tv" ? +episode || 1 : 0
          };
          if (!(type === "tv" && meta.seasons && meta.seasons.length)) {
            _context13.n = 6;
            break;
          }
          sFound = false;
          si = 0;
        case 3:
          if (!(si < meta.seasons.length)) {
            _context13.n = 5;
            break;
          }
          if (!(meta.seasons[si].n === info.season)) {
            _context13.n = 4;
            break;
          }
          sFound = true;
          return _context13.a(3, 5);
        case 4:
          si++;
          _context13.n = 3;
          break;
        case 5:
          if (sFound) {
            gEp = 0;
            for (sj = 0; sj < meta.seasons.length; sj++) {
              if (meta.seasons[sj].n >= 1 && meta.seasons[sj].n < info.season) gEp += meta.seasons[sj].count;
            }
            info.globalEp = gEp + info.episode;
          }
        case 6:
          sites = (CONFIG.SITES || []).filter(function (x) {
            return x && /^https?:\/\//i.test(x.url || "");
          }).map(function (x) {
            return {
              name: x.name || CONFIG.PROVIDER_NAME,
              url: x.url.replace(/\/+$/, ""),
              search: x.search,
              autocomplete: x.autocomplete
            };
          });
          extrasP = Promise.all([dailymotionSource(info), aparatSource(info)].map(function (p) {
            return p.catch(function (err) {
              console.log("[extra source] error: " + (err && err.message ? err.message : err));
              return [];
            });
          }));
          _context13.n = 7;
          return Promise.all(sites.map(function (site) {
            return streamsFromSite(site, info).catch(function (err) {
              console.log("[" + site.name + "] error: " + (err && err.message ? err.message : err));
              return [];
            });
          }));
        case 7:
          results = _context13.v;
          extras = [[], []];
          if (!(Date.now() - t0 < CONFIG.EXTRA_BUDGET_MS)) {
            _context13.n = 9;
            break;
          }
          _context13.n = 8;
          return extrasP;
        case 8:
          extras = _context13.v;
          _context13.n = 11;
          break;
        case 9:
          console.log("[deadline] site lookups slow — capping Dailymotion/Aparat wait at " + CONFIG.EXTRA_GRACE_MS + "ms");
          _context13.n = 10;
          return Promise.race([extrasP, delayFallback(CONFIG.EXTRA_GRACE_MS)]);
        case 10:
          extras = _context13.v;
        case 11:
          media = [], unique = {};
          extras.forEach(function (list) {
            list.forEach(function (x) {
              if (!unique[x.url]) {
                unique[x.url] = 1;
                media.push(x);
              }
            });
          });
          results.forEach(function (list) {
            list.forEach(function (x) {
              if (!unique[x.url]) {
                unique[x.url] = 1;
                media.push(x);
              }
            });
          });
          _context13.n = 12;
          return verifyStreams(media);
        case 12:
          media = _context13.v;
          label = meta.names[0] + (type === "tv" ? " S" + info.season + "E" + info.episode : meta.year ? " (" + meta.year + ")" : "");
          out = media.sort(function (a, b) {
            function tier(x) {
              if (x.probeVerified) return 0;
              if (x.skipProbe && x.softVerified) return 1;
              return 2;
            }
            var ta = tier(a),
              tb = tier(b);
            if (ta !== tb) return ta - tb;
            return qRank(a.quality) - qRank(b.quality);
          }).map(function (x) {
            var fmt = (x.url.match(/\.(m3u8|mp4|mkv|webm|mpd)/i) || [0, ""])[1].toUpperCase();
            return {
              name: x.site + " - " + x.quality,
              title: label + (fmt ? " \u2022 " + fmt : ""),
              url: x.url,
              quality: x.quality,
              headers: x.noReferer ? {
                "User-Agent": CONFIG.USER_AGENT
              } : {
                Referer: x.referer,
                Origin: originOf(x.referer),
                "User-Agent": CONFIG.USER_AGENT
              },
              provider: "myfarsi"
            };
          });
          if (!out.length) {
            out.push(diagStream("no sources found", label + " — no sources found; test clip confirms the provider itself works"));
          }
          return _context13.a(2, out);
      }
    }, _callee13);
  }));
}
function diagStream(reason, title) {
  return {
    name: "DIAG - provider running (" + reason + ")",
    title: title || "Test clip: the MyFarsi provider is running on this device",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    quality: "TEST",
    headers: {
      "User-Agent": CONFIG.USER_AGENT
    },
    provider: "myfarsi"
  };
}
function getStreams(tmdbId, mediaType, season, episode) {
  return getStreamsAsync(tmdbId, mediaType, season, episode).catch(function (err) {
    var msg = err && err.message ? err.message : "" + err;
    console.log("[" + CONFIG.PROVIDER_NAME + "] error: " + msg);
    return [diagStream("error: " + msg)];
  });
}
module.exports = {
  getStreams: getStreams,
  _config: CONFIG,
  _learned: LEARNED
};
