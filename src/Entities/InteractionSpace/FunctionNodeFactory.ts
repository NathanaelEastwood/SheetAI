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
                        label: "+",
                        inputNodes: 2,
                        outputNodes: 1,
                        windowHeight: 20,
                        inputLabels: ["", ""],
                        outputLabels: [""],
                        windowWidth: "60px"
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
                        label: "-",
                        inputNodes: 2,
                        outputNodes: 1,
                        windowHeight: 20,
                        inputLabels: ["", ""],
                        outputLabels: [""],
                        windowWidth: "60px"
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
                        label: "*",
                        inputNodes: 2,
                        outputNodes: 1,
                        windowHeight: 20,
                        inputLabels: ["", ""],
                        outputLabels: [""],
                        windowWidth: "60px"
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
                        label: "/",
                        inputNodes: 2,
                        outputNodes: 1,
                        windowHeight: 20,
                        inputLabels: ["", ""],
                        outputLabels: [""],
                        windowWidth: "60px"
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
                        windowHeight: 20,
                        inputLabels: ["X", "Y"],
                        outputLabels: ["X % Y = Z"],
                        windowWidth: "140px"
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
                        windowHeight: 20,
                        inputLabels: ["X", "Y"],
                        outputLabels: ["Xʸ = Z"],
                        windowWidth: "140px"
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
                        windowHeight: 20,
                        inputLabels: [],
                        outputLabels: [label],
                        windowWidth: "50px"
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
                        windowHeight: 20,
                        inputLabels: [label],
                        outputLabels: [],
                        windowWidth: "40px"
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
                    windowWidth: 100,
                    data: {
                        label: "unknown",
                        inputNodes: 0,
                        outputNodes: 0,
                        windowHeight: 20,
                        inputLabels: [],
                        outputLabels: [],
                        windowWidth: "140px"
                    }
                }
            }
    }
}

export default FunctionNodeFactory;
