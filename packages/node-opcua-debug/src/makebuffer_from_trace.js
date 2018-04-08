"use strict";

const deprecated_trim = function (str) {
    return str.replace(/^\s+|\s+$/g, "");
};

function inlineText(f) {

    let k = f.toString().
        replace(/^[^\/]+\/\*!?/, '').
        replace(/\*\/[^\/]+$/, '');
    k = k.split("\n").map(function(t){  t = t.trim(); return t; }).join("\n");
    return k;
}
const makeBuffer = require("node-opcua-buffer-utils").makeBuffer;

const hexString = function (str) {

    let hexline = "";
    const lines = str.split("\n");
    lines.forEach(function (line) {

        line = line.trim();
        if (line.length > 80) {
            line = line.substr(10, 98).trim();
            hexline = hexline ? hexline + " " + line : line;
        } else if (line.length > 60) {
            line = line.substr(7, 48).trim();
            hexline = hexline ? hexline + " " + line : line;
        }
    });
    return hexline;
};

function makebuffer_from_trace(func) {
    return makeBuffer(hexString(inlineText(func)));
}
exports.inlineText = inlineText;
exports.makebuffer_from_trace = makebuffer_from_trace;
