const getLetterFromNumber = (number: number): string => {
    let result = "";
    while (number > 0) {
        let rem = (number - 1) % 26;
        result = String.fromCharCode("A".charCodeAt(0) + rem) + result;
        number = Math.floor((number - 1) / 26);
    }
    return result;
}

function columnLetterToNumber(column: string): number {
    let columnNumber = 0;
    for (let i = 0; i < column.length; i++) {
        columnNumber = columnNumber * 26 + (column.charCodeAt(i) - 64);
    }
    return columnNumber;
}

function splitReference(reference: string): { column: string, row: number } {
    const match = reference.match(/^([A-Z]+)(\d+)$/);
    if (!match) throw new Error("Invalid reference format");
    return { column: match[1], row: parseInt(match[2], 10) };
}

export { getLetterFromNumber, columnLetterToNumber, splitReference };