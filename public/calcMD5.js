/*!
 * calcMD5 - Md5 encryption for Javascript.
 */
var hex_chr = "0123456789abcdef";
function rhex(i) {
    for (str = "", j = 0; j <= 3; j++)str += hex_chr.charAt(i >> 8 * j + 4 & 15) + hex_chr.charAt(i >> 8 * j & 15);
    return str
}
function str2blks_MD5(d) {
    for (nblk = 1 + (d.length + 8 >> 6), blks = new Array(16 * nblk), i = 0; i < 16 * nblk; i++)blks[i] = 0;
    for (i = 0; i < d.length; i++)blks[i >> 2] |= d.charCodeAt(i) << i % 4 * 8;
    return blks[i >> 2] |= 128 << i % 4 * 8, blks[16 * nblk - 2] = 8 * d.length, blks
}
function add(i, d) {
    var c = (65535 & i) + (65535 & d);
    return (i >> 16) + (d >> 16) + (c >> 16) << 16 | 65535 & c
}
function rol(i, d) {
    return i << d | i >>> 32 - d
}
function cmn(i, d, c, a, b, x) {
    return add(rol(add(add(d, i), add(a, x)), b), c)
}
function ff(i, d, c, a, b, x, h) {
    return cmn(d & c | ~d & a, i, d, b, x, h)
}
function gg(i, d, c, a, b, x, h) {
    return cmn(d & a | c & ~a, i, d, b, x, h)
}
function hh(i, d, c, a, b, x, h) {
    return cmn(d ^ c ^ a, i, d, b, x, h)
}
function ii(i, d, c, a, b, x, h) {
    return cmn(c ^ (d | ~a), i, d, b, x, h)
}
function calcMD5(h) {
    for (x = str2blks_MD5(h), a = 1732584193, b = -271733879, c = -1732584194, d = 271733878, i = 0; i < x.length; i += 16)olda = a, oldb = b, oldc = c, oldd = d, a = ff(a, b, c, d, x[i + 0], 7, -680876936), d = ff(d, a, b, c, x[i + 1], 12, -389564586), c = ff(c, d, a, b, x[i + 2], 17, 606105819), b = ff(b, c, d, a, x[i + 3], 22, -1044525330), a = ff(a, b, c, d, x[i + 4], 7, -176418897), d = ff(d, a, b, c, x[i + 5], 12, 1200080426), c = ff(c, d, a, b, x[i + 6], 17, -1473231341), b = ff(b, c, d, a, x[i + 7], 22, -45705983), a = ff(a, b, c, d, x[i + 8], 7, 1770035416), d = ff(d, a, b, c, x[i + 9], 12, -1958414417), c = ff(c, d, a, b, x[i + 10], 17, -42063), b = ff(b, c, d, a, x[i + 11], 22, -1990404162), a = ff(a, b, c, d, x[i + 12], 7, 1804603682), d = ff(d, a, b, c, x[i + 13], 12, -40341101), c = ff(c, d, a, b, x[i + 14], 17, -1502002290), b = ff(b, c, d, a, x[i + 15], 22, 1236535329), a = gg(a, b, c, d, x[i + 1], 5, -165796510), d = gg(d, a, b, c, x[i + 6], 9, -1069501632), c = gg(c, d, a, b, x[i + 11], 14, 643717713), b = gg(b, c, d, a, x[i + 0], 20, -373897302), a = gg(a, b, c, d, x[i + 5], 5, -701558691), d = gg(d, a, b, c, x[i + 10], 9, 38016083), c = gg(c, d, a, b, x[i + 15], 14, -660478335), b = gg(b, c, d, a, x[i + 4], 20, -405537848), a = gg(a, b, c, d, x[i + 9], 5, 568446438), d = gg(d, a, b, c, x[i + 14], 9, -1019803690), c = gg(c, d, a, b, x[i + 3], 14, -187363961), b = gg(b, c, d, a, x[i + 8], 20, 1163531501), a = gg(a, b, c, d, x[i + 13], 5, -1444681467), d = gg(d, a, b, c, x[i + 2], 9, -51403784), c = gg(c, d, a, b, x[i + 7], 14, 1735328473), b = gg(b, c, d, a, x[i + 12], 20, -1926607734), a = hh(a, b, c, d, x[i + 5], 4, -378558), d = hh(d, a, b, c, x[i + 8], 11, -2022574463), c = hh(c, d, a, b, x[i + 11], 16, 1839030562), b = hh(b, c, d, a, x[i + 14], 23, -35309556), a = hh(a, b, c, d, x[i + 1], 4, -1530992060), d = hh(d, a, b, c, x[i + 4], 11, 1272893353), c = hh(c, d, a, b, x[i + 7], 16, -155497632), b = hh(b, c, d, a, x[i + 10], 23, -1094730640), a = hh(a, b, c, d, x[i + 13], 4, 681279174), d = hh(d, a, b, c, x[i + 0], 11, -358537222), c = hh(c, d, a, b, x[i + 3], 16, -722521979), b = hh(b, c, d, a, x[i + 6], 23, 76029189), a = hh(a, b, c, d, x[i + 9], 4, -640364487), d = hh(d, a, b, c, x[i + 12], 11, -421815835), c = hh(c, d, a, b, x[i + 15], 16, 530742520), b = hh(b, c, d, a, x[i + 2], 23, -995338651), a = ii(a, b, c, d, x[i + 0], 6, -198630844), d = ii(d, a, b, c, x[i + 7], 10, 1126891415), c = ii(c, d, a, b, x[i + 14], 15, -1416354905), b = ii(b, c, d, a, x[i + 5], 21, -57434055), a = ii(a, b, c, d, x[i + 12], 6, 1700485571), d = ii(d, a, b, c, x[i + 3], 10, -1894986606), c = ii(c, d, a, b, x[i + 10], 15, -1051523), b = ii(b, c, d, a, x[i + 1], 21, -2054922799), a = ii(a, b, c, d, x[i + 8], 6, 1873313359), d = ii(d, a, b, c, x[i + 15], 10, -30611744), c = ii(c, d, a, b, x[i + 6], 15, -1560198380), b = ii(b, c, d, a, x[i + 13], 21, 1309151649), a = ii(a, b, c, d, x[i + 4], 6, -145523070), d = ii(d, a, b, c, x[i + 11], 10, -1120210379), c = ii(c, d, a, b, x[i + 2], 15, 718787259), b = ii(b, c, d, a, x[i + 9], 21, -343485551), a = add(a, olda), b = add(b, oldb), c = add(c, oldc), d = add(d, oldd);
    return rhex(a) + rhex(b) + rhex(c) + rhex(d)
}