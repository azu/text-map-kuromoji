// LICENSE : MIT
"use strict";
import { Token } from "../marker/Token";

const yo = require('yo-yo');
export default class Editor {
    private selector: string;
    private selectedMark: Token;
    private el: HTMLElement;
    private onClickNode: (token: Token) => void;

    constructor({ selector, onClickNode }: { selector: string, onClickNode: (token: Token) => void }) {
        this.selector = selector;
        this.el = this.render([]);
        this.onClickNode = onClickNode;
        let target = document.querySelector(selector);
        if (target) {
            target.appendChild(this.el)
        }
    }

    selectMark(token: Token) {
        if (!token) {
            return
        }
        this.selectedMark = token;
    }

    output(tokens: Token[]) {
        const newList = this.render(tokens);
        yo.update(this.el, newList);
        this.didUpdate()
    }

    render(tokens: Token[]) {
        const listItem = (token: Token) => {
            const onClick = () => {
                this.onClickNode(token);
            };
            const isSelected = this.selectedMark === token;
            const className = isSelected ? "node-link is-selected" : "node-link";
            return yo`<tr onclick=${onClick}>
<th><a role="button" onclick=${onClick} class=${className} title=${token.pos}>
    ${token.surface_form}
</a></th>
<th>${token.word_type}</th>
<th>${token.word_position}</th>
<th>${token.pos}</th>
<th>${token.pos_detail_1}</th>
<th>${token.pos_detail_2}</th>
<th>${token.pos_detail_3}</th>
<th>${token.conjugated_type}</th>
<th>${token.conjugated_form}</th>
<th>${token.basic_form}</th>
<th>${token.reading}</th>
<th>${token.pronunciation}</th>
</tr>`
        };
        const list = tokens.map(listItem);
        return yo`<div class="table-wrapper">
    <table class="table">
    <thead class="table-head-sticky">
        <tr>
            <th>表層形</th>
            <!--<th>辞書内での単語ID</th> -->
            <th>単語タイプ</th>
            <th>単語の開始位置</th>
            <th>品詞</th>
            <th>品詞細分類1</th>
            <th>品詞細分類2</th>
            <th>品詞細分類3</th>
            <th>活用型</th>
            <th>活用形</th>
            <th>基本形</th>
            <th>読み</th>
            <th>発音</th>
        </tr>
    </thead>
    <tbody>
    ${list}
    </tbody>
    </table>
</div>`
    }

    didUpdate() {
        const selected = document.querySelector(".is-selected");
        if (!selected) {
            return;
        }
        selected.scrollIntoView();
    }
}
