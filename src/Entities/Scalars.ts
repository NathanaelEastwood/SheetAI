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

    public getIndexFromPosition(position: number): number {
        let cumulativePosition = 0;
        let result = 0;
        while (cumulativePosition <= position) {
            cumulativePosition += this.scalars[result];
            result += 1;
        }

        return result - 1;
    }

    public getPositionFromIndex(index: number): number {
        return this.scalars.slice(0, index).reduce((sum, value) => sum + value, 0);
    }

    public getClosestEdge(position: number): number {
        let cumulativePosition = 0;
        let result = 0;
        while (true) {
            if (cumulativePosition > position){
                return cumulativePosition;
            }
            cumulativePosition += this.scalars[result];
            result += 1;
        }
    }

    public scalars: number[];
    public pixelLength: number;
}

export { Scalars };