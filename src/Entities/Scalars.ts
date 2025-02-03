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

    public pointIsWithinDistanceOfEdge(point: number, acceptableDistance: number): boolean {
        let cumulativePosition = 0;
        let index = 0;
        while (cumulativePosition <= point) {
            if (Math.abs(cumulativePosition - point) <= acceptableDistance){
                return true;
            }
            cumulativePosition += this.scalars[index];
            index += 1;
        }
        return false;
    }

    public shiftValue(index: number, shiftDistance: number): number[] {
        this.scalars[index - 1] += shiftDistance;
        return this.scalars;
    }

    public scalars: number[];
    public pixelLength: number;
}

export { Scalars };