import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import React from 'react';
import FunctionNodeParameters from "../../Entities/InteractionSpace/FunctionNodeParameters";

export default function ModernFunctionNode({ data, isConnectable }: NodeProps<FunctionNodeParameters>) {
    // Define the minimum gap between handles.
    const MIN_HANDLE_GAP = 20;

    // Calculate the minimum required height for each side.
    // For more than one handle, the required height is the number of gaps * gap size.
    // For a single handle, we default to a minimal height (20px in this case).
    const minLeftHeight = data.inputNodes > 1 ? (data.inputNodes - 1) * MIN_HANDLE_GAP : 20;
    const minRightHeight = data.outputNodes > 1 ? (data.outputNodes - 1) * MIN_HANDLE_GAP : 20;

    // Use the maximum of the provided height and the minimal required heights.
    const finalHeight = Math.max(data.height, minLeftHeight, minRightHeight);

    // Calculate the offsets so the handles are evenly distributed.
    const leftOffsets = calculateOffsets(data.inputNodes, finalHeight);
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
                        fontStyle: "14px Segoe UI, Roboto, sans-serif"
                    }}
                    isConnectable={isConnectable}
                    className="handle handle-left"
                />
            ))}

            <div className="content" style={{ height: `${finalHeight}px` }}>
                {data.inputLabels.map((value, index) => (
                    <div
                        key={`input-label-${index}-${data.label}`}
                        style={{
                        position: "absolute",
                        top: leftOffsets[index] + 5,
                        left: 7,
                        fontStyle: "14px Segoe UI, Roboto, sans-serif"
                    }}>
                        {value}
                    </div>
                    ))}
                <label htmlFor="text">{data.label}</label>
                {data.outputLabels.map((value, index) => (
                    <div
                        key={`output-label-${index}-${data.label}`}
                        style={{
                            position: "absolute",
                            top: rightOffsets[index] + 5,
                            right: 5,
                            fontStyle: "14px Segoe UI, Roboto, sans-serif"
                        }}>
                        {value}
                    </div>
                ))}
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
