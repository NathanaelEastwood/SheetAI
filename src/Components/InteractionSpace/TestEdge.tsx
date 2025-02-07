import {
    getStraightPath,
    BaseEdge,
    type EdgeProps,
    type Edge, getSmoothStepPath,
} from '@xyflow/react';

type CustomEdge = Edge<{ value: number }, 'custom'>;

export default function CustomEdge({
                                       id,
                                       sourceX,
                                       sourceY,
                                       targetX,
                                       targetY,
                                   }: EdgeProps<CustomEdge>) {
    const [edgePath] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY });

    return <BaseEdge id={id} path={edgePath} />;
}