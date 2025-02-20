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

    // Define operator precedence
    function getPrecedence(operator: string): number {
        switch (operator) {
            case "*":
            case "/":
                return 2; // Higher precedence
            case "+":
            case "-":
                return 1; // Lower precedence
            default:
                return 0; // Parentheses or unknown
        }
    }

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
            // Apply operators with >= precedence
            while (
                operatorStack.length &&
                "+-*/".includes(operatorStack[operatorStack.length - 1]) &&
                getPrecedence(operatorStack[operatorStack.length - 1]) >= getPrecedence(token)
                ) {
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

    // Apply remaining operators
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

export {tokenizeInput, parseFormulaToAST, evaluateAST}
export type { ASTNode };