class Scalars {

    constructor(scalars: number[]) {
        this.scalars = scalars;
        this.pixelLength = scalars.reduce((partialSum, a) => partialSum + a, 0);
    }

    public extend(scalars: number[]){
        this.scalars = [...this.scalars, ...scalars];
        let additionalLength = scalars.reduce((partialSum, a) => partialSum + a, 0);
        this.pixelLength += additionalLength;

        return this.scalars;
    }

    public scalars: number[];
    public pixelLength: number;
}

export { Scalars };