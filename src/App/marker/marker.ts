// LICENSE : MIT
"use strict";
import { Token } from "./Token";

const getTokenizer = require("kuromojin").getTokenizer;
export default class Marker {
    createMarks(code: string): Promise<Token[]> {
        return getTokenizer({
            dicPath: process.env.PUBLIC_URL + "/dict"
        }).then((tokenizer: any) => {
            return tokenizer.tokenize(code);
        });
    }
}