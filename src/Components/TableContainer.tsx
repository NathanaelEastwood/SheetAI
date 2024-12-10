import React, {useEffect, useState} from "react";
import MainTable from "./MainTable";

interface TableContainerProps
{
    initialWidth: number;
    initialHeight: number;
}

const TableContainer: React.FC<TableContainerProps> = ({ initialWidth, initialHeight}) => {

    const [currentWidth, setCurrentWidth] = useState<number>(initialWidth);
    const [currentHeight, setCurrentHeight] = useState<number>(initialHeight);

    const [data, setData] = useState<any[][]>(() => CreateData([[]], initialHeight, initialWidth));
    const [columnNames, setColumnNames] = useState<string[]>(() => CreateColumns(20, [], 0));

    let vertical_buffer = useState<any[][]>([[]])
    let [horizontalBuffer, setHorizontalBuffer] = useState<string[]>(() => CreateColumnRange(20, 100))
    let bufferStartIndex = 20;

    const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>): void => {
        if (event.currentTarget.scrollWidth - 20 <= event.currentTarget.scrollLeft + event.currentTarget.clientWidth) {
            console.log(columnNames);

            setCurrentWidth((prevWidth) => {
                const newWidth = prevWidth + 5;

                // Update horizontal buffer
                setHorizontalBuffer((prevBuffer) => {
                    const newBuffer = prevBuffer.slice(6).concat(CreateColumnRange(prevWidth + 80, prevWidth + 85));
                    return newBuffer
                });

                // Update column names
                setColumnNames((prevColumns) => {
                    return [...CreateColumns(newWidth, horizontalBuffer, bufferStartIndex, prevColumns)];
                });

                // Update data
                setData((prevData) => {
                    return [...CreateData(prevData, currentHeight, newWidth)];
                });

                return newWidth;
            });
        }
    };



    return (
        <div className="table-container" onScroll={handleScroll}>
            <MainTable columnNames={columnNames} data={data}>
            </MainTable>
        </div>
    )
}

function CreateData(intake: any[][], height: number, width: number): any[][] {
    let intake_height = 0;
    let intake_width = 0;
    let result = intake;
    intake_height = intake.length;
    intake_width = intake[0].length;

    if (intake_height == 0 || intake_width == 0){
        return Array.from({length: height}, (_, rowIndex) =>
            Array(width).fill(null).map((_, colIndex) => (colIndex === 0 ? rowIndex : null))
        );
    }

    const height_increase = height - intake_height;
    const width_increase = width - intake_width;

    if (height_increase > 0) {
        const new_rows = Array.from({ length: height_increase }, (_, rowIndex) =>
            Array(width).fill(null).map((_, colIndex) => (colIndex === 0 ? rowIndex + intake_height : null))
        );
        result = result.concat(new_rows)
    }

    if (width_increase > 0)
    {
        var new_columns;
        for (let j = 0; j < width_increase; j++) {
            new_columns = Array.from({ length: width_increase }, (_) => null)
        }
        for (let i = 0; i < height; ++i) {
            result[i].push(new_columns)
        }
    }
    return result;
}

function CreateColumnRange(columnStart: number, columnFinish: number){
    console.log(`Creating column tops: ${columnStart}, ${columnFinish}`);
    let result = []
    for (let i = columnStart; i < columnFinish + 1; i++) {
        result.push(generateColumnLetterFromNumber(i))
    }
    return result;
}

function CreateColumns(columnNumber: number, buffer: string[], buffer_start_index: number, oldColumns: string[] = []): Array<string>{
    if (oldColumns.length > 0) {
        let new_columns_needed = columnNumber - oldColumns.length;
        let first_new_column_position = oldColumns.length + 1;
        let first_buffer_element_required = first_new_column_position - buffer_start_index;
        let result = oldColumns;

        for (let i = 0; i < new_columns_needed; i++) {
            if (first_buffer_element_required + i < buffer.length) {
                result.push(buffer[first_buffer_element_required + i])
            } else {
                result.push(generateColumnLetterFromNumber(i + oldColumns.length))
            }
        }

        return result
    } else {
        let result = [" "]
        for (let i = 1; i < columnNumber; i++) {
            result.push(generateColumnLetterFromNumber(i))
        }
        return result
    }
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

export default TableContainer;