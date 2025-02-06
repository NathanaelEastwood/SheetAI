class Cell {

    constructor(renderedValue: string, underlyingValue: string, dependants: Set<[number, number]>) {
        this.RenderedValue = renderedValue;
        this.UnderlyingValue = underlyingValue;
        this.Dependants = dependants;
    }

    public RenderedValue: string;
    public UnderlyingValue: string;
    public Dependants: Set<[number, number]>;
}

export default Cell;