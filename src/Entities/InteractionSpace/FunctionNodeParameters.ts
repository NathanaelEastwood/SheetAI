import {Node} from "@xyflow/react";

type FunctionNodeParameters = Node<{
    label: string;
    height: number;
    inputNodes: number;
    outputNodes: number;
    inputLabels: string[];
    outputLabels: string[];
    width: string;
}>;

export default FunctionNodeParameters;