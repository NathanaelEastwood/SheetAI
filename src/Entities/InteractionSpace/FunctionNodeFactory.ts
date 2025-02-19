import FunctionNodeParameters from "./FunctionNodeParameters";
import {Position} from "@xyflow/react";

abstract class FunctionNodeFactory {
    public static getNodeFromEnum(function_id: number, id: number, positionX: number, positionY: number): FunctionNodeParameters {
        switch (function_id) {
            case 0:
                return {
                    id: id.toString(),
                    type: 'functionNode',
                    position: {
                        x: positionX,
                        y: positionY
                    },
                    targetPosition: Position.Left,
                    sourcePosition: Position.Right,
                    data: {
                        label: "",
                        inputNodes: 2,
                        outputNodes: 1,
                        height: 20,
                        inputLabels: ["X", "Y"],
                        outputLabels: ["X + Y = Z"]
                    }
                }
            case 1:
                return {
                    id: id.toString(),
                    type: 'functionNode',
                    position: {
                        x: positionX,
                        y: positionY
                    },
                    targetPosition: Position.Left,
                    sourcePosition: Position.Right,
                    data: {
                        label: "",
                        inputNodes: 2,
                        outputNodes: 1,
                        height: 20,
                        inputLabels: ["X", "Y"],
                        outputLabels: ["X - Y = Z"]
                    }
                }
            case 2:
                return {
                    id: id.toString(),
                    type: 'functionNode',
                    position: {
                        x: positionX,
                        y: positionY
                    },
                    targetPosition: Position.Left,
                    sourcePosition: Position.Right,
                    data: {
                        label: "",
                        inputNodes: 2,
                        outputNodes: 1,
                        height: 20,
                        inputLabels: ["X", "Y"],
                        outputLabels: ["X * Y = Z"]
                    }
                }
            case 3:
                return {
                    id: id.toString(),
                    type: 'functionNode',
                    position: {
                        x: positionX,
                        y: positionY
                    },
                    targetPosition: Position.Left,
                    sourcePosition: Position.Right,
                    data: {
                        label: "",
                        inputNodes: 2,
                        outputNodes: 1,
                        height: 20,
                        inputLabels: ["X", "Y"],
                        outputLabels: ["X / Y = Z"]
                    }
                }
            case 4:
                return {
                    id: id.toString(),
                    type: 'functionNode',
                    position: {
                        x: positionX,
                        y: positionY
                    },
                    targetPosition: Position.Left,
                    sourcePosition: Position.Right,
                    data: {
                        label: "",
                        inputNodes: 2,
                        outputNodes: 1,
                        height: 20,
                        inputLabels: ["X", "Y"],
                        outputLabels: ["X % Y = Z"]
                    }
                }
            case 5:
                return {
                    id: id.toString(),
                    type: 'functionNode',
                    position: {
                        x: positionX,
                        y: positionY
                    },
                    targetPosition: Position.Left,
                    sourcePosition: Position.Right,
                    data: {
                        label: "",
                        inputNodes: 2,
                        outputNodes: 1,
                        height: 20,
                        inputLabels: ["X", "Y"],
                        outputLabels: ["Xʸ = Z"]
                    }
                }
            default:
                return {
                    id: id.toString(),
                    type: 'functionNode',
                    position: {
                        x: positionX,
                        y: positionY
                    },
                    targetPosition: Position.Left,
                    sourcePosition: Position.Right,
                    data: {
                        label: "unknown",
                        inputNodes: 0,
                        outputNodes: 0,
                        height: 20,
                        inputLabels: [],
                        outputLabels: []
                    }
                }
            }
    }
}

export default FunctionNodeFactory;
