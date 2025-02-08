import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import React from 'react';

type FunctionNodeType = Node<{
    number: number;
    label: string;
    height: number;
    intakeNodes: number;
    outputNodes: number;
}, 'number'>;

export default function ModernFunctionNode({ data, isConnectable }: NodeProps<FunctionNodeType>) {
    // Define the minimum gap between handles.
    const MIN_HANDLE_GAP = 20;

    // Calculate the minimum required height for each side.
    // For more than one handle, the required height is the number of gaps * gap size.
    // For a single handle, we default to a minimal height (20px in this case).
    const minLeftHeight = data.intakeNodes > 1 ? (data.intakeNodes - 1) * MIN_HANDLE_GAP : 20;
    const minRightHeight = data.outputNodes > 1 ? (data.outputNodes - 1) * MIN_HANDLE_GAP : 20;

    // Use the maximum of the provided height and the minimal required heights.
    const finalHeight = Math.max(data.height, minLeftHeight, minRightHeight);

    // Calculate the offsets so the handles are evenly distributed.
    const leftOffsets = calculateOffsets(data.intakeNodes, finalHeight);
    const rightOffsets = calculateOffsets(data.outputNodes, finalHeight);

    return (
        <div className="modern-function-node">
            {/* Left side connections */}
            {leftOffsets.map((offset, index) => (
                <Handle
                    id={`input-${index}-${data.label}`}
                    key={`input-${index}-${data.label}`}
                    type="target"
                    position={Position.Left}
                    style={{
                        width: '10px',
                        height: '10px',
                        top: `${offset + 15}px`,
                    }}
                    isConnectable={isConnectable}
                    className="handle handle-left"
                />
            ))}

            <div className="content" style={{ height: `${finalHeight}px` }}>
                <label htmlFor="text">{data.label}</label>
            </div>

            {/* Right side connections */}
            {rightOffsets.map((offset, index) => (
                <Handle
                    id={`output-${index}-${data.label}`}
                    key={`output-${index}-${data.label}`}
                    type="source"
                    position={Position.Right}

                    style={{
                        width: '10px',
                        height: '10px',
                        top: `${offset + 15}px`,
                    }}
                    isConnectable={isConnectable ?? true}
                    className="handle handle-right"
                />
            ))}
        </div>
    );
}

/**
 * Calculates vertical offsets for a given number of handles so that
 * they are evenly distributed over a container of a specified height.
 *
 * If there is only one handle, it is centered.
 */
function calculateOffsets(numberOfHandles: number, containerHeight: number): number[] {
    if (numberOfHandles <= 0) return [];
    if (numberOfHandles === 1) return [containerHeight / 2];
    const separation = containerHeight / (numberOfHandles - 1);
    return Array.from({ length: numberOfHandles }, (_, i) => i * separation);
}
