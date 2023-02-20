var r = 0;

function n(r) {
    return e(t(o(r)));
}

function t(r) {
    return f(a(u(r), 8 * r.length));
}

function e(n) {
    for (var t, e = r ? "0123456789ABCDEF" : "0123456789abcdef", o = "", u = 0; u < n.length; u++) t = n.charCodeAt(u), 
    o += e.charAt(t >>> 4 & 15) + e.charAt(15 & t);
    return o;
}

function o(r) {
    for (var n, t, e = "", o = -1; ++o < r.length; ) n = r.charCodeAt(o), t = o + 1 < r.length ? r.charCodeAt(o + 1) : 0, 
    55296 <= n && n <= 56319 && 56320 <= t && t <= 57343 && (n = 65536 + ((1023 & n) << 10) + (1023 & t), 
    o++), n <= 127 ? e += String.fromCharCode(n) : n <= 2047 ? e += String.fromCharCode(192 | n >>> 6 & 31, 128 | 63 & n) : n <= 65535 ? e += String.fromCharCode(224 | n >>> 12 & 15, 128 | n >>> 6 & 63, 128 | 63 & n) : n <= 2097151 && (e += String.fromCharCode(240 | n >>> 18 & 7, 128 | n >>> 12 & 63, 128 | n >>> 6 & 63, 128 | 63 & n));
    return e;
}

function u(r) {
    for (var n = Array(r.length >> 2), t = 0; t < n.length; t++) n[t] = 0;
    for (t = 0; t < 8 * r.length; t += 8) n[t >> 5] |= (255 & r.charCodeAt(t / 8)) << t % 32;
    return n;
}

function f(r) {
    for (var n = "", t = 0; t < 32 * r.length; t += 8) n += String.fromCharCode(r[t >> 5] >>> t % 32 & 255);
    return n;
}

function a(r, n) {
    r[n >> 5] |= 128 << n % 32, r[14 + (n + 64 >>> 9 << 4)] = n;
    for (var t = 1732584193, e = -271733879, o = -1732584194, u = 271733878, f = 0; f < r.length; f += 16) {
        var a = t, c = e, l = o, v = u;
        t = i(t, e, o, u, r[f + 0], 7, -680876936), u = i(u, t, e, o, r[f + 1], 12, -389564586), 
        o = i(o, u, t, e, r[f + 2], 17, 606105819), e = i(e, o, u, t, r[f + 3], 22, -1044525330), 
        t = i(t, e, o, u, r[f + 4], 7, -176418897), u = i(u, t, e, o, r[f + 5], 12, 1200080426), 
        o = i(o, u, t, e, r[f + 6], 17, -1473231341), e = i(e, o, u, t, r[f + 7], 22, -45705983), 
        t = i(t, e, o, u, r[f + 8], 7, 1770035416), u = i(u, t, e, o, r[f + 9], 12, -1958414417), 
        o = i(o, u, t, e, r[f + 10], 17, -42063), e = i(e, o, u, t, r[f + 11], 22, -1990404162), 
        t = i(t, e, o, u, r[f + 12], 7, 1804603682), u = i(u, t, e, o, r[f + 13], 12, -40341101), 
        o = i(o, u, t, e, r[f + 14], 17, -1502002290), t = h(t, e = i(e, o, u, t, r[f + 15], 22, 1236535329), o, u, r[f + 1], 5, -165796510), 
        u = h(u, t, e, o, r[f + 6], 9, -1069501632), o = h(o, u, t, e, r[f + 11], 14, 643717713), 
        e = h(e, o, u, t, r[f + 0], 20, -373897302), t = h(t, e, o, u, r[f + 5], 5, -701558691), 
        u = h(u, t, e, o, r[f + 10], 9, 38016083), o = h(o, u, t, e, r[f + 15], 14, -660478335), 
        e = h(e, o, u, t, r[f + 4], 20, -405537848), t = h(t, e, o, u, r[f + 9], 5, 568446438), 
        u = h(u, t, e, o, r[f + 14], 9, -1019803690), o = h(o, u, t, e, r[f + 3], 14, -187363961), 
        e = h(e, o, u, t, r[f + 8], 20, 1163531501), t = h(t, e, o, u, r[f + 13], 5, -1444681467), 
        u = h(u, t, e, o, r[f + 2], 9, -51403784), o = h(o, u, t, e, r[f + 7], 14, 1735328473), 
        t = g(t, e = h(e, o, u, t, r[f + 12], 20, -1926607734), o, u, r[f + 5], 4, -378558), 
        u = g(u, t, e, o, r[f + 8], 11, -2022574463), o = g(o, u, t, e, r[f + 11], 16, 1839030562), 
        e = g(e, o, u, t, r[f + 14], 23, -35309556), t = g(t, e, o, u, r[f + 1], 4, -1530992060), 
        u = g(u, t, e, o, r[f + 4], 11, 1272893353), o = g(o, u, t, e, r[f + 7], 16, -155497632), 
        e = g(e, o, u, t, r[f + 10], 23, -1094730640), t = g(t, e, o, u, r[f + 13], 4, 681279174), 
        u = g(u, t, e, o, r[f + 0], 11, -358537222), o = g(o, u, t, e, r[f + 3], 16, -722521979), 
        e = g(e, o, u, t, r[f + 6], 23, 76029189), t = g(t, e, o, u, r[f + 9], 4, -640364487), 
        u = g(u, t, e, o, r[f + 12], 11, -421815835), o = g(o, u, t, e, r[f + 15], 16, 530742520), 
        t = C(t, e = g(e, o, u, t, r[f + 2], 23, -995338651), o, u, r[f + 0], 6, -198630844), 
        u = C(u, t, e, o, r[f + 7], 10, 1126891415), o = C(o, u, t, e, r[f + 14], 15, -1416354905), 
        e = C(e, o, u, t, r[f + 5], 21, -57434055), t = C(t, e, o, u, r[f + 12], 6, 1700485571), 
        u = C(u, t, e, o, r[f + 3], 10, -1894986606), o = C(o, u, t, e, r[f + 10], 15, -1051523), 
        e = C(e, o, u, t, r[f + 1], 21, -2054922799), t = C(t, e, o, u, r[f + 8], 6, 1873313359), 
        u = C(u, t, e, o, r[f + 15], 10, -30611744), o = C(o, u, t, e, r[f + 6], 15, -1560198380), 
        e = C(e, o, u, t, r[f + 13], 21, 1309151649), t = C(t, e, o, u, r[f + 4], 6, -145523070), 
        u = C(u, t, e, o, r[f + 11], 10, -1120210379), o = C(o, u, t, e, r[f + 2], 15, 718787259), 
        e = C(e, o, u, t, r[f + 9], 21, -343485551), t = d(t, a), e = d(e, c), o = d(o, l), 
        u = d(u, v);
    }
    return Array(t, e, o, u);
}

function c(r, n, t, e, o, u) {
    return d((f = d(d(n, r), d(e, u))) << (a = o) | f >>> 32 - a, t);
    var f, a;
}

function i(r, n, t, e, o, u, f) {
    return c(n & t | ~n & e, r, n, o, u, f);
}

function h(r, n, t, e, o, u, f) {
    return c(n & e | t & ~e, r, n, o, u, f);
}

function g(r, n, t, e, o, u, f) {
    return c(n ^ t ^ e, r, n, o, u, f);
}

function C(r, n, t, e, o, u, f) {
    return c(t ^ (n | ~e), r, n, o, u, f);
}

function d(r, n) {
    var t = (65535 & r) + (65535 & n);
    return (r >> 16) + (n >> 16) + (t >> 16) << 16 | 65535 & t;
}

module.exports.hex_md5 = n, module.exports.create_sign = function(r, t) {
    var e = [], o = Object.keys(r).sort();
    for (var u in o) "sign" != o[u] && "format" != o[u] && e.push(o[u] + "=" + r[o[u]]);
    return n(e.join("&") + "&" + t);
};