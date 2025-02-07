import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import React from 'react';

type FunctionNodeType = Node<{ number: number }, 'number'>;

export default function ModernFunctionNode({ data, isConnectable }: NodeProps<FunctionNodeType>) {
    return (
        <div className="modern-function-node">
            {/* Left side connection */}
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                className="handle handle-left"
            />
            <div className="content">
                <label htmlFor="text">Text:</label>
                <input
                    id="text"
                    name="text"
                    className="input-field"
                    placeholder="Enter text..."
                />
            </div>
            {/* Right side connection */}
            <Handle
                type="source"
                position={Position.Right}
                id="output"
                isConnectable={isConnectable}
                className="handle handle-right"
            />
        </div>
    );
}
