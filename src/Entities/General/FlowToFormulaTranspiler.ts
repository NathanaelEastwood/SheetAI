import {Node, Edge, Position} from "@xyflow/react";
import {parseFormulaToAST, tokenizeInput, ASTNode} from "./ASTHelperFunctions";
import {getLetterFromNumber} from "./HelperFunctions";
import functionNodeFactory from "../InteractionSpace/FunctionNodeFactory";

abstract class FlowToFormulaTranspiler {
    public static flowToFormula = (nodes: Node[], edges: Edge[]): string => {

    }

    public static formulaToFlow = (formula: string): [Node[], Edge[]] => {
        const tokenizedInput: string[] = tokenizeInput(formula)
        const astValue: ASTNode = parseFormulaToAST(tokenizedInput)

        let result = this.getNodeFromAst(astValue, [], [], 0, 0, 10)
        return [result[0], result[1]]
    }

    public static getNodeFromAst(node: ASTNode, currentNodes: Node[], currentEdges: Edge[], current_branch_height: number, current_cross_location: number, current_key: number): [Node[], Edge[], number]  {
        let trackedKey = current_key;
        currentNodes.push(functionNodeFactory.getNodeFromEnum(1, current_key, current_cross_location, current_branch_height))

        if (node.left) {
            trackedKey += 1
            const leftNode = this.getNodeFromAst(node.left, currentNodes, currentEdges, current_branch_height + 80, current_cross_location - 160, trackedKey)
            currentEdges.push({
                id: `${current_key}->${leftNode[0][leftNode[0].length - 1].id + 1}`,
                target: current_key.toString(),
                targetHandle: "input-1-",
                source: leftNode[0][leftNode[0].length - 1].id,
                type: 'straight-step-edge'
            })

            trackedKey = leftNode[2]
        }

        if (node.right) {
            trackedKey += 1
            const rightNode = this.getNodeFromAst(node.right, currentNodes, currentEdges, current_branch_height - 80, current_cross_location - 160, trackedKey)
            currentEdges.push({
                id: `${current_key}->${rightNode[0][rightNode[0].length - 1].id + 2}`,
                target: current_key.toString(),
                targetHandle: "input-0-",
                source: rightNode[0][rightNode[0].length - 1].id,
                type: 'straight-step-edge'
            })

            trackedKey = rightNode[2]
        }

        return [currentNodes, currentEdges, trackedKey]
    }
}

export default FlowToFormulaTranspiler;