import {Node} from "@xyflow/react";

type FunctionNodeParameters = Node<{
    label: string;
    height: number;
    intakeNodes: number;
    outputNodes: number;
}>;

export default FunctionNodeParameters;