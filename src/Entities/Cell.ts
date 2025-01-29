class Cell {

    constructor(renderedValue: string, underlyingValue: string, dependants: Cell[]) {
        this.RenderedValue = renderedValue;
        this.UnderlyingValue = underlyingValue;
        this.Dependants = dependants;
    }

    public RenderedValue: string;
    public UnderlyingValue: string;
    public Dependants: Cell[];
}

export default Cell;