type ASTNode = {
    type: "Number" | "CellReference" | "Operator";
    value?: string;
    left?: ASTNode;
    right?: ASTNode;
};

function tokenizeInput(input: string): string[] {
    const result: string[] = [];
    let currentToken = '';

    // Start from index 1 to skip initial '='
    for (let i = 1; i < input.length; i++) {
        const char = input[i];

        // Skip whitespace
        if (/\s/.test(char)) {
            if (currentToken) {
                result.push(currentToken);
                currentToken = '';
            }
            continue;
        }

        if (/[A-Za-z0-9]/.test(char)) {
            currentToken += char;
        } else {
            if (currentToken) {
                result.push(currentToken);
                currentToken = '';
            }
            if (/[+\-*/()]/.test(char)) {
                result.push(char);
            }
        }
    }

    if (currentToken) {
        result.push(currentToken);
    }

    return result;
}

function parseFormulaToAST(tokens: string[]): ASTNode {
    const stack: ASTNode[] = [];
    const operatorStack: string[] = [];

    function getPrecedence(operator: string): number {
        switch (operator) {
            case "*":
            case "/":
                return 2;
            case "+":
            case "-":
                return 1;
            default:
                return 0;
        }
    }

    function applyOperator() {
        if (stack.length < 2 || !operatorStack.length) {
            throw new Error("Invalid expression");
        }
        const right = stack.pop()!;
        const left = stack.pop()!;
        const operator = operatorStack.pop()!;
        stack.push({ type: "Operator", value: operator, left, right });
    }

    for (const token of tokens) {
        if (/^\d+$/.test(token)) {
            stack.push({ type: "Number", value: token });
        } else if (/^[A-Z]+\d+$/.test(token)) {
            stack.push({ type: "CellReference", value: token });
        } else if ("+-*/".includes(token)) {
            while (
                operatorStack.length &&
                operatorStack[operatorStack.length - 1] !== "(" &&
                getPrecedence(operatorStack[operatorStack.length - 1]) >= getPrecedence(token)
                ) {
                applyOperator();
            }
            operatorStack.push(token);
        } else if (token === "(") {
            operatorStack.push(token);
        } else if (token === ")") {
            while (
                operatorStack.length &&
                operatorStack[operatorStack.length - 1] !== "("
                ) {
                applyOperator();
            }
            if (!operatorStack.length) {
                throw new Error("Mismatched parentheses");
            }
            operatorStack.pop(); // Remove "("
        }
    }

    while (operatorStack.length) {
        if (operatorStack[operatorStack.length - 1] === "(") {
            throw new Error("Mismatched parentheses");
        }
        applyOperator();
    }

    if (stack.length !== 1) {
        throw new Error("Invalid expression");
    }

    return stack[0];
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

export { tokenizeInput, parseFormulaToAST, evaluateAST };
export type { ASTNode };