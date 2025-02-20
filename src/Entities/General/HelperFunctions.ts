const getLetterFromNumber = (number: number): string => {
    let result = "";
    while (number > 0) {
        let rem = (number - 1) % 26;
        result = String.fromCharCode("A".charCodeAt(0) + rem) + result;
        number = Math.floor((number - 1) / 26);
    }
    return result;
}

export { getLetterFromNumber };