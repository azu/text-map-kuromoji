// LICENSE : MIT
"use strict";
import * as  CodeMirror from "codemirror";
import { Token } from "../marker/Token";

const StructuredSource = require('structured-source');

// dependency css
require("codemirror/lib/codemirror.css");
require("codemirror/addon/lint/lint.css");
require("codemirror/addon/mode/overlay.js");
require("codemirror/mode/markdown/markdown.js");
require("codemirror/mode/css/css.js");

const defaultText = `最初に辞書を読み込むためロード時間がかかります。

テキストを形態素解析した結果を右側のテーブルに表示します。

テキストを選択するとそのTokenの詳細情報を表示します。`;

export default class Editor {
    private editor: CodeMirror.EditorFromTextArea;
    private selector: string;
    private tokens: Array<Token>;
    private currentCmMarks: Array<any>;
    private source: any;
    private highlightText: any;
    private selectMark: (arg: any) => void;

    constructor({ selector, selectMark }: { selector: string, selectMark: (arg: any) => void }) {
        this.selector = selector;
        this.tokens = [];
        this.currentCmMarks = [];
        this.selectMark = selectMark;
    }

    edit() {
        const textAreaElement = document.getElementById("js-editor") as HTMLTextAreaElement;
        this.editor = CodeMirror.fromTextArea(textAreaElement, {
            lineNumbers: true,
            lineWrapping: true,
            mode: "markdown"
        });
        this.editor.on("cursorActivity", (cm: any) => {
            const pos = cm.getCursor();
            const cmMarks = cm.findMarksAt(pos);
            console.log(cmMarks);
            if (cmMarks.length === 0) {
                return;
            }
            // insert order by line,column
            // pick up last is nearest
            const nearestCmMark = cmMarks.pop();
            this.selectMark(this.getMarkWithCmMark(nearestCmMark));
        });
        this.editor.setValue(defaultText);
        return this;
    }

    getMarkWithCmMark(cmMark: any) {
        const matchCmMarks = this.currentCmMarks.filter(targetMark => {
            return targetMark.id === cmMark.id;
        });
        if (matchCmMarks.length === 0) {
            return;
        }
        const matchCmMark = matchCmMarks[0];
        return this.tokens[this.currentCmMarks.indexOf(matchCmMark)];
    }

    /**
     * @returns {string}
     */
    getText(): string {
        return this.editor.getValue();
    }

    getLocFromToken(token: Token): { start: { line: number, column: number }, end: { line: number, column: number } } {
        const startIndex = token.word_position - 1;
        const endIndex = startIndex + token.surface_form.length;
        const start = this.source.indexToPosition(startIndex);
        const end = this.source.indexToPosition(endIndex);
        return {
            start,
            end
        }
    }

    updateMarker(tokens: Array<Token>) {
        this.tokens = tokens;
        this.clearMarkers();
        this.source = new StructuredSource(this.getText());
        this.currentCmMarks = tokens.map(token => {
            const { start, end } = this.getLocFromToken(token);
            console.log(start, end);
            return (this.editor as any).markText(
                { line: start.line - 1, ch: start.column },
                { line: end.line - 1, ch: end.column }
            );
        })
    }

    highlightMark(token: Token) {
        if (!token) {
            return;
        }
        const { start, end } = this.getLocFromToken(token);
        if (this.highlightText) {
            this.highlightText.clear();
        }
        console.log({ start, end });
        this.highlightText = (this.editor as any).markText(
            { line: start.line - 1, ch: start.column },
            { line: end.line - 1, ch: end.column },
            {
                title: token.surface_form,
                className: "highlight",
            }
        );
    }

    clearMarkers() {
        this.currentCmMarks.forEach(mark => {
            mark.clear();
        });
    }

    onChange(changeHandler: () => void) {
        this.editor.on("change", changeHandler);
    }
}
