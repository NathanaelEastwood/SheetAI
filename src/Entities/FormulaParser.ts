import TableData from "./TableData";
import tableData from "./TableData";

let globalTableData : tableData;

function parse(intakeCell: [string, string], table: TableData): [string, string] {

    globalTableData = table
    const tokenizedInput = tokenizeInput(intakeCell[1])
    const astValue = parseFormulaToAST(tokenizedInput)
    const resultantValue = evaluateAST(astValue, doLookup);
    // unwrap nested formula using a stack
    // do formula
    return [resultantValue.toString(), intakeCell[1]];
}

type ASTNode = {
    type: "Number" | "CellReference" | "Operator";
    value?: string;
    left?: ASTNode;
    right?: ASTNode;
};

function tokenizeInput(input: string): string[] {
    const result : string[] = [];
    const boundaryRegex = new RegExp('^[A-Za-z0-9]$');
    let currentTokenStart = 1;
    for (let i = 1; i < input.length; i++){
        if (!boundaryRegex.test(input[i])) {
            if(currentTokenStart != i) {
                result.push(input.slice(currentTokenStart, i));
            }
            currentTokenStart = i + 1;
            result.push(input[i]);
        }
    }

    result.push(input.slice(currentTokenStart, input.length))

    return result;
}

function parseFormulaToAST(tokens: string[]): ASTNode {
    const stack: ASTNode[] = [];
    const operatorStack: string[] = [];

    function applyOperator() {
        const right = stack.pop()!;
        const left = stack.pop()!;
        const operator = operatorStack.pop()!;

        stack.push({ type: "Operator", value: operator, left, right });
    }

    for (const token of tokens) {
        if (/\d+/.test(token) || /^[A-Z]+\d+$/.test(token)) {
            stack.push({ type: /^[A-Z]+\d+$/.test(token) ? "CellReference" : "Number", value: token });
        } else if ("+-*/".includes(token)) {
            while (operatorStack.length && "+-*/".includes(operatorStack[operatorStack.length - 1])) {
                applyOperator();
            }
            operatorStack.push(token);
        } else if (token === "(") {
            operatorStack.push(token);
        } else if (token === ")") {
            while (operatorStack.length && operatorStack[operatorStack.length - 1] !== "(") {
                applyOperator();
            }
            operatorStack.pop(); // Remove "("
        }
    }

    while (operatorStack.length) {
        applyOperator();
    }

    return stack[0]; // The root node of the AST
}

function evaluateAST(node: ASTNode, lookup: (cell: string) => number): number {
    if (node.type === "Number") return Number(node.value);
    if (node.type === "CellReference") return lookup(node.value!);

    const leftValue = evaluateAST(node.left!, lookup);
    const rightValue = evaluateAST(node.right!, lookup);

    switch (node.value) {
        case "+": return leftValue + rightValue;
        case "-": return leftValue - rightValue;
        case "*": return leftValue * rightValue;
        case "/": return leftValue / rightValue;
    }

    throw new Error("Unknown operator");
}

function doLookup(reference: string): number {
    // TODO: Throw exception instead of evaluating to zero if cell contents are invalid
    let values = splitReference(reference)
    const columnNumber = columnLetterToNumber(values.column)
    let result;
    try {
        result = Number(globalTableData.getCellValue(columnNumber - 1, values.row)[0])
        return result
    } catch (e) {
        return 0;
    }
}

function splitReference(reference: string): { column: string, row: number } {
    const match = reference.match(/^([A-Z]+)(\d+)$/);
    if (!match) throw new Error("Invalid reference format");
    return { column: match[1], row: parseInt(match[2], 10) };
}

function columnLetterToNumber(column: string): number {
    let columnNumber = 0;
    for (let i = 0; i < column.length; i++) {
        columnNumber = columnNumber * 26 + (column.charCodeAt(i) - 64);
    }
    return columnNumber;
}


export default parse;