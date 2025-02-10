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
                        label: "Add",
                        intakeNodes: 2,
                        outputNodes: 1,
                        height: 20
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
                        label: "Subtract",
                        intakeNodes: 2,
                        outputNodes: 1,
                        height: 20
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
                        label: "Multiply",
                        intakeNodes: 2,
                        outputNodes: 1,
                        height: 20
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
                        label: "Divide",
                        intakeNodes: 2,
                        outputNodes: 1,
                        height: 20
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
                        label: "Modulo",
                        intakeNodes: 2,
                        outputNodes: 1,
                        height: 20
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
                        label: "Power",
                        intakeNodes: 2,
                        outputNodes: 1,
                        height: 20
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
                        label: "Sum",
                        intakeNodes: 2,
                        outputNodes: 1,
                        height: 20
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
                        label: "Multiply",
                        intakeNodes: 2,
                        outputNodes: 1,
                        height: 20
                    }
                }
            }
    }
}

export default FunctionNodeFactory;
