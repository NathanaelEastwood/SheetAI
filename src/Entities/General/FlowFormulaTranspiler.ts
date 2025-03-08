import {Edge, MarkerType, Node} from "@xyflow/react";
import {ASTNode, evaluateAST, parseFormulaToAST, tokenizeInput} from "./ASTHelperFunctions";
import functionNodeFactory from "../InteractionSpace/FunctionNodeFactory";
import {columnLetterToNumber, splitReference} from "./HelperFunctions";
import tableData from "../Table/TableData";

abstract class FlowFormulaTranspiler {

    public static flowToFormula = (nodes: Node[], edges: Edge[]): string => {
        console.log(nodes)
        console.log(edges)
        return "";  // TODO: Implement this method
    }

    public static formulaToFlow = (originName: string, formula: string, tableData: tableData): [Node[], Edge[]] => {
        // TODO: REMOVE PASSING TABLE DATA LIKE THIS, HIGH RISK OF CAUSING PROBLEMS!!!
        const tokenizedInput: string[] = tokenizeInput(formula)

        const astValue: ASTNode = parseFormulaToAST(tokenizedInput)
        let resultant_value: number = evaluateAST(astValue, doLookup)

        function doLookup(reference: string): number {
            // TODO: Throw exception instead of evaluating to zero if cell contents are invalid.
            let values = splitReference(reference)
            const columnNumber = columnLetterToNumber(values.column)
            let result;
            try {
                let dependencyCell = tableData.getCellValue(columnNumber - 1, values.row - 1)
                result = Number(dependencyCell.RenderedValue)
                return result
            } catch (e) {
                return 0;
            }
        }

        let id_object = {
            id: 11
        }

        let result = this.getNodeFromAst(astValue, 10, true,[0, 0], id_object, tableData)
        result[0].push(functionNodeFactory.getNodeFromEnum(7, 10, 400, 60, `=${originName}`));
        result[1].push({
            id: `origin_edge`,
            target: "10",
            source: "11",
            type: 'straight-step-edge',
            markerEnd: {
                type: MarkerType.Arrow,
                width: 30,       // Increase arrow width (default is 20)
                height: 30,      // Increase arrow height (default is 20)
                strokeWidth: 1,  // Thicker outline (optional) }
            },
            label: `${resultant_value}`
        })
        return [result[0], result[1]]
    }

    public static getNodeFromAst(node: ASTNode, parent_id: number, is_left_child: boolean, new_position: [number, number], id_object: any, tableData: tableData): [Node[], Edge[]]  {
        let edges: Edge[] = [];
        let nodes: Node[] = [];

        // TODO: If we're ever looking for a performance boost, look here - not only are we evaluating the AST Value twice, we're actually evaluating each sub-tree multiple times as well.
        let resultant_value: number = evaluateAST(node, doLookup)

        function doLookup(reference: string): number {
            // TODO: Throw exception instead of evaluating to zero if cell contents are invalid.
            let values = splitReference(reference)
            const columnNumber = columnLetterToNumber(values.column)
            let result;
            try {
                let dependencyCell = tableData.getCellValue(columnNumber - 1, values.row - 1)
                result = Number(dependencyCell.RenderedValue)
                return result
            } catch (e) {
                return 0;
            }
        }

        const nodeWidth = 100;    // Estimated width of a single node
        const nodeHeight = 80;    // Estimated height of a single node
        const minHorizontalSpacing = 50;  // Minimum space between nodes horizontally
        const minVerticalSpacing = 40;    // Minimum space between nodes vertically

        let this_node_id = id_object.id;
        id_object.id += 1;

        // Store dimensions of subtrees
        let leftWidth = 0;
        let leftHeight = 0;
        let rightWidth = 0;
        let rightHeight = 0;

        // Process left subtree
        if (node.left) {
            const leftPosition: [number, number] = [new_position[0] - nodeWidth - minHorizontalSpacing, new_position[1]];
            let leftSide = this.getNodeFromAst(node.left, this_node_id, true, leftPosition, id_object, tableData);
            nodes = nodes.concat(leftSide[0]);
            edges = edges.concat(leftSide[1]);

            if (leftSide[0].length > 0) {
                const leftX = leftSide[0].map(n => n.position.x);
                const leftY = leftSide[0].map(n => n.position.y);
                leftWidth = Math.max(...leftX) - Math.min(...leftX) + nodeWidth;
                leftHeight = Math.max(...leftY) - Math.min(...leftY) + nodeHeight;
            }
        }

        // Process right subtree
        if (node.right) {
            // Position right subtree below left subtree with spacing
            const verticalOffset = node.left ? leftHeight + minVerticalSpacing : 0;
            const rightPosition: [number, number] = [
                new_position[0] - nodeWidth - minHorizontalSpacing,
                new_position[1] + verticalOffset
            ];
            let rightSide = this.getNodeFromAst(node.right, this_node_id, false, rightPosition, id_object, tableData);
            nodes = nodes.concat(rightSide[0]);
            edges = edges.concat(rightSide[1]);

            if (rightSide[0].length > 0) {
                const rightX = rightSide[0].map(n => n.position.x);
                const rightY = rightSide[0].map(n => n.position.y);
                rightWidth = Math.max(...rightX) - Math.min(...rightX) + nodeWidth;
                rightHeight = Math.max(...rightY) - Math.min(...rightY) + nodeHeight;
            }
        }

        // Calculate this node's position based on subtree dimensions
        let xPos = new_position[0];
        let yPos = new_position[1];

        if (node.left || node.right) {
            // Center parent horizontally based on widest subtree
            const maxSubtreeWidth = Math.max(leftWidth, rightWidth);
            xPos = new_position[0] + (maxSubtreeWidth + minHorizontalSpacing) / 2;

            // Position vertically based on subtree heights
            if (node.left && node.right) {
                yPos = new_position[1] + (leftHeight + minVerticalSpacing) / 2;
            } else if (node.left) {
                yPos = new_position[1] + leftHeight / 2;
            } else if (node.right) {
                yPos = new_position[1] + rightHeight / 2;
            }
        }

        nodes.push(functionNodeFactory.getNodeFromEnum(
            getFunctionNode(node.type, node.value),
            this_node_id,
            xPos,
            yPos,
            node.value == "" ? "" : node.value
        ));

        if (parent_id !== 10) {
            edges.push({
                id: `${this_node_id}->${parent_id}`,
                target: parent_id.toString(),
                targetHandle: is_left_child ? "input-0" : "input-1",
                source: this_node_id.toString(),
                type: 'straight-step-edge',
                markerEnd: {
                    type: MarkerType.Arrow,
                    width: 30,       // Increase arrow width (default is 20)
                    height: 30,      // Increase arrow height (default is 20)
                    strokeWidth: 1,   // Thicker outline (optional)
                },
                label: `${resultant_value}`
            });
        }

        return [nodes, edges];
    }
}

function getFunctionNode(type: string, value?: string): number {
    const operatorMapping: { [key: string]: number } = {
        "+": 0,
        "-": 1,
        "*": 2,
        "/": 3,
    };
    if (type === "CellReference") {
        return 6;
    } else if (type === "Operator") {
        return operatorMapping[value??-1] ?? -1; // -1 as default for unknown operators
    }
    return -1; // Default value for unknown types
}

export default FlowFormulaTranspiler;
