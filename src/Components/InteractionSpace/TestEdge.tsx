import {
    getStraightPath,
    BaseEdge,
    type EdgeProps,
    type Edge, getSmoothStepPath, getBezierPath, getSimpleBezierPath,
} from '@xyflow/react';

type CustomEdge = Edge<{ value: number }, 'custom'>;

export default function CustomEdge({
                                       id,
                                       sourceX,
                                       sourceY,
                                       targetX,
                                       targetY,
                                       sourcePosition,
                                       targetPosition
                                   }: EdgeProps<CustomEdge>) {
    const [edgePath] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetPosition, targetY });

    return <BaseEdge id={id} path={edgePath} />;
}