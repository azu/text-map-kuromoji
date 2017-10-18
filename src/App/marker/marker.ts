// LICENSE : MIT
"use strict";
const kuromojin = require("kuromojin");
export default class Marker {
    createMarks(code) {
        return kuromojin.tokenize(code);
    }
}