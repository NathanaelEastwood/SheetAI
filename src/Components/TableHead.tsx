import HeadCell from "./HeadCell";

interface RowProperties {
    wholeCellOffset: number;
    width: number;
}

const TableHead: React.FC<RowProperties> = ({width, wholeCellOffset}) => {
    let column_heads = CreateColumnRange(wholeCellOffset, width + wholeCellOffset)
    return (
        <tr style={{position: 'sticky', top: '0px', right: '0px'}}>
            {Array.from({length: width}, (_, i) => <HeadCell key={i} is_index_cell={false} cellId={`${-1}_${i}`} internalValue={undefined}
                                                         visibleValue = {i == 0 ? "" : column_heads[i]}/>)}
        </tr>
    )
}


export default TableHead;

function CreateColumnRange(columnStart: number, columnFinish: number){
    let result = []
    for (let i = columnStart; i < columnFinish + 1; i++) {
        result.push(generateColumnLetterFromNumber(i))
    }
    return result;
}

function generateColumnLetterFromNumber(input: number): string
{
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
        0: "Z",
    }
    let position_array = []
    // calculate each position in right to left order
    // once the input has been narrowed down to under 26 you are on the last character
    while (input > 26){
        let char_value = input % 26
        position_array.push(char_value)
        if(char_value != 0) {
            input -= char_value
            input = input / 26
        }
        else {
            input = input / 26
            input -= 1
        }

    }
    position_array.push(input)

    let result = ""
    for (let i = position_array.length; i > 0; i--)
    {
        result += alphabetMap[position_array[i - 1]]
    }
    return result
}