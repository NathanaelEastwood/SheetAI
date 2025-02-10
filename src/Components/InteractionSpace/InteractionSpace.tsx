import CellSelectionBox from "./CellSelectionBox";
import React, {useCallback, useRef, useState} from "react";
import {
    addEdge,
    applyEdgeChanges,
    Connection,
    EdgeTypes,
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


const nodeTypes: NodeTypes = { functionNode: FunctionNode };
const edgeTypes: EdgeTypes = {'straight-step-edge': CustomEdge};

const InteractionSpace: React.FC = () => {


    const options = [
        new ContextMenuOption("Add Function", showFunctionPalette)
    ]

    const id = useRef<number>(3);

    // context menu params
    const [contextMenuLocation, setContextMenuLocation] = useState<[number, number]>([0, 0]);
    const [contextMenuVisible, setContextMenuVisible] = useState<boolean>(false);
    const [functionPaletteVisible, setFunctionPaletteVisible] = useState<boolean>(false);

    const initialNodes: Node[] = [
        {id: '1', type: 'functionNode', targetPosition: Position.Left, position: {x: 100, y:100 }, data: {label: 'A1', intakeNodes: 1}, draggable: false}
    ]

    const initialEdges: any[] = [];
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges] = useEdgesState(initialEdges);

    let interactionSpace = useRef<HTMLDivElement>(null);
    const reactFlowRef = useRef<any>(null);

    const onEdgesChange = useCallback(
        (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
    );

    function showFunctionPalette(){
        setFunctionPaletteVisible(true);
    }

    function addNode(clientX: number, clientY: number) {
        if (!interactionSpace.current) return;

        // Use the ReactFlow instance to map screen coordinates to flow space
        const reactFlowInstance = reactFlowRef.current; // Ensure you store the instance
        if (!reactFlowInstance) return;

        const flowCoords = reactFlowInstance.screenToFlowPosition({ x: clientX, y: clientY });
        let newNode = FunctionNodeFactory.Multiply(id.current, flowCoords.x, flowCoords.y);

        setNodes((prevNodes) => [
            ...prevNodes,
            newNode
        ]);

        id.current += 1;
    }

    const onConnect = useCallback(
        (connection: Connection) => {
            const edge = {...connection, type: 'straight-step-edge'};
            setEdges((eds) => addEdge(edge, eds))
        },
        [setEdges]
    );

    const onContextMenu = (event: React.MouseEvent) => {
        setContextMenuLocation([event.clientX, event.clientY]);
        setContextMenuVisible(true);
        setFunctionPaletteVisible(false);
        event.preventDefault();
    }

    const onClick = (event: React.MouseEvent) => {
        setContextMenuVisible(false);
        setFunctionPaletteVisible(false);
    }

    return (
        <>
            <CellSelectionBox cellName={"A1"} />
            <div style={{ width: "100%", height: "75vh", border: "1px solid black" }} ref={interactionSpace}>
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
                        reactFlowInstance.fitView({padding: 4}).then();  // Optional padding
                    }}

                />
            </div>
            <ContextMenu x={contextMenuLocation[0]} y={contextMenuLocation[1]} visible={contextMenuVisible} options={options} onClose={() => {setContextMenuVisible(false)}}/>
            <div style={{
                position: "fixed",
                top: contextMenuLocation[1],
                left: contextMenuLocation[0],
                visibility: functionPaletteVisible ? "visible" : "hidden"
            }}>
                <FunctionPalette></FunctionPalette>
            </div>
        </>
    );
};

export default InteractionSpace;
