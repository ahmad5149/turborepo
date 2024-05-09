var _self =
        "undefined" != typeof window
            ? window
            : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope
              ? self
              : {},
    Prism = (function (e) {
        var t = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,
            a = 0,
            n = {},
            s = {
                manual: e.Prism && e.Prism.manual,
                disableWorkerMessageHandler: e.Prism && e.Prism.disableWorkerMessageHandler,
                util: {
                    encode: function e(t) {
                        return t instanceof r
                            ? new r(t.type, e(t.content), t.alias)
                            : Array.isArray(t)
                              ? t.map(e)
                              : t
                                    ?.replace(/&/g, "&amp;")
                                    ?.replace(/</g, "&lt;")
                                    ?.replace(/\u00a0/g, " ");
                    },
                    type: function (e) {
                        return Object.prototype.toString.call(e).slice(8, -1);
                    },
                    objId: function (e) {
                        return e.__id || Object.defineProperty(e, "__id", { value: ++a }), e.__id;
                    },
                    clone: function e(t, a) {
                        var n, r;
                        switch (((a = a || {}), s.util.type(t))) {
                            case "Object":
                                if (((r = s.util.objId(t)), a[r])) return a[r];
                                for (var i in ((n = {}), (a[r] = n), t)) t.hasOwnProperty(i) && (n[i] = e(t[i], a));
                                return n;
                            case "Array":
                                return (
                                    (r = s.util.objId(t)),
                                    a[r]
                                        ? a[r]
                                        : ((n = []),
                                          (a[r] = n),
                                          t.forEach(function (t, s) {
                                              n[s] = e(t, a);
                                          }),
                                          n)
                                );
                            default:
                                return t;
                        }
                    },
                    getLanguage: function (e) {
                        for (; e; ) {
                            var a = t.exec(e.className);
                            if (a) return a[1].toLowerCase();
                            e = e.parentElement;
                        }
                        return "none";
                    },
                    setLanguage: function (e, a) {
                        (e.className = e.className?.replace(RegExp(t, "gi"), "")), e.classList.add("language-" + a);
                    },
                    currentScript: function () {
                        if ("undefined" == typeof document) return null;
                        if ("currentScript" in document) return document.currentScript;
                        try {
                            throw new Error();
                        } catch (n) {
                            var e = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(n.stack) || [])[1];
                            if (e) {
                                var t = document.getElementsByTagName("script");
                                for (var a in t) if (t[a].src == e) return t[a];
                            }
                            return null;
                        }
                    },
                    isActive: function (e, t, a) {
                        for (var n = "no-" + t; e; ) {
                            var s = e.classList;
                            if (s.contains(t)) return !0;
                            if (s.contains(n)) return !1;
                            e = e.parentElement;
                        }
                        return !!a;
                    }
                },
                languages: {
                    plain: n,
                    plaintext: n,
                    text: n,
                    txt: n,
                    extend: function (e, t) {
                        var a = s.util.clone(s.languages[e]);
                        for (var n in t) a[n] = t[n];
                        return a;
                    },
                    insertBefore: function (e, t, a, n) {
                        var r = (n = n || s.languages)[e],
                            i = {};
                        for (var o in r)
                            if (r.hasOwnProperty(o)) {
                                if (o == t) for (var l in a) a.hasOwnProperty(l) && (i[l] = a[l]);
                                a.hasOwnProperty(o) || (i[o] = r[o]);
                            }
                        var u = n[e];
                        return (
                            (n[e] = i),
                            s.languages.DFS(s.languages, function (t, a) {
                                a === u && t != e && (this[t] = i);
                            }),
                            i
                        );
                    },
                    DFS: function e(t, a, n, r) {
                        r = r || {};
                        var i = s.util.objId;
                        for (var o in t)
                            if (t.hasOwnProperty(o)) {
                                a.call(t, o, t[o], n || o);
                                var l = t[o],
                                    u = s.util.type(l);
                                "Object" !== u || r[i(l)]
                                    ? "Array" !== u || r[i(l)] || ((r[i(l)] = !0), e(l, a, o, r))
                                    : ((r[i(l)] = !0), e(l, a, null, r));
                            }
                    }
                },
                plugins: {},
                highlightAll: function (e, t) {
                    s.highlightAllUnder(document, e, t);
                },
                highlightAllUnder: function (e, t, a) {
                    var n = {
                        callback: a,
                        container: e,
                        selector:
                            'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
                    };
                    s.hooks.run("before-highlightall", n),
                        (n.elements = Array.prototype.slice.apply(n.container.querySelectorAll(n.selector))),
                        s.hooks.run("before-all-elements-highlight", n);
                    for (var r, i = 0; (r = n.elements[i++]); ) s.highlightElement(r, !0 === t, n.callback);
                },
                highlightElement: function (t, a, n) {
                    var r = s.util.getLanguage(t),
                        i = s.languages[r];
                    s.util.setLanguage(t, r);
                    var o = t.parentElement;
                    o && "pre" === o.nodeName.toLowerCase() && s.util.setLanguage(o, r);
                    var l = { element: t, language: r, grammar: i, code: t.textContent };
                    function u(e) {
                        (l.highlightedCode = e),
                            s.hooks.run("before-insert", l),
                            (l.element.innerHTML = l.highlightedCode),
                            s.hooks.run("after-highlight", l),
                            s.hooks.run("complete", l),
                            n && n.call(l.element);
                    }
                    if (
                        (s.hooks.run("before-sanity-check", l),
                        (o = l.element.parentElement) &&
                            "pre" === o.nodeName.toLowerCase() &&
                            !o.hasAttribute("tabindex") &&
                            o.setAttribute("tabindex", "0"),
                        !l.code)
                    )
                        return s.hooks.run("complete", l), void (n && n.call(l.element));
                    if ((s.hooks.run("before-highlight", l), l.grammar))
                        if (a && e.Worker) {
                            var c = new Worker(s.filename);
                            (c.onmessage = function (e) {
                                u(e.data);
                            }),
                                c.postMessage(
                                    JSON.stringify({ language: l.language, code: l.code, immediateClose: !0 })
                                );
                        } else u(s.highlight(l.code, l.grammar, l.language));
                    else u(s.util.encode(l.code));
                },
                highlight: function (e, t, a) {
                    var n = { code: e, grammar: t, language: a };
                    if ((s.hooks.run("before-tokenize", n), !n.grammar))
                        throw new Error('The language "' + n.language + '" has no grammar.');
                    return (
                        (n.tokens = s.tokenize(n.code, n.grammar)),
                        s.hooks.run("after-tokenize", n),
                        r.stringify(s.util.encode(n.tokens), n.language)
                    );
                },
                tokenize: function (e, t) {
                    var a = t.rest;
                    if (a) {
                        for (var n in a) t[n] = a[n];
                        delete t.rest;
                    }
                    var s = new l();
                    return (
                        u(s, s.head, e),
                        o(e, s, t, s.head, 0),
                        (function (e) {
                            var t = [],
                                a = e.head.next;
                            for (; a !== e.tail; ) t.push(a.value), (a = a.next);
                            return t;
                        })(s)
                    );
                },
                hooks: {
                    all: {},
                    add: function (e, t) {
                        var a = s.hooks.all;
                        (a[e] = a[e] || []), a[e].push(t);
                    },
                    run: function (e, t) {
                        var a = s.hooks.all[e];
                        if (a && a.length) for (var n, r = 0; (n = a[r++]); ) n(t);
                    }
                },
                Token: r
            };
        function r(e, t, a, n) {
            (this.type = e), (this.content = t), (this.alias = a), (this.length = 0 | (n || "").length);
        }
        function i(e, t, a, n) {
            e.lastIndex = t;
            var s = e.exec(a);
            if (s && n && s[1]) {
                var r = s[1].length;
                (s.index += r), (s[0] = s[0].slice(r));
            }
            return s;
        }
        function o(e, t, a, n, l, d) {
            for (var p in a)
                if (a.hasOwnProperty(p) && a[p]) {
                    var g = a[p];
                    g = Array.isArray(g) ? g : [g];
                    for (var m = 0; m < g.length; ++m) {
                        if (d && d.cause == p + "," + m) return;
                        var f = g[m],
                            h = f.inside,
                            b = !!f.lookbehind,
                            y = !!f.greedy,
                            k = f.alias;
                        if (y && !f.pattern.global) {
                            var v = f.pattern.toString().match(/[imsuy]*$/)[0];
                            f.pattern = RegExp(f.pattern.source, v + "g");
                        }
                        for (
                            var w = f.pattern || f, F = n.next, P = l;
                            F !== t.tail && !(d && P >= d.reach);
                            P += F.value.length, F = F.next
                        ) {
                            var A = F.value;
                            if (t.length > e.length) return;
                            if (!(A instanceof r)) {
                                var S,
                                    x = 1;
                                if (y) {
                                    if (!(S = i(w, P, e, b)) || S.index >= e.length) break;
                                    var _ = S.index,
                                        $ = S.index + S[0].length,
                                        E = P;
                                    for (E += F.value.length; _ >= E; ) E += (F = F.next).value.length;
                                    if (((P = E -= F.value.length), F.value instanceof r)) continue;
                                    for (var T = F; T !== t.tail && (E < $ || "string" == typeof T.value); T = T.next)
                                        x++, (E += T.value.length);
                                    x--, (A = e.slice(P, E)), (S.index -= P);
                                } else if (!(S = i(w, 0, A, b))) continue;
                                _ = S.index;
                                var O = S[0],
                                    z = A.slice(0, _),
                                    I = A.slice(_ + O.length),
                                    N = P + A.length;
                                d && N > d.reach && (d.reach = N);
                                var R = F.prev;
                                if (
                                    (z && ((R = u(t, R, z)), (P += z.length)),
                                    c(t, R, x),
                                    (F = u(t, R, new r(p, h ? s.tokenize(O, h) : O, k, O))),
                                    I && u(t, F, I),
                                    x > 1)
                                ) {
                                    var D = { cause: p + "," + m, reach: N };
                                    o(e, t, a, F.prev, P, D), d && D.reach > d.reach && (d.reach = D.reach);
                                }
                            }
                        }
                    }
                }
        }
        function l() {
            var e = { value: null, prev: null, next: null },
                t = { value: null, prev: e, next: null };
            (e.next = t), (this.head = e), (this.tail = t), (this.length = 0);
        }
        function u(e, t, a) {
            var n = t.next,
                s = { value: a, prev: t, next: n };
            return (t.next = s), (n.prev = s), e.length++, s;
        }
        function c(e, t, a) {
            for (var n = t.next, s = 0; s < a && n !== e.tail; s++) n = n.next;
            (t.next = n), (n.prev = t), (e.length -= s);
        }
        if (
            ((e.Prism = s),
            (r.stringify = function e(t, a) {
                if ("string" == typeof t) return t;
                if (Array.isArray(t)) {
                    var n = "";
                    return (
                        t.forEach(function (t) {
                            n += e(t, a);
                        }),
                        n
                    );
                }
                var r = {
                        type: t.type,
                        content: e(t.content, a),
                        tag: "span",
                        classes: ["token", t.type],
                        attributes: {},
                        language: a
                    },
                    i = t.alias;
                i && (Array.isArray(i) ? Array.prototype.push.apply(r.classes, i) : r.classes.push(i)),
                    s.hooks.run("wrap", r);
                var o = "";
                for (var l in r.attributes)
                    o += " " + l + '="' + (r.attributes[l] || "")?.replace(/"/g, "&quot;") + '"';
                return "<" + r.tag + ' class="' + r.classes.join(" ") + '"' + o + ">" + r.content + "</" + r.tag + ">";
            }),
            !e.document)
        )
            return e.addEventListener
                ? (s.disableWorkerMessageHandler ||
                      e.addEventListener(
                          "message",
                          function (t) {
                              var a = JSON.parse(t.data),
                                  n = a.language,
                                  r = a.code,
                                  i = a.immediateClose;
                              e.postMessage(s.highlight(r, s.languages[n], n)), i && e.close();
                          },
                          !1
                      ),
                  s)
                : s;
        var d = s.util.currentScript();
        function p() {
            s.manual || s.highlightAll();
        }
        if ((d && ((s.filename = d.src), d.hasAttribute("data-manual") && (s.manual = !0)), !s.manual)) {
            var g = document.readyState;
            "loading" === g || ("interactive" === g && d && d.defer)
                ? document.addEventListener("DOMContentLoaded", p)
                : window.requestAnimationFrame
                  ? window.requestAnimationFrame(p)
                  : window.setTimeout(p, 16);
        }
        return s;
    })(_self);
/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */ "undefined" != typeof module && module.exports && (module.exports = Prism),
    "undefined" != typeof global && (global.Prism = Prism),
    (Prism.languages.markup = {
        comment: { pattern: /<!--(?:(?!<!--)[\s\S])*?-->/, greedy: !0 },
        prolog: { pattern: /<\?[\s\S]+?\?>/, greedy: !0 },
        doctype: {
            pattern:
                /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
            greedy: !0,
            inside: {
                "internal-subset": { pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/, lookbehind: !0, greedy: !0, inside: null },
                string: { pattern: /"[^"]*"|'[^']*'/, greedy: !0 },
                punctuation: /^<!|>$|[[\]]/,
                "doctype-tag": /^DOCTYPE/i,
                name: /[^\s<>'"]+/
            }
        },
        cdata: { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, greedy: !0 },
        tag: {
            pattern:
                /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
            greedy: !0,
            inside: {
                tag: { pattern: /^<\/?[^\s>\/]+/, inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ } },
                "special-attr": [],
                "attr-value": {
                    pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
                    inside: {
                        punctuation: [
                            { pattern: /^=/, alias: "attr-equals" },
                            { pattern: /^(\s*)["']|["']$/, lookbehind: !0 }
                        ]
                    }
                },
                punctuation: /\/?>/,
                "attr-name": { pattern: /[^\s>\/]+/, inside: { namespace: /^[^\s>\/:]+:/ } }
            }
        },
        entity: [{ pattern: /&[\da-z]{1,8};/i, alias: "named-entity" }, /&#x?[\da-f]{1,8};/i]
    }),
    (Prism.languages.markup.tag.inside["attr-value"].inside.entity = Prism.languages.markup.entity),
    (Prism.languages.markup.doctype.inside["internal-subset"].inside = Prism.languages.markup),
    Prism.hooks.add("wrap", function (e) {
        "entity" === e.type && (e.attributes.title = e.content?.replace(/&amp;/, "&"));
    }),
    Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
        value: function (e, t) {
            var a = {};
            (a["language-" + t] = {
                pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
                lookbehind: !0,
                inside: Prism.languages[t]
            }),
                (a.cdata = /^<!\[CDATA\[|\]\]>$/i);
            var n = { "included-cdata": { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, inside: a } };
            n["language-" + t] = { pattern: /[\s\S]+/, inside: Prism.languages[t] };
            var s = {};
            (s[e] = {
                pattern: RegExp(
                    /(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source?.replace(
                        /__/g,
                        function () {
                            return e;
                        }
                    ),
                    "i"
                ),
                lookbehind: !0,
                greedy: !0,
                inside: n
            }),
                Prism.languages.insertBefore("markup", "cdata", s);
        }
    }),
    Object.defineProperty(Prism.languages.markup.tag, "addAttribute", {
        value: function (e, t) {
            Prism.languages.markup.tag.inside["special-attr"].push({
                pattern: RegExp(
                    /(^|["'\s])/.source + "(?:" + e + ")" + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
                    "i"
                ),
                lookbehind: !0,
                inside: {
                    "attr-name": /^[^\s=]+/,
                    "attr-value": {
                        pattern: /=[\s\S]+/,
                        inside: {
                            value: {
                                pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                                lookbehind: !0,
                                alias: [t, "language-" + t],
                                inside: Prism.languages[t]
                            },
                            punctuation: [{ pattern: /^=/, alias: "attr-equals" }, /"|'/]
                        }
                    }
                }
            });
        }
    }),
    (Prism.languages.html = Prism.languages.markup),
    (Prism.languages.mathml = Prism.languages.markup),
    (Prism.languages.svg = Prism.languages.markup),
    (Prism.languages.xml = Prism.languages.extend("markup", {})),
    (Prism.languages.ssml = Prism.languages.xml),
    (Prism.languages.atom = Prism.languages.xml),
    (Prism.languages.rss = Prism.languages.xml),
    (function (e) {
        var t = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
        (e.languages.css = {
            comment: /\/\*[\s\S]*?\*\//,
            atrule: {
                pattern: RegExp(
                    "@[\\w-](?:" + /[^;{\s"']|\s+(?!\s)/.source + "|" + t.source + ")*?" + /(?:;|(?=\s*\{))/.source
                ),
                inside: {
                    rule: /^@[\w-]+/,
                    "selector-function-argument": {
                        pattern:
                            /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
                        lookbehind: !0,
                        alias: "selector"
                    },
                    keyword: { pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/, lookbehind: !0 }
                }
            },
            url: {
                pattern: RegExp("\\burl\\((?:" + t.source + "|" + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ")\\)", "i"),
                greedy: !0,
                inside: {
                    function: /^url/i,
                    punctuation: /^\(|\)$/,
                    string: { pattern: RegExp("^" + t.source + "$"), alias: "url" }
                }
            },
            selector: {
                pattern: RegExp("(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|" + t.source + ")*(?=\\s*\\{)"),
                lookbehind: !0
            },
            string: { pattern: t, greedy: !0 },
            property: {
                pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
                lookbehind: !0
            },
            important: /!important\b/i,
            function: { pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i, lookbehind: !0 },
            punctuation: /[(){};:,]/
        }),
            (e.languages.css.atrule.inside.rest = e.languages.css);
        var a = e.languages.markup;
        a && (a.tag.addInlined("style", "css"), a.tag.addAttribute("style", "css"));
    })(Prism),
    (Prism.languages.clike = {
        comment: [
            { pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0, greedy: !0 },
            { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 }
        ],
        string: { pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: !0 },
        "class-name": {
            pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
            lookbehind: !0,
            inside: { punctuation: /[.\\]/ }
        },
        keyword:
            /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
        boolean: /\b(?:false|true)\b/,
        function: /\b\w+(?=\()/,
        number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
        operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
        punctuation: /[{}[\];(),.:]/
    }),
    (Prism.languages.javascript = Prism.languages.extend("clike", {
        "class-name": [
            Prism.languages.clike["class-name"],
            {
                pattern:
                    /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
                lookbehind: !0
            }
        ],
        keyword: [
            { pattern: /((?:^|\})\s*)catch\b/, lookbehind: !0 },
            {
                pattern:
                    /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
                lookbehind: !0
            }
        ],
        function: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
        number: {
            pattern: RegExp(
                /(^|[^\w$])/.source +
                    "(?:" +
                    /NaN|Infinity/.source +
                    "|" +
                    /0[bB][01]+(?:_[01]+)*n?/.source +
                    "|" +
                    /0[oO][0-7]+(?:_[0-7]+)*n?/.source +
                    "|" +
                    /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source +
                    "|" +
                    /\d+(?:_\d+)*n/.source +
                    "|" +
                    /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source +
                    ")" +
                    /(?![\w$])/.source
            ),
            lookbehind: !0
        },
        operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
    })),
    (Prism.languages.javascript["class-name"][0].pattern =
        /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/),
    Prism.languages.insertBefore("javascript", "keyword", {
        regex: {
            pattern: RegExp(
                /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source +
                    /\//.source +
                    "(?:" +
                    /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source +
                    "|" +
                    /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/
                        .source +
                    ")" +
                    /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source
            ),
            lookbehind: !0,
            greedy: !0,
            inside: {
                "regex-source": {
                    pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
                    lookbehind: !0,
                    alias: "language-regex",
                    inside: Prism.languages.regex
                },
                "regex-delimiter": /^\/|\/$/,
                "regex-flags": /^[a-z]+$/
            }
        },
        "function-variable": {
            pattern:
                /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
            alias: "function"
        },
        parameter: [
            {
                pattern:
                    /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
                lookbehind: !0,
                inside: Prism.languages.javascript
            },
            {
                pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
                lookbehind: !0,
                inside: Prism.languages.javascript
            },
            {
                pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
                lookbehind: !0,
                inside: Prism.languages.javascript
            },
            {
                pattern:
                    /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
                lookbehind: !0,
                inside: Prism.languages.javascript
            }
        ],
        constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
    }),
    Prism.languages.insertBefore("javascript", "string", {
        hashbang: { pattern: /^#!.*/, greedy: !0, alias: "comment" },
        "template-string": {
            pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
            greedy: !0,
            inside: {
                "template-punctuation": { pattern: /^`|`$/, alias: "string" },
                interpolation: {
                    pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
                    lookbehind: !0,
                    inside: {
                        "interpolation-punctuation": { pattern: /^\$\{|\}$/, alias: "punctuation" },
                        rest: Prism.languages.javascript
                    }
                },
                string: /[\s\S]+/
            }
        },
        "string-property": {
            pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
            lookbehind: !0,
            greedy: !0,
            alias: "property"
        }
    }),
    Prism.languages.insertBefore("javascript", "operator", {
        "literal-property": {
            pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
            lookbehind: !0,
            alias: "property"
        }
    }),
    Prism.languages.markup &&
        (Prism.languages.markup.tag.addInlined("script", "javascript"),
        Prism.languages.markup.tag.addAttribute(
            /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/
                .source,
            "javascript"
        )),
    (Prism.languages.js = Prism.languages.javascript),
    (function () {
        if (void 0 !== Prism && "undefined" != typeof document) {
            Element.prototype.matches ||
                (Element.prototype.matches =
                    Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector);
            var e = {
                    js: "javascript",
                    py: "python",
                    rb: "ruby",
                    ps1: "powershell",
                    psm1: "powershell",
                    sh: "bash",
                    bat: "batch",
                    h: "c",
                    tex: "latex"
                },
                t = "data-src-status",
                a = "loading",
                n = "loaded",
                s = "pre[data-src]:not([" + t + '="' + n + '"]):not([' + t + '="' + a + '"])';
            Prism.hooks.add("before-highlightall", function (e) {
                e.selector += ", " + s;
            }),
                Prism.hooks.add("before-sanity-check", function (r) {
                    var i = r.element;
                    if (i.matches(s)) {
                        (r.code = ""), i.setAttribute(t, a);
                        var o = i.appendChild(document.createElement("CODE"));
                        o.textContent = "Loading…";
                        var l = i.getAttribute("data-src"),
                            u = r.language;
                        if ("none" === u) {
                            var c = (/\.(\w+)$/.exec(l) || [, "none"])[1];
                            u = e[c] || c;
                        }
                        Prism.util.setLanguage(o, u), Prism.util.setLanguage(i, u);
                        var d = Prism.plugins.autoloader;
                        d && d.loadLanguages(u),
                            (function (e, t, a) {
                                var n = new XMLHttpRequest();
                                n.open("GET", e, !0),
                                    (n.onreadystatechange = function () {
                                        4 == n.readyState &&
                                            (n.status < 400 && n.responseText
                                                ? t(n.responseText)
                                                : n.status >= 400
                                                  ? a("✖ Error " + n.status + " while fetching file: " + n.statusText)
                                                  : a("✖ Error: File does not exist or is empty"));
                                    }),
                                    n.send(null);
                            })(
                                l,
                                function (e) {
                                    i.setAttribute(t, n);
                                    var a = (function (e) {
                                        var t = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(e || "");
                                        if (t) {
                                            var a = Number(t[1]),
                                                n = t[2],
                                                s = t[3];
                                            return n ? (s ? [a, Number(s)] : [a, void 0]) : [a, a];
                                        }
                                    })(i.getAttribute("data-range"));
                                    if (a) {
                                        var s = e.split(/\r\n?|\n/g),
                                            r = a[0],
                                            l = null == a[1] ? s.length : a[1];
                                        r < 0 && (r += s.length),
                                            (r = Math.max(0, Math.min(r - 1, s.length))),
                                            l < 0 && (l += s.length),
                                            (l = Math.max(0, Math.min(l, s.length))),
                                            (e = s.slice(r, l).join("\n")),
                                            i.hasAttribute("data-start") || i.setAttribute("data-start", String(r + 1));
                                    }
                                    (o.textContent = e), Prism.highlightElement(o);
                                },
                                function (e) {
                                    i.setAttribute(t, "failed"), (o.textContent = e);
                                }
                            );
                    }
                }),
                (Prism.plugins.fileHighlight = {
                    highlight: function (e) {
                        for (var t, a = (e || document).querySelectorAll(s), n = 0; (t = a[n++]); )
                            Prism.highlightElement(t);
                    }
                });
            var r = !1;
            Prism.fileHighlight = function () {
                r ||
                    (console.warn(
                        "Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."
                    ),
                    (r = !0)),
                    Prism.plugins.fileHighlight.highlight.apply(this, arguments);
            };
        }
    })(),
    (Prism.languages.markup = {
        comment: { pattern: /<!--(?:(?!<!--)[\s\S])*?-->/, greedy: !0 },
        prolog: { pattern: /<\?[\s\S]+?\?>/, greedy: !0 },
        doctype: {
            pattern:
                /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
            greedy: !0,
            inside: {
                "internal-subset": { pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/, lookbehind: !0, greedy: !0, inside: null },
                string: { pattern: /"[^"]*"|'[^']*'/, greedy: !0 },
                punctuation: /^<!|>$|[[\]]/,
                "doctype-tag": /^DOCTYPE/i,
                name: /[^\s<>'"]+/
            }
        },
        cdata: { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, greedy: !0 },
        tag: {
            pattern:
                /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
            greedy: !0,
            inside: {
                tag: { pattern: /^<\/?[^\s>\/]+/, inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ } },
                "special-attr": [],
                "attr-value": {
                    pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
                    inside: {
                        punctuation: [
                            { pattern: /^=/, alias: "attr-equals" },
                            { pattern: /^(\s*)["']|["']$/, lookbehind: !0 }
                        ]
                    }
                },
                punctuation: /\/?>/,
                "attr-name": { pattern: /[^\s>\/]+/, inside: { namespace: /^[^\s>\/:]+:/ } }
            }
        },
        entity: [{ pattern: /&[\da-z]{1,8};/i, alias: "named-entity" }, /&#x?[\da-f]{1,8};/i]
    }),
    (Prism.languages.markup.tag.inside["attr-value"].inside.entity = Prism.languages.markup.entity),
    (Prism.languages.markup.doctype.inside["internal-subset"].inside = Prism.languages.markup),
    Prism.hooks.add("wrap", function (e) {
        "entity" === e.type && (e.attributes.title = e.content?.replace(/&amp;/, "&"));
    }),
    Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
        value: function (e, t) {
            var a = {};
            (a["language-" + t] = {
                pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
                lookbehind: !0,
                inside: Prism.languages[t]
            }),
                (a.cdata = /^<!\[CDATA\[|\]\]>$/i);
            var n = { "included-cdata": { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, inside: a } };
            n["language-" + t] = { pattern: /[\s\S]+/, inside: Prism.languages[t] };
            var s = {};
            (s[e] = {
                pattern: RegExp(
                    /(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source?.replace(
                        /__/g,
                        function () {
                            return e;
                        }
                    ),
                    "i"
                ),
                lookbehind: !0,
                greedy: !0,
                inside: n
            }),
                Prism.languages.insertBefore("markup", "cdata", s);
        }
    }),
    Object.defineProperty(Prism.languages.markup.tag, "addAttribute", {
        value: function (e, t) {
            Prism.languages.markup.tag.inside["special-attr"].push({
                pattern: RegExp(
                    /(^|["'\s])/.source + "(?:" + e + ")" + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
                    "i"
                ),
                lookbehind: !0,
                inside: {
                    "attr-name": /^[^\s=]+/,
                    "attr-value": {
                        pattern: /=[\s\S]+/,
                        inside: {
                            value: {
                                pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                                lookbehind: !0,
                                alias: [t, "language-" + t],
                                inside: Prism.languages[t]
                            },
                            punctuation: [{ pattern: /^=/, alias: "attr-equals" }, /"|'/]
                        }
                    }
                }
            });
        }
    }),
    (Prism.languages.html = Prism.languages.markup),
    (Prism.languages.mathml = Prism.languages.markup),
    (Prism.languages.svg = Prism.languages.markup),
    (Prism.languages.xml = Prism.languages.extend("markup", {})),
    (Prism.languages.ssml = Prism.languages.xml),
    (Prism.languages.atom = Prism.languages.xml),
    (Prism.languages.rss = Prism.languages.xml),
    (function (e) {
        function t(e, t) {
            return "___" + e.toUpperCase() + t + "___";
        }
        Object.defineProperties((e.languages["markup-templating"] = {}), {
            buildPlaceholders: {
                value: function (a, n, s, r) {
                    if (a.language === n) {
                        var i = (a.tokenStack = []);
                        (a.code = a.code?.replace(s, function (e) {
                            if ("function" == typeof r && !r(e)) return e;
                            for (var s, o = i.length; -1 !== a.code.indexOf((s = t(n, o))); ) ++o;
                            return (i[o] = e), s;
                        })),
                            (a.grammar = e.languages.markup);
                    }
                }
            },
            tokenizePlaceholders: {
                value: function (a, n) {
                    if (a.language === n && a.tokenStack) {
                        a.grammar = e.languages[n];
                        var s = 0,
                            r = Object.keys(a.tokenStack);
                        !(function i(o) {
                            for (var l = 0; l < o.length && !(s >= r.length); l++) {
                                var u = o[l];
                                if ("string" == typeof u || (u.content && "string" == typeof u.content)) {
                                    var c = r[s],
                                        d = a.tokenStack[c],
                                        p = "string" == typeof u ? u : u.content,
                                        g = t(n, c),
                                        m = p.indexOf(g);
                                    if (m > -1) {
                                        ++s;
                                        var f = p.substring(0, m),
                                            h = new e.Token(n, e.tokenize(d, a.grammar), "language-" + n, d),
                                            b = p.substring(m + g.length),
                                            y = [];
                                        f && y.push.apply(y, i([f])),
                                            y.push(h),
                                            b && y.push.apply(y, i([b])),
                                            "string" == typeof u
                                                ? o.splice.apply(o, [l, 1].concat(y))
                                                : (u.content = y);
                                    }
                                } else u.content && i(u.content);
                            }
                            return o;
                        })(a.tokens);
                    }
                }
            }
        });
    })(Prism),
    (function (e) {
        var t =
                "\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b",
            a = { pattern: /(^(["']?)\w+\2)[ \t]+\S.*/, lookbehind: !0, alias: "punctuation", inside: null },
            n = {
                bash: a,
                environment: { pattern: RegExp("\\$" + t), alias: "constant" },
                variable: [
                    {
                        pattern: /\$?\(\([\s\S]+?\)\)/,
                        greedy: !0,
                        inside: {
                            variable: [{ pattern: /(^\$\(\([\s\S]+)\)\)/, lookbehind: !0 }, /^\$\(\(/],
                            number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,
                            operator: /--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,
                            punctuation: /\(\(?|\)\)?|,|;/
                        }
                    },
                    {
                        pattern: /\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,
                        greedy: !0,
                        inside: { variable: /^\$\(|^`|\)$|`$/ }
                    },
                    {
                        pattern: /\$\{[^}]+\}/,
                        greedy: !0,
                        inside: {
                            operator: /:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,
                            punctuation: /[\[\]]/,
                            environment: { pattern: RegExp("(\\{)" + t), lookbehind: !0, alias: "constant" }
                        }
                    },
                    /\$(?:\w+|[#?*!@$])/
                ],
                entity: /\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/
            };
        (e.languages.bash = {
            shebang: { pattern: /^#!\s*\/.*/, alias: "important" },
            comment: { pattern: /(^|[^"{\\$])#.*/, lookbehind: !0 },
            "function-name": [
                { pattern: /(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/, lookbehind: !0, alias: "function" },
                { pattern: /\b[\w-]+(?=\s*\(\s*\)\s*\{)/, alias: "function" }
            ],
            "for-or-select": { pattern: /(\b(?:for|select)\s+)\w+(?=\s+in\s)/, alias: "variable", lookbehind: !0 },
            "assign-left": {
                pattern: /(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,
                inside: {
                    environment: { pattern: RegExp("(^|[\\s;|&]|[<>]\\()" + t), lookbehind: !0, alias: "constant" }
                },
                alias: "variable",
                lookbehind: !0
            },
            parameter: {
                pattern: /(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,
                alias: "variable",
                lookbehind: !0
            },
            string: [
                { pattern: /((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/, lookbehind: !0, greedy: !0, inside: n },
                {
                    pattern: /((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,
                    lookbehind: !0,
                    greedy: !0,
                    inside: { bash: a }
                },
                {
                    pattern: /(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,
                    lookbehind: !0,
                    greedy: !0,
                    inside: n
                },
                { pattern: /(^|[^$\\])'[^']*'/, lookbehind: !0, greedy: !0 },
                { pattern: /\$'(?:[^'\\]|\\[\s\S])*'/, greedy: !0, inside: { entity: n.entity } }
            ],
            environment: { pattern: RegExp("\\$?" + t), alias: "constant" },
            variable: n.variable,
            function: {
                pattern:
                    /(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,
                lookbehind: !0
            },
            keyword: {
                pattern:
                    /(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,
                lookbehind: !0
            },
            builtin: {
                pattern:
                    /(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,
                lookbehind: !0,
                alias: "class-name"
            },
            boolean: { pattern: /(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/, lookbehind: !0 },
            "file-descriptor": { pattern: /\B&\d\b/, alias: "important" },
            operator: {
                pattern: /\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,
                inside: { "file-descriptor": { pattern: /^\d/, alias: "important" } }
            },
            punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,
            number: { pattern: /(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/, lookbehind: !0 }
        }),
            (a.inside = e.languages.bash);
        for (
            var s = [
                    "comment",
                    "function-name",
                    "for-or-select",
                    "assign-left",
                    "parameter",
                    "string",
                    "environment",
                    "function",
                    "keyword",
                    "builtin",
                    "boolean",
                    "file-descriptor",
                    "operator",
                    "punctuation",
                    "number"
                ],
                r = n.variable[1].inside,
                i = 0;
            i < s.length;
            i++
        )
            r[s[i]] = e.languages.bash[s[i]];
        (e.languages.sh = e.languages.bash), (e.languages.shell = e.languages.bash);
    })(Prism),
    (Prism.languages.javascript = Prism.languages.extend("clike", {
        "class-name": [
            Prism.languages.clike["class-name"],
            {
                pattern:
                    /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
                lookbehind: !0
            }
        ],
        keyword: [
            { pattern: /((?:^|\})\s*)catch\b/, lookbehind: !0 },
            {
                pattern:
                    /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
                lookbehind: !0
            }
        ],
        function: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
        number: {
            pattern: RegExp(
                /(^|[^\w$])/.source +
                    "(?:" +
                    /NaN|Infinity/.source +
                    "|" +
                    /0[bB][01]+(?:_[01]+)*n?/.source +
                    "|" +
                    /0[oO][0-7]+(?:_[0-7]+)*n?/.source +
                    "|" +
                    /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source +
                    "|" +
                    /\d+(?:_\d+)*n/.source +
                    "|" +
                    /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source +
                    ")" +
                    /(?![\w$])/.source
            ),
            lookbehind: !0
        },
        operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
    })),
    (Prism.languages.javascript["class-name"][0].pattern =
        /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/),
    Prism.languages.insertBefore("javascript", "keyword", {
        regex: {
            pattern: RegExp(
                /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source +
                    /\//.source +
                    "(?:" +
                    /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source +
                    "|" +
                    /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/
                        .source +
                    ")" +
                    /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source
            ),
            lookbehind: !0,
            greedy: !0,
            inside: {
                "regex-source": {
                    pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
                    lookbehind: !0,
                    alias: "language-regex",
                    inside: Prism.languages.regex
                },
                "regex-delimiter": /^\/|\/$/,
                "regex-flags": /^[a-z]+$/
            }
        },
        "function-variable": {
            pattern:
                /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
            alias: "function"
        },
        parameter: [
            {
                pattern:
                    /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
                lookbehind: !0,
                inside: Prism.languages.javascript
            },
            {
                pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
                lookbehind: !0,
                inside: Prism.languages.javascript
            },
            {
                pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
                lookbehind: !0,
                inside: Prism.languages.javascript
            },
            {
                pattern:
                    /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
                lookbehind: !0,
                inside: Prism.languages.javascript
            }
        ],
        constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
    }),
    Prism.languages.insertBefore("javascript", "string", {
        hashbang: { pattern: /^#!.*/, greedy: !0, alias: "comment" },
        "template-string": {
            pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
            greedy: !0,
            inside: {
                "template-punctuation": { pattern: /^`|`$/, alias: "string" },
                interpolation: {
                    pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
                    lookbehind: !0,
                    inside: {
                        "interpolation-punctuation": { pattern: /^\$\{|\}$/, alias: "punctuation" },
                        rest: Prism.languages.javascript
                    }
                },
                string: /[\s\S]+/
            }
        },
        "string-property": {
            pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
            lookbehind: !0,
            greedy: !0,
            alias: "property"
        }
    }),
    Prism.languages.insertBefore("javascript", "operator", {
        "literal-property": {
            pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
            lookbehind: !0,
            alias: "property"
        }
    }),
    Prism.languages.markup &&
        (Prism.languages.markup.tag.addInlined("script", "javascript"),
        Prism.languages.markup.tag.addAttribute(
            /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/
                .source,
            "javascript"
        )),
    (Prism.languages.js = Prism.languages.javascript),
    (Prism.languages.scss = Prism.languages.extend("css", {
        comment: { pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/, lookbehind: !0 },
        atrule: { pattern: /@[\w-](?:\([^()]+\)|[^()\s]|\s+(?!\s))*?(?=\s+[{;])/, inside: { rule: /@[\w-]+/ } },
        url: /(?:[-a-z]+-)?url(?=\()/i,
        selector: {
            pattern: /(?=\S)[^@;{}()]?(?:[^@;{}()\s]|\s+(?!\s)|#\{\$[-\w]+\})+(?=\s*\{(?:\}|\s|[^}][^:{}]*[:{][^}]))/,
            inside: {
                parent: { pattern: /&/, alias: "important" },
                placeholder: /%[-\w]+/,
                variable: /\$[-\w]+|#\{\$[-\w]+\}/
            }
        },
        property: {
            pattern: /(?:[-\w]|\$[-\w]|#\{\$[-\w]+\})+(?=\s*:)/,
            inside: { variable: /\$[-\w]+|#\{\$[-\w]+\}/ }
        }
    })),
    Prism.languages.insertBefore("scss", "atrule", {
        keyword: [
            /@(?:content|debug|each|else(?: if)?|extend|for|forward|function|if|import|include|mixin|return|use|warn|while)\b/i,
            { pattern: /( )(?:from|through)(?= )/, lookbehind: !0 }
        ]
    }),
    Prism.languages.insertBefore("scss", "important", { variable: /\$[-\w]+|#\{\$[-\w]+\}/ }),
    Prism.languages.insertBefore("scss", "function", {
        "module-modifier": { pattern: /\b(?:as|hide|show|with)\b/i, alias: "keyword" },
        placeholder: { pattern: /%[-\w]+/, alias: "selector" },
        statement: { pattern: /\B!(?:default|optional)\b/i, alias: "keyword" },
        boolean: /\b(?:false|true)\b/,
        null: { pattern: /\bnull\b/, alias: "keyword" },
        operator: { pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|not|or)(?=\s)/, lookbehind: !0 }
    }),
    (Prism.languages.scss.atrule.inside.rest = Prism.languages.scss),
    (function (e) {
        var t = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
        (e.languages.css = {
            comment: /\/\*[\s\S]*?\*\//,
            atrule: {
                pattern: RegExp(
                    "@[\\w-](?:" + /[^;{\s"']|\s+(?!\s)/.source + "|" + t.source + ")*?" + /(?:;|(?=\s*\{))/.source
                ),
                inside: {
                    rule: /^@[\w-]+/,
                    "selector-function-argument": {
                        pattern:
                            /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
                        lookbehind: !0,
                        alias: "selector"
                    },
                    keyword: { pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/, lookbehind: !0 }
                }
            },
            url: {
                pattern: RegExp("\\burl\\((?:" + t.source + "|" + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ")\\)", "i"),
                greedy: !0,
                inside: {
                    function: /^url/i,
                    punctuation: /^\(|\)$/,
                    string: { pattern: RegExp("^" + t.source + "$"), alias: "url" }
                }
            },
            selector: {
                pattern: RegExp("(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|" + t.source + ")*(?=\\s*\\{)"),
                lookbehind: !0
            },
            string: { pattern: t, greedy: !0 },
            property: {
                pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
                lookbehind: !0
            },
            important: /!important\b/i,
            function: { pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i, lookbehind: !0 },
            punctuation: /[(){};:,]/
        }),
            (e.languages.css.atrule.inside.rest = e.languages.css);
        var a = e.languages.markup;
        a && (a.tag.addInlined("style", "css"), a.tag.addAttribute("style", "css"));
    })(Prism),
    (function (e) {
        var t = /\/\*[\s\S]*?\*\/|\/\/.*|#(?!\[).*/,
            a = [
                { pattern: /\b(?:false|true)\b/i, alias: "boolean" },
                { pattern: /(::\s*)\b[a-z_]\w*\b(?!\s*\()/i, greedy: !0, lookbehind: !0 },
                { pattern: /(\b(?:case|const)\s+)\b[a-z_]\w*(?=\s*[;=])/i, greedy: !0, lookbehind: !0 },
                /\b(?:null)\b/i,
                /\b[A-Z_][A-Z0-9_]*\b(?!\s*\()/
            ],
            n =
                /\b0b[01]+(?:_[01]+)*\b|\b0o[0-7]+(?:_[0-7]+)*\b|\b0x[\da-f]+(?:_[\da-f]+)*\b|(?:\b\d+(?:_\d+)*\.?(?:\d+(?:_\d+)*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
            s = /<?=>|\?\?=?|\.{3}|\??->|[!=]=?=?|::|\*\*=?|--|\+\+|&&|\|\||<<|>>|[?~]|[/^|%*&<>.+-]=?/,
            r = /[{}\[\](),:;]/;
        e.languages.php = {
            delimiter: { pattern: /\?>$|^<\?(?:php(?=\s)|=)?/i, alias: "important" },
            comment: t,
            variable: /\$+(?:\w+\b|(?=\{))/,
            package: {
                pattern: /(namespace\s+|use\s+(?:function\s+)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
                lookbehind: !0,
                inside: { punctuation: /\\/ }
            },
            "class-name-definition": {
                pattern: /(\b(?:class|enum|interface|trait)\s+)\b[a-z_]\w*(?!\\)\b/i,
                lookbehind: !0,
                alias: "class-name"
            },
            "function-definition": { pattern: /(\bfunction\s+)[a-z_]\w*(?=\s*\()/i, lookbehind: !0, alias: "function" },
            keyword: [
                {
                    pattern: /(\(\s*)\b(?:array|bool|boolean|float|int|integer|object|string)\b(?=\s*\))/i,
                    alias: "type-casting",
                    greedy: !0,
                    lookbehind: !0
                },
                {
                    pattern:
                        /([(,?]\s*)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|object|self|static|string)\b(?=\s*\$)/i,
                    alias: "type-hint",
                    greedy: !0,
                    lookbehind: !0
                },
                {
                    pattern:
                        /(\)\s*:\s*(?:\?\s*)?)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|never|object|self|static|string|void)\b/i,
                    alias: "return-type",
                    greedy: !0,
                    lookbehind: !0
                },
                {
                    pattern: /\b(?:array(?!\s*\()|bool|float|int|iterable|mixed|object|string|void)\b/i,
                    alias: "type-declaration",
                    greedy: !0
                },
                {
                    pattern: /(\|\s*)(?:false|null)\b|\b(?:false|null)(?=\s*\|)/i,
                    alias: "type-declaration",
                    greedy: !0,
                    lookbehind: !0
                },
                { pattern: /\b(?:parent|self|static)(?=\s*::)/i, alias: "static-context", greedy: !0 },
                { pattern: /(\byield\s+)from\b/i, lookbehind: !0 },
                /\bclass\b/i,
                {
                    pattern:
                        /((?:^|[^\s>:]|(?:^|[^-])>|(?:^|[^:]):)\s*)\b(?:abstract|and|array|as|break|callable|case|catch|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|enum|eval|exit|extends|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|match|namespace|never|new|or|parent|print|private|protected|public|readonly|require|require_once|return|self|static|switch|throw|trait|try|unset|use|var|while|xor|yield|__halt_compiler)\b/i,
                    lookbehind: !0
                }
            ],
            "argument-name": { pattern: /([(,]\s*)\b[a-z_]\w*(?=\s*:(?!:))/i, lookbehind: !0 },
            "class-name": [
                {
                    pattern:
                        /(\b(?:extends|implements|instanceof|new(?!\s+self|\s+static))\s+|\bcatch\s*\()\b[a-z_]\w*(?!\\)\b/i,
                    greedy: !0,
                    lookbehind: !0
                },
                { pattern: /(\|\s*)\b[a-z_]\w*(?!\\)\b/i, greedy: !0, lookbehind: !0 },
                { pattern: /\b[a-z_]\w*(?!\\)\b(?=\s*\|)/i, greedy: !0 },
                {
                    pattern: /(\|\s*)(?:\\?\b[a-z_]\w*)+\b/i,
                    alias: "class-name-fully-qualified",
                    greedy: !0,
                    lookbehind: !0,
                    inside: { punctuation: /\\/ }
                },
                {
                    pattern: /(?:\\?\b[a-z_]\w*)+\b(?=\s*\|)/i,
                    alias: "class-name-fully-qualified",
                    greedy: !0,
                    inside: { punctuation: /\\/ }
                },
                {
                    pattern:
                        /(\b(?:extends|implements|instanceof|new(?!\s+self\b|\s+static\b))\s+|\bcatch\s*\()(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
                    alias: "class-name-fully-qualified",
                    greedy: !0,
                    lookbehind: !0,
                    inside: { punctuation: /\\/ }
                },
                { pattern: /\b[a-z_]\w*(?=\s*\$)/i, alias: "type-declaration", greedy: !0 },
                {
                    pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
                    alias: ["class-name-fully-qualified", "type-declaration"],
                    greedy: !0,
                    inside: { punctuation: /\\/ }
                },
                { pattern: /\b[a-z_]\w*(?=\s*::)/i, alias: "static-context", greedy: !0 },
                {
                    pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*::)/i,
                    alias: ["class-name-fully-qualified", "static-context"],
                    greedy: !0,
                    inside: { punctuation: /\\/ }
                },
                { pattern: /([(,?]\s*)[a-z_]\w*(?=\s*\$)/i, alias: "type-hint", greedy: !0, lookbehind: !0 },
                {
                    pattern: /([(,?]\s*)(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
                    alias: ["class-name-fully-qualified", "type-hint"],
                    greedy: !0,
                    lookbehind: !0,
                    inside: { punctuation: /\\/ }
                },
                {
                    pattern: /(\)\s*:\s*(?:\?\s*)?)\b[a-z_]\w*(?!\\)\b/i,
                    alias: "return-type",
                    greedy: !0,
                    lookbehind: !0
                },
                {
                    pattern: /(\)\s*:\s*(?:\?\s*)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
                    alias: ["class-name-fully-qualified", "return-type"],
                    greedy: !0,
                    lookbehind: !0,
                    inside: { punctuation: /\\/ }
                }
            ],
            constant: a,
            function: {
                pattern: /(^|[^\\\w])\\?[a-z_](?:[\w\\]*\w)?(?=\s*\()/i,
                lookbehind: !0,
                inside: { punctuation: /\\/ }
            },
            property: { pattern: /(->\s*)\w+/, lookbehind: !0 },
            number: n,
            operator: s,
            punctuation: r
        };
        var i = {
                pattern: /\{\$(?:\{(?:\{[^{}]+\}|[^{}]+)\}|[^{}])+\}|(^|[^\\{])\$+(?:\w+(?:\[[^\r\n\[\]]+\]|->\w+)?)/,
                lookbehind: !0,
                inside: e.languages.php
            },
            o = [
                {
                    pattern: /<<<'([^']+)'[\r\n](?:.*[\r\n])*?\1;/,
                    alias: "nowdoc-string",
                    greedy: !0,
                    inside: {
                        delimiter: {
                            pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
                            alias: "symbol",
                            inside: { punctuation: /^<<<'?|[';]$/ }
                        }
                    }
                },
                {
                    pattern: /<<<(?:"([^"]+)"[\r\n](?:.*[\r\n])*?\1;|([a-z_]\w*)[\r\n](?:.*[\r\n])*?\2;)/i,
                    alias: "heredoc-string",
                    greedy: !0,
                    inside: {
                        delimiter: {
                            pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
                            alias: "symbol",
                            inside: { punctuation: /^<<<"?|[";]$/ }
                        },
                        interpolation: i
                    }
                },
                { pattern: /`(?:\\[\s\S]|[^\\`])*`/, alias: "backtick-quoted-string", greedy: !0 },
                { pattern: /'(?:\\[\s\S]|[^\\'])*'/, alias: "single-quoted-string", greedy: !0 },
                {
                    pattern: /"(?:\\[\s\S]|[^\\"])*"/,
                    alias: "double-quoted-string",
                    greedy: !0,
                    inside: { interpolation: i }
                }
            ];
        e.languages.insertBefore("php", "variable", {
            string: o,
            attribute: {
                pattern:
                    /#\[(?:[^"'\/#]|\/(?![*/])|\/\/.*$|#(?!\[).*$|\/\*(?:[^*]|\*(?!\/))*\*\/|"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*')+\](?=\s*[a-z$#])/im,
                greedy: !0,
                inside: {
                    "attribute-content": {
                        pattern: /^(#\[)[\s\S]+(?=\]$)/,
                        lookbehind: !0,
                        inside: {
                            comment: t,
                            string: o,
                            "attribute-class-name": [
                                {
                                    pattern: /([^:]|^)\b[a-z_]\w*(?!\\)\b/i,
                                    alias: "class-name",
                                    greedy: !0,
                                    lookbehind: !0
                                },
                                {
                                    pattern: /([^:]|^)(?:\\?\b[a-z_]\w*)+/i,
                                    alias: ["class-name", "class-name-fully-qualified"],
                                    greedy: !0,
                                    lookbehind: !0,
                                    inside: { punctuation: /\\/ }
                                }
                            ],
                            constant: a,
                            number: n,
                            operator: s,
                            punctuation: r
                        }
                    },
                    delimiter: { pattern: /^#\[|\]$/, alias: "punctuation" }
                }
            }
        }),
            e.hooks.add("before-tokenize", function (t) {
                if (/<\?/.test(t.code)) {
                    e.languages["markup-templating"].buildPlaceholders(
                        t,
                        "php",
                        /<\?(?:[^"'/#]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|(?:\/\/|#(?!\[))(?:[^?\n\r]|\?(?!>))*(?=$|\?>|[\r\n])|#\[|\/\*(?:[^*]|\*(?!\/))*(?:\*\/|$))*?(?:\?>|$)/g
                    );
                }
            }),
            e.hooks.add("after-tokenize", function (t) {
                e.languages["markup-templating"].tokenizePlaceholders(t, "php");
            });
    })(Prism),
    Prism.languages.insertBefore("php", "variable", {
        this: { pattern: /\$this\b/, alias: "keyword" },
        global: /\$(?:GLOBALS|HTTP_RAW_POST_DATA|_(?:COOKIE|ENV|FILES|GET|POST|REQUEST|SERVER|SESSION)|argc|argv|http_response_header|php_errormsg)\b/,
        scope: { pattern: /\b[\w\\]+::/, inside: { keyword: /\b(?:parent|self|static)\b/, punctuation: /::|\\/ } }
    }),
    (Prism.languages.python = {
        comment: { pattern: /(^|[^\\])#.*/, lookbehind: !0, greedy: !0 },
        "string-interpolation": {
            pattern: /(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
            greedy: !0,
            inside: {
                interpolation: {
                    pattern: /((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,
                    lookbehind: !0,
                    inside: {
                        "format-spec": { pattern: /(:)[^:(){}]+(?=\}$)/, lookbehind: !0 },
                        "conversion-option": { pattern: /![sra](?=[:}]$)/, alias: "punctuation" },
                        rest: null
                    }
                },
                string: /[\s\S]+/
            }
        },
        "triple-quoted-string": { pattern: /(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i, greedy: !0, alias: "string" },
        string: { pattern: /(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i, greedy: !0 },
        function: { pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g, lookbehind: !0 },
        "class-name": { pattern: /(\bclass\s+)\w+/i, lookbehind: !0 },
        decorator: {
            pattern: /(^[\t ]*)@\w+(?:\.\w+)*/m,
            lookbehind: !0,
            alias: ["annotation", "punctuation"],
            inside: { punctuation: /\./ }
        },
        keyword:
            /\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
        builtin:
            /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
        boolean: /\b(?:False|None|True)\b/,
        number: /\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,
        operator: /[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
        punctuation: /[{}[\];(),.:]/
    }),
    (Prism.languages.python["string-interpolation"].inside.interpolation.inside.rest = Prism.languages.python),
    (Prism.languages.py = Prism.languages.python),
    (Prism.languages.aspnet = Prism.languages.extend("markup", {
        "page-directive": {
            pattern: /<%\s*@.*%>/,
            alias: "tag",
            inside: {
                "page-directive": {
                    pattern:
                        /<%\s*@\s*(?:Assembly|Control|Implements|Import|Master(?:Type)?|OutputCache|Page|PreviousPageType|Reference|Register)?|%>/i,
                    alias: "tag"
                },
                rest: Prism.languages.markup.tag.inside
            }
        },
        directive: {
            pattern: /<%.*%>/,
            alias: "tag",
            inside: { directive: { pattern: /<%\s*?[$=%#:]{0,2}|%>/, alias: "tag" }, rest: Prism.languages.csharp }
        }
    })),
    (Prism.languages.aspnet.tag.pattern =
        /<(?!%)\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/),
    Prism.languages.insertBefore(
        "inside",
        "punctuation",
        { directive: Prism.languages.aspnet.directive },
        Prism.languages.aspnet.tag.inside["attr-value"]
    ),
    Prism.languages.insertBefore("aspnet", "comment", {
        "asp-comment": { pattern: /<%--[\s\S]*?--%>/, alias: ["asp", "comment"] }
    }),
    Prism.languages.insertBefore("aspnet", Prism.languages.javascript ? "script" : "tag", {
        "asp-script": {
            pattern: /(<script(?=.*runat=['"]?server\b)[^>]*>)[\s\S]*?(?=<\/script>)/i,
            lookbehind: !0,
            alias: ["asp", "script"],
            inside: Prism.languages.csharp || {}
        }
    }),
    (function () {
        if (void 0 !== Prism) {
            var e =
                    Object.assign ||
                    function (e, t) {
                        for (var a in t) t.hasOwnProperty(a) && (e[a] = t[a]);
                        return e;
                    },
                t = {
                    "remove-trailing": "boolean",
                    "remove-indent": "boolean",
                    "left-trim": "boolean",
                    "right-trim": "boolean",
                    "break-lines": "number",
                    indent: "number",
                    "remove-initial-line-feed": "boolean",
                    "tabs-to-spaces": "number",
                    "spaces-to-tabs": "number"
                };
            (a.prototype = {
                setDefaults: function (t) {
                    this.defaults = e(this.defaults, t);
                },
                normalize: function (t, a) {
                    for (var n in (a = e(this.defaults, a))) {
                        var s = n?.replace(/-(\w)/g, function (e, t) {
                            return t.toUpperCase();
                        });
                        "normalize" !== n &&
                            "setDefaults" !== s &&
                            a[n] &&
                            this[s] &&
                            (t = this[s].call(this, t, a[n]));
                    }
                    return t;
                },
                leftTrim: function (e) {
                    return e?.replace(/^\s+/, "");
                },
                rightTrim: function (e) {
                    return e?.replace(/\s+$/, "");
                },
                tabsToSpaces: function (e, t) {
                    return (t = 0 | t || 4), e?.replace(/\t/g, new Array(++t).join(" "));
                },
                spacesToTabs: function (e, t) {
                    return (t = 0 | t || 4), e?.replace(RegExp(" {" + t + "}", "g"), "\t");
                },
                removeTrailing: function (e) {
                    return e?.replace(/\s*?$/gm, "");
                },
                removeInitialLineFeed: function (e) {
                    return e?.replace(/^(?:\r?\n|\r)/, "");
                },
                removeIndent: function (e) {
                    var t = e.match(/^[^\S\n\r]*(?=\S)/gm);
                    return t && t[0].length
                        ? (t.sort(function (e, t) {
                              return e.length - t.length;
                          }),
                          t[0].length ? e?.replace(RegExp("^" + t[0], "gm"), "") : e)
                        : e;
                },
                indent: function (e, t) {
                    return e?.replace(/^[^\S\n\r]*(?=\S)/gm, new Array(++t).join("\t") + "$&");
                },
                breakLines: function (e, t) {
                    t = !0 === t ? 80 : 0 | t || 80;
                    for (var a = e.split("\n"), s = 0; s < a.length; ++s)
                        if (!(n(a[s]) <= t)) {
                            for (var r = a[s].split(/(\s+)/g), i = 0, o = 0; o < r.length; ++o) {
                                var l = n(r[o]);
                                (i += l) > t && ((r[o] = "\n" + r[o]), (i = l));
                            }
                            a[s] = r.join("");
                        }
                    return a.join("\n");
                }
            }),
                "undefined" != typeof module && module.exports && (module.exports = a),
                (Prism.plugins.NormalizeWhitespace = new a({
                    "remove-trailing": !0,
                    "remove-indent": !0,
                    "left-trim": !0,
                    "right-trim": !0
                })),
                Prism.hooks.add("before-sanity-check", function (e) {
                    var a = Prism.plugins.NormalizeWhitespace;
                    if (
                        (!e.settings || !1 !== e.settings["whitespace-normalization"]) &&
                        Prism.util.isActive(e.element, "whitespace-normalization", !0)
                    )
                        if ((e.element && e.element.parentNode) || !e.code) {
                            var n = e.element.parentNode;
                            if (e.code && n && "pre" === n.nodeName.toLowerCase()) {
                                for (var s in (null == e.settings && (e.settings = {}), t))
                                    if (Object.hasOwnProperty.call(t, s)) {
                                        var r = t[s];
                                        if (n.hasAttribute("data-" + s))
                                            try {
                                                var i = JSON.parse(n.getAttribute("data-" + s) || "true");
                                                typeof i === r && (e.settings[s] = i);
                                            } catch (e) {}
                                    }
                                for (var o = n.childNodes, l = "", u = "", c = !1, d = 0; d < o.length; ++d) {
                                    var p = o[d];
                                    p == e.element
                                        ? (c = !0)
                                        : "#text" === p.nodeName &&
                                          (c ? (u += p.nodeValue) : (l += p.nodeValue), n.removeChild(p), --d);
                                }
                                if (e.element.children.length && Prism.plugins.KeepMarkup) {
                                    var g = l + e.element.innerHTML + u;
                                    (e.element.innerHTML = a.normalize(g, e.settings)),
                                        (e.code = e.element.textContent);
                                } else (e.code = l + e.code + u), (e.code = a.normalize(e.code, e.settings));
                            }
                        } else e.code = a.normalize(e.code, e.settings);
                });
        }
        function a(t) {
            this.defaults = e({}, t);
        }
        function n(e) {
            for (var t = 0, a = 0; a < e.length; ++a) e.charCodeAt(a) == "\t".charCodeAt(0) && (t += 3);
            return e.length + t;
        }
    })(),
    Prism.plugins.NormalizeWhitespace.setDefaults({
        "remove-trailing": !0,
        "remove-indent": !0,
        "left-trim": !0,
        "right-trim": !0
    });
