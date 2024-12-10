type AlphabetMap = Record<number, string>;
const alphabetMap: AlphabetMap = {
    1: "A",
    2: "B",
    3: "C",
    4: "D",
    5: "E",
    6: "F",
    7: "G",
    8: "H",
    9: "I",
    10: "J",
    11: "K",
    12: "L",
    13: "M",
    14: "N",
    15: "O",
    16: "P",
    17: "Q",
    18: "R",
    19: "S",
    20: "T",
    21: "U",
    22: "V",
    23: "W",
    24: "X",
    25: "Y",
    26: "Z",
}

function CreateColumns(columnNumber: number): Array<string>{
    var result = []
    var startPosition = [1]
    for (var i = 1; i < columnNumber + 1; i++) {
        result.push(generateColumnLetterFromNumber(i))
    }
    return result
}

function generateColumnLetterFromNumber(input: number): string
{
    var position_array = []
    // calculate each position in right to left order
    // once the input has been narrowed down to under 26 you are on the last character
    while (input > 26){
        var char_value = input % 26
        position_array.push(char_value)
        input -= char_value
        input = input/26
    }
    position_array.push(input)

    var result = ""
    for (let i = position_array.length; i >= 0; i--)
    {
        result += alphabetMap[position_array[i]]
    }

    return result
}