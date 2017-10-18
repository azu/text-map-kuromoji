"use strict";
import { EventEmitter } from "events";
import Editor from "./editor/editor";
import Marker from "./marker/marker";
import Output from "./output/output";
import { Token } from "./marker/Token";

const editor = new Editor({
    selector: "js-editor",
    selectMark(mark) {
        app.setState({
            selected: mark
        });
    }
});
const marker = new Marker();
const output = new Output({
    selector: "#js-output",
    onClickNode(token: Token) {
        app.setState({
            selected: token
        });
    }
});

export interface AppState {
    code?: string;
    tokens: Array<Token>;
    selected: any ;
}

class App extends EventEmitter {
    private state: AppState;

    constructor() {
        super();
        this.state = {
            code: undefined,
            tokens: [],
            selected: undefined
        }
    }

    getState() {
        return this.state;
    }

    setState(newState: Partial<AppState>) {
        if (this.state === newState) {
            return;
        }
        this.state = Object.assign({}, this.state, newState);
        this.emit("CHANGE");
    }

    onChange(handler: () => void) {
        this.on("CHANGE", handler);
    }

}

const app = new App();
app.onChange(() => {
    const state = app.getState();
    console.info("newState", state);
    editor.updateMarker(state.tokens);
    editor.highlightMark(state.selected);
    output.selectMark(state.selected);
    output.output(state.tokens);
});

const updateState = () => {
    const code = editor.getText();
    marker.createMarks(code).then((tokens: Token[]) => {
        app.setState({
            code,
            tokens
        });
    });
};
editor.edit().onChange(updateState);
updateState();