// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, cache, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function() {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"2oUc0":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = 55071;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "9758d83ce3fa3ed7c2b1a5f0bfbe287a";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH */

var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept, acceptedAssets;

function getHostname() {
  return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}

function getPort() {
  return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare


var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = getHostname();
  var port = getPort();
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    acceptedAssets = {};
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      // Remove error overlay if there is one
      removeErrorOverlay();
      let assets = data.assets.filter(asset => asset.envHash === HMR_ENV_HASH); // Handle HMR Update

      var handled = false;
      assets.forEach(asset => {
        var didAccept = asset.type === 'css' || hmrAcceptCheck(module.bundle.root, asset.id);

        if (didAccept) {
          handled = true;
        }
      });

      if (handled) {
        console.clear();
        assets.forEach(function (asset) {
          hmrApply(module.bundle.root, asset);
        });

        for (var i = 0; i < assetsToAccept.length; i++) {
          var id = assetsToAccept[i][1];

          if (!acceptedAssets[id]) {
            hmrAcceptRun(assetsToAccept[i][0], id);
          }
        }
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'error') {
      // Log parcel errors to console
      for (let ansiDiagnostic of data.diagnostics.ansi) {
        let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
        console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
      } // Render the fancy html overlay


      removeErrorOverlay();
      var overlay = createErrorOverlay(data.diagnostics.html);
      document.body.appendChild(overlay);
    }
  };

  ws.onerror = function (e) {
    console.error(e.message);
  };

  ws.onclose = function (e) {
    console.warn('[parcel] 🚨 Connection to the HMR server was lost');
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
    console.log('[parcel] ✨ Error resolved');
  }
}

function createErrorOverlay(diagnostics) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';

  for (let diagnostic of diagnostics) {
    let stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
    errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>
          ${stack}
        </pre>
        <div>
          ${diagnostic.hints.map(hint => '<div>' + hint + '</div>').join('')}
        </div>
      </div>
    `;
  }

  errorHTML += '</div>';
  overlay.innerHTML = errorHTML;
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push([bundle, k]);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    if (link.parentNode !== null) {
      link.parentNode.removeChild(link);
    }
  };

  newLink.setAttribute('href', link.getAttribute('href').split('?')[0] + '?' + Date.now());
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      var hostname = getHostname();
      var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
      var absolute = /^https?:\/\//i.test(href) && href.indexOf(window.location.origin) !== 0 && !servedFromHMRServer;

      if (!absolute) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    if (asset.type === 'css') {
      reloadCSS();
    } else {
      var fn = new Function('require', 'module', 'exports', asset.output);
      modules[asset.id] = [fn, asset.depsByBundle[bundle.HMR_BUNDLE_ID]];
    }
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(module.bundle.root, id).some(function (v) {
    return hmrAcceptCheck(v[0], v[1]);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached && cached.hot) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      var assetsToAlsoAccept = cb(function () {
        return getParents(module.bundle.root, id);
      });

      if (assetsToAlsoAccept && assetsToAccept.length) {
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
      }
    });
  }

  acceptedAssets[id] = true;
}
},{}],"7KW17":[function(require,module,exports) {
var define;
!function (t, e) {
  "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.fp = e() : t.fp = e();
}("undefined" != typeof self ? self : this, function () {
  return function (t) {
    var e = {};

    function n(r) {
      if (e[r]) return e[r].exports;
      var i = e[r] = {
        i: r,
        l: !1,
        exports: {}
      };
      return t[r].call(i.exports, i, i.exports, n), i.l = !0, i.exports;
    }

    return n.m = t, n.c = e, n.d = function (t, e, r) {
      n.o(t, e) || Object.defineProperty(t, e, {
        enumerable: !0,
        get: r
      });
    }, n.r = function (t) {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
        value: "Module"
      }), Object.defineProperty(t, "__esModule", {
        value: !0
      });
    }, n.t = function (t, e) {
      if (1 & e && (t = n(t)), 8 & e) return t;
      if (4 & e && "object" == typeof t && t && t.__esModule) return t;
      var r = Object.create(null);
      if (n.r(r), Object.defineProperty(r, "default", {
        enumerable: !0,
        value: t
      }), 2 & e && "string" != typeof t) for (var i in t) n.d(r, i, function (e) {
        return t[e];
      }.bind(null, i));
      return r;
    }, n.n = function (t) {
      var e = t && t.__esModule ? function () {
        return t.default;
      } : function () {
        return t;
      };
      return n.d(e, "a", e), e;
    }, n.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }, n.p = "", n(n.s = 0);
  }([function (t, e, n) {
    "use strict";

    n.r(e);
    var r = {};

    function i(t) {
      return (i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
        return typeof t;
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
      })(t);
    }

    n.r(r), n.d(r, "VictoryGesture", function () {
      return C;
    }), n.d(r, "ThumbsUpGesture", function () {
      return j;
    });
    var o = {
      Thumb: 0,
      Index: 1,
      Middle: 2,
      Ring: 3,
      Pinky: 4,
      all: [0, 1, 2, 3, 4],
      nameMapping: {
        0: "Thumb",
        1: "Index",
        2: "Middle",
        3: "Ring",
        4: "Pinky"
      },
      pointsMapping: {
        0: [[0, 1], [1, 2], [2, 3], [3, 4]],
        1: [[0, 5], [5, 6], [6, 7], [7, 8]],
        2: [[0, 9], [9, 10], [10, 11], [11, 12]],
        3: [[0, 13], [13, 14], [14, 15], [15, 16]],
        4: [[0, 17], [17, 18], [18, 19], [19, 20]]
      },
      getName: function (t) {
        return void 0 !== i(this.nameMapping[t]) && this.nameMapping[t];
      },
      getPoints: function (t) {
        return void 0 !== i(this.pointsMapping[t]) && this.pointsMapping[t];
      }
    },
        a = {
      NoCurl: 0,
      HalfCurl: 1,
      FullCurl: 2,
      nameMapping: {
        0: "No Curl",
        1: "Half Curl",
        2: "Full Curl"
      },
      getName: function (t) {
        return void 0 !== i(this.nameMapping[t]) && this.nameMapping[t];
      }
    },
        l = {
      VerticalUp: 0,
      VerticalDown: 1,
      HorizontalLeft: 2,
      HorizontalRight: 3,
      DiagonalUpRight: 4,
      DiagonalUpLeft: 5,
      DiagonalDownRight: 6,
      DiagonalDownLeft: 7,
      nameMapping: {
        0: "Vertical Up",
        1: "Vertical Down",
        2: "Horizontal Left",
        3: "Horizontal Right",
        4: "Diagonal Up Right",
        5: "Diagonal Up Left",
        6: "Diagonal Down Right",
        7: "Diagonal Down Left"
      },
      getName: function (t) {
        return void 0 !== i(this.nameMapping[t]) && this.nameMapping[t];
      }
    };

    function u(t) {
      if ("undefined" == typeof Symbol || null == t[Symbol.iterator]) {
        if (Array.isArray(t) || (t = function (t, e) {
          if (!t) return;
          if ("string" == typeof t) return c(t, e);
          var n = Object.prototype.toString.call(t).slice(8, -1);
          "Object" === n && t.constructor && (n = t.constructor.name);
          if ("Map" === n || "Set" === n) return Array.from(n);
          if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return c(t, e);
        }(t))) {
          var e = 0,
              n = function () {};

          return {
            s: n,
            n: function () {
              return e >= t.length ? {
                done: !0
              } : {
                done: !1,
                value: t[e++]
              };
            },
            e: function (t) {
              throw t;
            },
            f: n
          };
        }

        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }

      var r,
          i,
          o = !0,
          a = !1;
      return {
        s: function () {
          r = t[Symbol.iterator]();
        },
        n: function () {
          var t = r.next();
          return o = t.done, t;
        },
        e: function (t) {
          a = !0, i = t;
        },
        f: function () {
          try {
            o || null == r.return || r.return();
          } finally {
            if (a) throw i;
          }
        }
      };
    }

    function c(t, e) {
      (null == e || e > t.length) && (e = t.length);

      for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];

      return r;
    }

    function f(t, e) {
      var n = Object.keys(t);

      if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(t);
        e && (r = r.filter(function (e) {
          return Object.getOwnPropertyDescriptor(t, e).enumerable;
        })), n.push.apply(n, r);
      }

      return n;
    }

    function s(t, e, n) {
      return e in t ? Object.defineProperty(t, e, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }) : t[e] = n, t;
    }

    function h(t, e) {
      for (var n = 0; n < e.length; n++) {
        var r = e[n];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
      }
    }

    var d = function () {
      function t(e) {
        !function (t, e) {
          if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
        }(this, t), this.options = function (t) {
          for (var e = 1; e < arguments.length; e++) {
            var n = null != arguments[e] ? arguments[e] : {};
            e % 2 ? f(Object(n), !0).forEach(function (e) {
              s(t, e, n[e]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : f(Object(n)).forEach(function (e) {
              Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e));
            });
          }

          return t;
        }({}, {
          HALF_CURL_START_LIMIT: 60,
          NO_CURL_START_LIMIT: 130,
          DISTANCE_VOTE_POWER: 1.1,
          SINGLE_ANGLE_VOTE_POWER: .9,
          TOTAL_ANGLE_VOTE_POWER: 1.6
        }, {}, e);
      }

      var e, n, r;
      return e = t, (n = [{
        key: "estimate",
        value: function (t) {
          var e,
              n = [],
              r = [],
              i = u(o.all);

          try {
            for (i.s(); !(e = i.n()).done;) {
              var a,
                  l = e.value,
                  c = o.getPoints(l),
                  f = [],
                  s = [],
                  h = u(c);

              try {
                for (h.s(); !(a = h.n()).done;) {
                  var d = a.value,
                      p = t[d[0]],
                      y = t[d[1]],
                      g = this.getSlopes(p, y),
                      v = g[0],
                      m = g[1];
                  f.push(v), s.push(m);
                }
              } catch (t) {
                h.e(t);
              } finally {
                h.f();
              }

              n.push(f), r.push(s);
            }
          } catch (t) {
            i.e(t);
          } finally {
            i.f();
          }

          var b,
              D = [],
              w = [],
              O = u(o.all);

          try {
            for (O.s(); !(b = O.n()).done;) {
              var M = b.value,
                  S = M == o.Thumb ? 1 : 0,
                  T = o.getPoints(M),
                  C = t[T[S][0]],
                  R = t[T[S + 1][1]],
                  A = t[T[3][1]],
                  L = this.estimateFingerCurl(C, R, A),
                  _ = this.calculateFingerDirection(C, R, A, n[M].slice(S));

              D[M] = L, w[M] = _;
            }
          } catch (t) {
            O.e(t);
          } finally {
            O.f();
          }

          return {
            curls: D,
            directions: w
          };
        }
      }, {
        key: "getSlopes",
        value: function (t, e) {
          var n = this.calculateSlope(t[0], t[1], e[0], e[1]);
          return 2 == t.length ? n : [n, this.calculateSlope(t[1], t[2], e[1], e[2])];
        }
      }, {
        key: "angleOrientationAt",
        value: function (t) {
          var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1,
              n = 0,
              r = 0,
              i = 0;
          return t >= 75 && t <= 105 ? n = 1 * e : t >= 25 && t <= 155 ? r = 1 * e : i = 1 * e, [n, r, i];
        }
      }, {
        key: "estimateFingerCurl",
        value: function (t, e, n) {
          var r = t[0] - e[0],
              i = t[0] - n[0],
              o = e[0] - n[0],
              l = t[1] - e[1],
              u = t[1] - n[1],
              c = e[1] - n[1],
              f = t[2] - e[2],
              s = t[2] - n[2],
              h = e[2] - n[2],
              d = Math.sqrt(r * r + l * l + f * f),
              p = Math.sqrt(i * i + u * u + s * s),
              y = Math.sqrt(o * o + c * c + h * h),
              g = (y * y + d * d - p * p) / (2 * y * d);
          g > 1 ? g = 1 : g < -1 && (g = -1);
          var v = Math.acos(g);
          return (v = 57.2958 * v % 180) > this.options.NO_CURL_START_LIMIT ? a.NoCurl : v > this.options.HALF_CURL_START_LIMIT ? a.HalfCurl : a.FullCurl;
        }
      }, {
        key: "estimateHorizontalDirection",
        value: function (t, e, n, r) {
          return r == Math.abs(t) ? t > 0 ? l.HorizontalLeft : l.HorizontalRight : r == Math.abs(e) ? e > 0 ? l.HorizontalLeft : l.HorizontalRight : n > 0 ? l.HorizontalLeft : l.HorizontalRight;
        }
      }, {
        key: "estimateVerticalDirection",
        value: function (t, e, n, r) {
          return r == Math.abs(t) ? t < 0 ? l.VerticalDown : l.VerticalUp : r == Math.abs(e) ? e < 0 ? l.VerticalDown : l.VerticalUp : n < 0 ? l.VerticalDown : l.VerticalUp;
        }
      }, {
        key: "estimateDiagonalDirection",
        value: function (t, e, n, r, i, o, a, u) {
          var c = this.estimateVerticalDirection(t, e, n, r),
              f = this.estimateHorizontalDirection(i, o, a, u);
          return c == l.VerticalUp ? f == l.HorizontalLeft ? l.DiagonalUpLeft : l.DiagonalUpRight : f == l.HorizontalLeft ? l.DiagonalDownLeft : l.DiagonalDownRight;
        }
      }, {
        key: "calculateFingerDirection",
        value: function (t, e, n, r) {
          var i = t[0] - e[0],
              o = t[0] - n[0],
              a = e[0] - n[0],
              l = t[1] - e[1],
              c = t[1] - n[1],
              f = e[1] - n[1],
              s = Math.max(Math.abs(i), Math.abs(o), Math.abs(a)),
              h = Math.max(Math.abs(l), Math.abs(c), Math.abs(f)),
              d = 0,
              p = 0,
              y = 0,
              g = h / (s + 1e-5);
          g > 1.5 ? d += this.options.DISTANCE_VOTE_POWER : g > .66 ? p += this.options.DISTANCE_VOTE_POWER : y += this.options.DISTANCE_VOTE_POWER;
          var v = Math.sqrt(i * i + l * l),
              m = Math.sqrt(o * o + c * c),
              b = Math.sqrt(a * a + f * f),
              D = Math.max(v, m, b),
              w = t[0],
              O = t[1],
              M = n[0],
              S = n[1];
          D == v ? (M = n[0], S = n[1]) : D == b && (w = e[0], O = e[1]);
          var T = [w, O],
              C = [M, S],
              R = this.getSlopes(T, C),
              A = this.angleOrientationAt(R, this.options.TOTAL_ANGLE_VOTE_POWER);
          d += A[0], p += A[1], y += A[2];

          var L,
              _ = u(r);

          try {
            for (_.s(); !(L = _.n()).done;) {
              var j = L.value,
                  E = this.angleOrientationAt(j, this.options.SINGLE_ANGLE_VOTE_POWER);
              d += E[0], p += E[1], y += E[2];
            }
          } catch (t) {
            _.e(t);
          } finally {
            _.f();
          }

          return d == Math.max(d, p, y) ? this.estimateVerticalDirection(c, l, f, h) : y == Math.max(p, y) ? this.estimateHorizontalDirection(o, i, a, s) : this.estimateDiagonalDirection(c, l, f, h, o, i, a, s);
        }
      }, {
        key: "calculateSlope",
        value: function (t, e, n, r) {
          var i = (e - r) / (t - n),
              o = 180 * Math.atan(i) / Math.PI;
          return o <= 0 ? o = -o : o > 0 && (o = 180 - o), o;
        }
      }]) && h(e.prototype, n), r && h(e, r), t;
    }();

    function p(t) {
      if ("undefined" == typeof Symbol || null == t[Symbol.iterator]) {
        if (Array.isArray(t) || (t = function (t, e) {
          if (!t) return;
          if ("string" == typeof t) return y(t, e);
          var n = Object.prototype.toString.call(t).slice(8, -1);
          "Object" === n && t.constructor && (n = t.constructor.name);
          if ("Map" === n || "Set" === n) return Array.from(n);
          if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return y(t, e);
        }(t))) {
          var e = 0,
              n = function () {};

          return {
            s: n,
            n: function () {
              return e >= t.length ? {
                done: !0
              } : {
                done: !1,
                value: t[e++]
              };
            },
            e: function (t) {
              throw t;
            },
            f: n
          };
        }

        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }

      var r,
          i,
          o = !0,
          a = !1;
      return {
        s: function () {
          r = t[Symbol.iterator]();
        },
        n: function () {
          var t = r.next();
          return o = t.done, t;
        },
        e: function (t) {
          a = !0, i = t;
        },
        f: function () {
          try {
            o || null == r.return || r.return();
          } finally {
            if (a) throw i;
          }
        }
      };
    }

    function y(t, e) {
      (null == e || e > t.length) && (e = t.length);

      for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];

      return r;
    }

    function g(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }

    function v(t, e) {
      for (var n = 0; n < e.length; n++) {
        var r = e[n];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
      }
    }

    var m = function () {
      function t(e) {
        var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        g(this, t), this.estimator = new d(n), this.gestures = e;
      }

      var e, n, r;
      return e = t, (n = [{
        key: "estimate",
        value: function (t, e) {
          var n,
              r = [],
              i = this.estimator.estimate(t),
              u = [],
              c = p(o.all);

          try {
            for (c.s(); !(n = c.n()).done;) {
              var f = n.value;
              u.push([o.getName(f), a.getName(i.curls[f]), l.getName(i.directions[f])]);
            }
          } catch (t) {
            c.e(t);
          } finally {
            c.f();
          }

          var s,
              h = p(this.gestures);

          try {
            for (h.s(); !(s = h.n()).done;) {
              var d = s.value,
                  y = d.matchAgainst(i.curls, i.directions);
              y >= e && r.push({
                name: d.name,
                confidence: y
              });
            }
          } catch (t) {
            h.e(t);
          } finally {
            h.f();
          }

          return {
            poseData: u,
            gestures: r
          };
        }
      }]) && v(e.prototype, n), r && v(e, r), t;
    }();

    function b(t, e) {
      return function (t) {
        if (Array.isArray(t)) return t;
      }(t) || function (t, e) {
        if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(t))) return;
        var n = [],
            r = !0,
            i = !1,
            o = void 0;

        try {
          for (var a, l = t[Symbol.iterator](); !(r = (a = l.next()).done) && (n.push(a.value), !e || n.length !== e); r = !0);
        } catch (t) {
          i = !0, o = t;
        } finally {
          try {
            r || null == l.return || l.return();
          } finally {
            if (i) throw o;
          }
        }

        return n;
      }(t, e) || w(t, e) || function () {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }();
    }

    function D(t) {
      if ("undefined" == typeof Symbol || null == t[Symbol.iterator]) {
        if (Array.isArray(t) || (t = w(t))) {
          var e = 0,
              n = function () {};

          return {
            s: n,
            n: function () {
              return e >= t.length ? {
                done: !0
              } : {
                done: !1,
                value: t[e++]
              };
            },
            e: function (t) {
              throw t;
            },
            f: n
          };
        }

        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }

      var r,
          i,
          o = !0,
          a = !1;
      return {
        s: function () {
          r = t[Symbol.iterator]();
        },
        n: function () {
          var t = r.next();
          return o = t.done, t;
        },
        e: function (t) {
          a = !0, i = t;
        },
        f: function () {
          try {
            o || null == r.return || r.return();
          } finally {
            if (a) throw i;
          }
        }
      };
    }

    function w(t, e) {
      if (t) {
        if ("string" == typeof t) return O(t, e);
        var n = Object.prototype.toString.call(t).slice(8, -1);
        return "Object" === n && t.constructor && (n = t.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? O(t, e) : void 0;
      }
    }

    function O(t, e) {
      (null == e || e > t.length) && (e = t.length);

      for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];

      return r;
    }

    function M(t, e) {
      for (var n = 0; n < e.length; n++) {
        var r = e[n];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
      }
    }

    var S = function () {
      function t(e) {
        !function (t, e) {
          if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
        }(this, t), this.name = e, this.curls = {}, this.directions = {}, this.weights = [1, 1, 1, 1, 1], this.weightsRelative = [1, 1, 1, 1, 1];
      }

      var e, n, r;
      return e = t, (n = [{
        key: "addCurl",
        value: function (t, e, n) {
          void 0 === this.curls[t] && (this.curls[t] = []), this.curls[t].push([e, n]);
        }
      }, {
        key: "addDirection",
        value: function (t, e, n) {
          void 0 === this.directions[t] && (this.directions[t] = []), this.directions[t].push([e, n]);
        }
      }, {
        key: "setWeight",
        value: function (t, e) {
          this.weights[t] = e;
          var n = this.weights.reduce(function (t, e) {
            return t + e;
          }, 0);
          this.weightsRelative = this.weights.map(function (t) {
            return 5 * t / n;
          });
        }
      }, {
        key: "matchAgainst",
        value: function (t, e) {
          var n = 0;

          for (var r in t) {
            var i = t[r],
                o = this.curls[r];

            if (void 0 !== o) {
              var a,
                  l = D(o);

              try {
                for (l.s(); !(a = l.n()).done;) {
                  var u = b(a.value, 2),
                      c = u[0],
                      f = u[1];

                  if (i == c) {
                    n += f * this.weightsRelative[r];
                    break;
                  }
                }
              } catch (t) {
                l.e(t);
              } finally {
                l.f();
              }
            } else n += this.weightsRelative[r];
          }

          for (var s in e) {
            var h = e[s],
                d = this.directions[s];

            if (void 0 !== d) {
              var p,
                  y = D(d);

              try {
                for (y.s(); !(p = y.n()).done;) {
                  var g = b(p.value, 2),
                      v = g[0],
                      m = g[1];

                  if (h == v) {
                    n += m * this.weightsRelative[s];
                    break;
                  }
                }
              } catch (t) {
                y.e(t);
              } finally {
                y.f();
              }
            } else n += this.weightsRelative[s];
          }

          return n;
        }
      }]) && M(e.prototype, n), r && M(e, r), t;
    }(),
        T = new S("victory");

    T.addCurl(o.Thumb, a.HalfCurl, .5), T.addCurl(o.Thumb, a.NoCurl, .5), T.addDirection(o.Thumb, l.VerticalUp, 1), T.addDirection(o.Thumb, l.DiagonalUpLeft, 1), T.addCurl(o.Index, a.NoCurl, 1), T.addDirection(o.Index, l.VerticalUp, .75), T.addDirection(o.Index, l.DiagonalUpLeft, 1), T.addCurl(o.Middle, a.NoCurl, 1), T.addDirection(o.Middle, l.VerticalUp, 1), T.addDirection(o.Middle, l.DiagonalUpLeft, .75), T.addCurl(o.Ring, a.FullCurl, 1), T.addDirection(o.Ring, l.VerticalUp, .2), T.addDirection(o.Ring, l.DiagonalUpLeft, 1), T.addDirection(o.Ring, l.HorizontalLeft, .2), T.addCurl(o.Pinky, a.FullCurl, 1), T.addDirection(o.Pinky, l.VerticalUp, .2), T.addDirection(o.Pinky, l.DiagonalUpLeft, 1), T.addDirection(o.Pinky, l.HorizontalLeft, .2), T.setWeight(o.Index, 2), T.setWeight(o.Middle, 2);
    var C = T,
        R = new S("thumbs_up");
    R.addCurl(o.Thumb, a.NoCurl, 1), R.addDirection(o.Thumb, l.VerticalUp, 1), R.addDirection(o.Thumb, l.DiagonalUpLeft, .25), R.addDirection(o.Thumb, l.DiagonalUpRight, .25);

    for (var A = 0, L = [o.Index, o.Middle, o.Ring, o.Pinky]; A < L.length; A++) {
      var _ = L[A];
      R.addCurl(_, a.FullCurl, 1), R.addDirection(_, l.HorizontalLeft, 1), R.addDirection(_, l.HorizontalRight, 1);
    }

    var j = R;
    e.default = {
      GestureEstimator: m,
      GestureDescription: S,
      Finger: o,
      FingerCurl: a,
      FingerDirection: l,
      Gestures: r
    };
  }]).default;
});
},{}]},{},["2oUc0","7KW17"], "7KW17", "parcelRequire1713")

//# sourceMappingURL=fingerpose.9758d83c.js.map
