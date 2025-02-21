import {Node, Edge, Position} from "@xyflow/react";
import {parseFormulaToAST, tokenizeInput, ASTNode} from "./ASTHelperFunctions";
import functionNodeFactory from "../InteractionSpace/FunctionNodeFactory";

abstract class FlowToFormulaTranspiler {
    public static flowToFormula = (nodes: Node[], edges: Edge[]): string => {

    }

    public static formulaToFlow = (formula: string): [Node[], Edge[]] => {
        const tokenizedInput: string[] = tokenizeInput(formula)
        const astValue: ASTNode = parseFormulaToAST(tokenizedInput)

        let id_object = {
            id: 11
        }

        let result = this.getNodeFromAst(astValue, 10, true,[0, 0], id_object)
        return [result[0], result[1]]
    }

    public static getNodeFromAst(node: ASTNode, parent_id: number, is_left_child: boolean, new_position: [number, number], id_object: any): [Node[], Edge[]]  {
        let edges: Edge[] = [];
        let nodes: Node[] = [];

        const nodeWidth = 150;    // Estimated width of a single node
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
            let leftSide = this.getNodeFromAst(node.left, this_node_id, true, leftPosition, id_object);
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
            let rightSide = this.getNodeFromAst(node.right, this_node_id, false, rightPosition, id_object);
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
                targetHandle: is_left_child ? "input-0-" : "input-1-",
                source: this_node_id.toString(),
                type: 'straight-step-edge'
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

function calculate_parent_position(){

}

export default FlowToFormulaTranspiler;
