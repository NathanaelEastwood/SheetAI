import FunctionNodeParameters from "./FunctionNodeParameters";
import {Position} from "@xyflow/react";

abstract class FunctionNodeFactory {
    public static getNodeFromEnum(function_id: number, id: number, positionX: number, positionY: number, label: string = ""): FunctionNodeParameters {
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
                        outputLabels: ["X + Y = Z"],
                        width: "140px"
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
                        outputLabels: ["X - Y = Z"],
                        width: "140px"
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
                        outputLabels: ["X * Y = Z"],
                        width: "140px"
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
                        outputLabels: ["X / Y = Z"],
                        width: "140px"
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
                        outputLabels: ["X % Y = Z"],
                        width: "140px"
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
                        outputLabels: ["Xʸ = Z"],
                        width: "140px"
                    }
                }
            case 6:
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
                        inputNodes: 0,
                        outputNodes: 1,
                        height: 20,
                        inputLabels: [],
                        outputLabels: [label],
                        width: "50px"
                    }
                }
            case 7:
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
                        inputNodes: 1,
                        outputNodes: 0,
                        height: 20,
                        inputLabels: [label],
                        outputLabels: [],
                        width: "40px"
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
                    width: 100,
                    data: {
                        label: "unknown",
                        inputNodes: 0,
                        outputNodes: 0,
                        height: 20,
                        inputLabels: [],
                        outputLabels: [],
                        width: "140px"
                    }
                }
            }
    }
}

export default FunctionNodeFactory;
