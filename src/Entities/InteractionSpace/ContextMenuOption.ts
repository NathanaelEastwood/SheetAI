class ContextMenuOption {
    public constructor(value: string, callback: Function) {
        this.callback = callback;
        this.value = value;
    }
    public callback: Function;
    public value: string;
}

export default ContextMenuOption;