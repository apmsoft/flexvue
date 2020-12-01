/*  backbone-fetch-cache v2.0.1 (2015-10-24)
  by MadGlory <hello@madglory.com> (http://madglory.com) - https://github.com/madglory/backbone-fetch-cache.git
 */
!function(a, b) {
    "function" == typeof define && define.amd ? define([ "underscore", "backbone", "jquery" ], function(_, Backbone, c) {
        return a.Backbone = b(_, Backbone, c);
    }) : "undefined" != typeof exports && "undefined" != typeof require ? module.exports = b(require("underscore"), require("backbone"), require("jquery")) : a.Backbone = b(a._, a.Backbone, a.jQuery);
}(this, function(_, Backbone, a) {
    function b(b, c) {
        if (b && _.isObject(b)) {
            if (_.isFunction(b.getCacheKey)) return b.getCacheKey(c);
            b = c && c.url ? c.url : _.isFunction(b.url) ? b.url() : b.url;
        } else if (_.isFunction(b)) return b(c);
        return c && c.data ? "string" == typeof c.data ? b + "?" + c.data : b + "?" + a.param(c.data) : b;
    }
    function c(a, b, c) {
        b = b || {};
        var d = Backbone.fetchCache.getCacheKey(a, b), e = !1, f = b.lastSync || new Date().getTime(), g = !1;
        d && b.cache !== !1 && (b.cache || b.prefill) && (b.expires !== !1 && (e = new Date().getTime() + 1e3 * (b.expires || 300)), 
        b.prefillExpires !== !1 && (g = new Date().getTime() + 1e3 * (b.prefillExpires || 300)), 
        Backbone.fetchCache._cache[d] = {
            expires: e,
            lastSync: f,
            prefillExpires: g,
            value: c
        }, Backbone.fetchCache.setLocalStorage());
    }
    function d(a, c) {
        return _.isFunction(a) ? a = a() : a && _.isObject(a) && (a = b(a, c)), Backbone.fetchCache._cache[a];
    }
    function e(a) {
        return d(a).lastSync;
    }
    function f(a, c) {
        _.isFunction(a) ? a = a() : a && _.isObject(a) && (a = b(a, c)), delete Backbone.fetchCache._cache[a], 
        Backbone.fetchCache.setLocalStorage();
    }
    function g() {
        Backbone.fetchCache._cache = {};
    }
    function h() {
        if (l && Backbone.fetchCache.localStorage) try {
            localStorage.setItem(Backbone.fetchCache.getLocalStorageKey(), JSON.stringify(Backbone.fetchCache._cache));
        } catch (a) {
            var b = a.code || a.number || a.message;
            if (22 !== b && 1014 !== b) throw a;
            this._deleteCacheWithPriority();
        }
    }
    function i() {
        if (l && Backbone.fetchCache.localStorage) {
            var a = localStorage.getItem(Backbone.fetchCache.getLocalStorageKey()) || "{}";
            Backbone.fetchCache._cache = JSON.parse(a);
        }
    }
    function j(a) {
        return window.setTimeout(a, 0);
    }
    var k = {
        modelFetch: Backbone.Model.prototype.fetch,
        modelSync: Backbone.Model.prototype.sync,
        collectionFetch: Backbone.Collection.prototype.fetch
    }, l = function() {
        var a = "undefined" != typeof window.localStorage;
        if (a) try {
            localStorage.setItem("test_support", "test_support"), localStorage.removeItem("test_support");
        } catch (b) {
            a = !1;
        }
        return a;
    }();
    return Backbone.fetchCache = Backbone.fetchCache || {}, Backbone.fetchCache._cache = Backbone.fetchCache._cache || {}, 
    Backbone.fetchCache.enabled = !0, Backbone.fetchCache.priorityFn = function(a, b) {
        return a && a.expires && b && b.expires ? a.expires - b.expires : a;
    }, Backbone.fetchCache._prioritize = function() {
        var a = _.values(this._cache).sort(this.priorityFn), b = _.indexOf(_.values(this._cache), a[0]);
        return _.keys(this._cache)[b];
    }, Backbone.fetchCache._deleteCacheWithPriority = function() {
        Backbone.fetchCache._cache[this._prioritize()] = null, delete Backbone.fetchCache._cache[this._prioritize()], 
        Backbone.fetchCache.setLocalStorage();
    }, Backbone.fetchCache.getLocalStorageKey = function() {
        return "backboneCache";
    }, "undefined" == typeof Backbone.fetchCache.localStorage && (Backbone.fetchCache.localStorage = !0), 
    Backbone.Model.prototype.fetch = function(b) {
        function c() {
            return b.prefill && (!b.prefillExpires || i);
        }
        function e() {
            b.parse && (l = o.parse(l, b)), o.set(l, b), _.isFunction(b.prefillSuccess) && b.prefillSuccess.call(n, o, l, b), 
            o.trigger("cachesync", o, l, b), o.trigger("sync", o, l, b), c() ? m.notifyWith(n, [ o ]) : (_.isFunction(b.success) && b.success.call(n, o, l, b), 
            m.resolveWith(n, [ o ]));
        }
        if (!Backbone.fetchCache.enabled) return k.modelFetch.apply(this, arguments);
        b = _.defaults(b || {}, {
            parse: !0
        });
        var f = Backbone.fetchCache.getCacheKey(this, b), g = d(f), h = !1, i = !1, l = !1, m = new a.Deferred(), n = b.context || this, o = this;
        if (g && (h = g.expires, h = h && g.expires < new Date().getTime(), i = g.prefillExpires, 
        i = i && g.prefillExpires < new Date().getTime(), l = g.value), !h && (b.cache || b.prefill) && l && (null == b.async && (b.async = !0), 
        b.async ? j(e) : e(), !c())) return m.promise();
        var p = k.modelFetch.apply(this, arguments);
        return p.done(_.bind(m.resolve, n, this)).done(_.bind(Backbone.fetchCache.setCache, null, this, b)).fail(_.bind(m.reject, n, this)), 
        m.abort = p.abort, m.promise();
    }, Backbone.Model.prototype.sync = function(a, b, c) {
        if ("read" === a || !Backbone.fetchCache.enabled) return k.modelSync.apply(this, arguments);
        var d, e, g = b.collection, h = [];
        for (h.push(Backbone.fetchCache.getCacheKey(b, c)), g && h.push(Backbone.fetchCache.getCacheKey(g)), 
        d = 0, e = h.length; e > d; d++) f(h[d]);
        return k.modelSync.apply(this, arguments);
    }, Backbone.Collection.prototype.fetch = function(b) {
        function c() {
            return b.prefill && (!b.prefillExpires || i);
        }
        function e() {
            o[b.reset ? "reset" : "set"](l, b), _.isFunction(b.prefillSuccess) && b.prefillSuccess.call(n, o), 
            o.trigger("cachesync", o, l, b), o.trigger("sync", o, l, b), c() ? m.notifyWith(n, [ o ]) : (_.isFunction(b.success) && b.success.call(n, o, l, b), 
            m.resolveWith(n, [ o ]));
        }
        if (!Backbone.fetchCache.enabled) return k.collectionFetch.apply(this, arguments);
        b = _.defaults(b || {}, {
            parse: !0
        });
        var f = Backbone.fetchCache.getCacheKey(this, b), g = d(f), h = !1, i = !1, l = !1, m = new a.Deferred(), n = b.context || this, o = this;
        if (g && (h = g.expires, h = h && g.expires < new Date().getTime(), i = g.prefillExpires, 
        i = i && g.prefillExpires < new Date().getTime(), l = g.value), !h && (b.cache || b.prefill) && l && (null == b.async && (b.async = !0), 
        b.async ? j(e) : e(), !c())) return m.promise();
        var p = k.collectionFetch.apply(this, arguments);
        return p.done(_.bind(m.resolve, n, this)).done(_.bind(Backbone.fetchCache.setCache, null, this, b)).fail(_.bind(m.reject, n, this)), 
        m.abort = p.abort, m.promise();
    }, i(), Backbone.fetchCache._superMethods = k, Backbone.fetchCache.setCache = c, 
    Backbone.fetchCache.getCache = d, Backbone.fetchCache.getCacheKey = b, Backbone.fetchCache.getLastSync = e, 
    Backbone.fetchCache.clearItem = f, Backbone.fetchCache.reset = g, Backbone.fetchCache.setLocalStorage = h, 
    Backbone.fetchCache.getLocalStorage = i, Backbone;
});