import CellSelectionBox from "./CellSelectionBox";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    addEdge,
    applyEdgeChanges,
    Connection,
    EdgeTypes, MiniMap,
    Node,
    NodeTypes,
    Position,
    ReactFlow,
    useEdgesState,
    useNodesState
} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import ContextMenu from "./ContextMenu";
import ContextMenuOption from "../../Entities/InteractionSpace/ContextMenuOption";
import FunctionNode from "./FunctionNode";
import CustomEdge from "./TestEdge";
import FunctionNodeFactory from "../../Entities/InteractionSpace/FunctionNodeFactory";
import FunctionPalette from "./FunctionPalette";
import SourceDialogue from "./SourceDialogue";
import { useSelector } from "react-redux";
import { RootState } from "../../main";
import { getLetterFromNumber } from "../../Entities/General/HelperFunctions";
import FlowFormulaTranspiler from "../../Entities/General/FlowFormulaTranspiler";

const nodeTypes: NodeTypes = { functionNode: FunctionNode };
const edgeTypes: EdgeTypes = { 'straight-step-edge': CustomEdge };

const InteractionSpace: React.FC = () => {
    const selectedCell = useSelector((state: RootState) => state.globalTableData.selectedCell);
    const tableData = useSelector((state: RootState) => state.globalTableData.value);
    const selectedCellContents = tableData.getCellValue(selectedCell[0], selectedCell[1]);


    const options = [
        new ContextMenuOption("Add Function", showFunctionPalette),
        new ContextMenuOption("Add Source", showSourceDialogue)
    ];

    const id = useRef<number>(3);

    // context menu params
    const [contextMenuLocation, setContextMenuLocation] = useState<[number, number]>([0, 0]);
    const [contextMenuVisible, setContextMenuVisible] = useState<boolean>(false);
    const [sourceDialogueVisible, setSourceDialogueVisible] = useState<boolean>(false);
    const [functionPaletteVisible, setFunctionPaletteVisible] = useState<boolean>(false);

    let initialNodes: Node[] = [
        {
            id: '1',
            type: 'functionNode',
            targetPosition: Position.Left,
            position: { x: 100, y: 100 },
            data: {
                label: 'Output',
                inputNodes: 1,
                inputLabels: [`=${getLetterFromNumber(selectedCell[0] + 1)}${selectedCell[1] + 1}`],
                outputLabels: [],
                height: 20
            },
            draggable: false
        }
    ];

    useEffect(() => {

    }, [selectedCell]);

    useEffect(() => {
        if (selectedCellContents.UnderlyingValue[0] === '=') {
            let flowValues = FlowFormulaTranspiler.formulaToFlow(
                `${getLetterFromNumber(selectedCell[0] + 1)}${selectedCell[1] + 1}`,
                selectedCellContents.UnderlyingValue,
                tableData
            );
            setNodes(flowValues[0]);
            setEdges(flowValues[1]);
        } else {
            setNodes([
                {
                    id: '1',
                    type: 'functionNode',
                    targetPosition: Position.Left,
                    position: { x: 100, y: 100 },
                    data: {
                        label: 'Output',
                        inputNodes: 1,
                        inputLabels: [`=${getLetterFromNumber(selectedCell[0] + 1)}${selectedCell[1] + 1}`],
                        outputLabels: [],
                        height: 20
                    },
                    draggable: false
                }
            ]);
            setEdges([]);
        }
    }, [selectedCell]);

    const initialEdges: any[] = [];
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges] = useEdgesState(initialEdges);

    useEffect(() => {
        if (reactFlowRef.current && nodes.length > 0) {
            setTimeout(() => {
                reactFlowRef.current.fitView({ padding: 3, duration: 600 });
            }, 300);
        }
    }, [nodes]);



    let interactionSpace = useRef<HTMLDivElement>(null);
    const reactFlowRef = useRef<any>(null);

    const onEdgesChange = useCallback(
        (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );

    function showFunctionPalette() {
        setFunctionPaletteVisible(true);
    }

    function showSourceDialogue() {
        setSourceDialogueVisible(true);
    }

    function addNode(function_id: number) {
        setContextMenuVisible(false);
        setFunctionPaletteVisible(false);
        setSourceDialogueVisible(false);
        if (!interactionSpace.current) return;

        const reactFlowInstance = reactFlowRef.current;
        if (!reactFlowInstance) return;

        const flowCoords = reactFlowInstance.screenToFlowPosition({ x: contextMenuLocation[0], y: contextMenuLocation[1] });
        let newNode = FunctionNodeFactory.getNodeFromEnum(function_id, id.current, flowCoords.x, flowCoords.y);

        setNodes((prevNodes) => [
            ...prevNodes,
            newNode
        ]);

        id.current += 1;
    }

    const onConnect = useCallback(
        (connection: Connection) => {
            const edge = { ...connection, type: 'straight-step-edge' };
            setEdges((eds) => addEdge(edge, eds));
        },
        [setEdges]
    );

    const onContextMenu = (event: React.MouseEvent) => {
        setContextMenuLocation([event.clientX, event.clientY]);
        setContextMenuVisible(true);
        setFunctionPaletteVisible(false);
        setSourceDialogueVisible(false);
        event.preventDefault();
    };

    const onClick = (event: React.MouseEvent) => {
        setContextMenuVisible(false);
        setFunctionPaletteVisible(false);
        setSourceDialogueVisible(false);
    };

    return (
        <>
            <CellSelectionBox />
            <div style={{ width: "100%", height: "80vh" }} ref={interactionSpace}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onContextMenu={onContextMenu}
                    onClick={onClick}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    onInit={(reactFlowInstance) => {
                        reactFlowRef.current = reactFlowInstance;
                        reactFlowInstance.fitView({ padding: 6 }).then();
                    }}
                    ref = {reactFlowRef}
                >
                </ReactFlow>
            </div>
            <ContextMenu
                x={contextMenuLocation[0]}
                y={contextMenuLocation[1]}
                visible={contextMenuVisible}
                options={options}
                onClose={() => setContextMenuVisible(false)}
            />
            <SourceDialogue
                x={contextMenuLocation[0]}
                y={contextMenuLocation[1]}
                visible={sourceDialogueVisible}
                onClose={() => setSourceDialogueVisible(false)}
                onColumnChange={(string) => console.log(string)}
                onRowChange={(string) => console.log(string)}
            />
            <div style={{
                position: "fixed",
                top: contextMenuLocation[1],
                left: contextMenuLocation[0],
                visibility: functionPaletteVisible ? "visible" : "hidden"
            }}>
                <FunctionPalette onClickCallback={addNode}></FunctionPalette>
            </div>
        </>
    );
};

export default InteractionSpace;