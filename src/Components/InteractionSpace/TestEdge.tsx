import {
    getSmoothStepPath,
    BaseEdge,
    type EdgeProps,
    type Edge, EdgeLabelRenderer,
} from '@xyflow/react';

type CustomEdge = Edge<{ value: number }, 'custom'>;

export default function CustomEdge({id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, label}: EdgeProps<CustomEdge>) {
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            <BaseEdge id={id} path={edgePath} markerEnd={markerEnd}/>
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                        pointerEvents: 'all',
                    }}
                    className="label-edge__label nodrag nopan"
                >{label}</div>
            </EdgeLabelRenderer>
        </>
    );
}