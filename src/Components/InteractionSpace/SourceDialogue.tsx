import React, { useState, useEffect, useRef } from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../main";
import {getLetterFromNumber} from "../../Entities/General/HelperFunctions";

interface SourceDialogueProps {
    x: number;
    y: number;
    visible: boolean;
    onColumnChange: (value: string) => void;
    onRowChange: (value: number) => void;
    onClose: () => void;
    onConfirm: () => void;
}

const SourceDialogue: React.FC<SourceDialogueProps> = ({ x, y, visible, onColumnChange, onRowChange, onClose, onConfirm }) => {

    const selectedCell = useSelector((state: RootState) => state.globalTableData.selectedCell);

    const [position, setPosition] = useState({ x, y });
    const [dragging, setDragging] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);
    const offset = useRef({ x: 0, y: 0 });

    useEffect(() => {
        setPosition({ x, y });
    }, [x, y]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (dialogRef.current) {
            offset.current = {
                x: e.clientX - dialogRef.current.getBoundingClientRect().left,
                y: e.clientY - dialogRef.current.getBoundingClientRect().top,
            };
        }
        setDragging(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (dragging) {
            setPosition({
                x: e.clientX - offset.current.x,
                y: e.clientY - offset.current.y,
            });
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    useEffect(() => {
        if (dragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging]);

    if (!visible) return null;

    return (
        <div
            ref={dialogRef}
            className="source-dialogue"
            style={{ position: "absolute", top: position.y, left: position.x }}
        >
            <div className="dialogue-header" onMouseDown={handleMouseDown}>
                <span>Select Cell Source</span>
                <button className="close-btn" onClick={onClose}>×</button>
            </div>
            <div className="dialogue-body">
                <label>
                    Column:
                    <input
                        type="text"
                        value={getLetterFromNumber(selectedCell[0] + 1)}
                        onChange={(e) => {
                            const value = e.target.value.toUpperCase();
                            if (/^[A-Z]{0,3}$/.test(value)) { // Allows up to "ZZZ"
                                onColumnChange(value);
                            }
                        }}
                    />
                </label>
                <label>
                    Row:
                    <input
                        type="number"
                        value={selectedCell[1] + 1}
                        onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            if (!isNaN(value) && value > 0) {
                                onRowChange(value);
                            }
                        }}
                        min={1}
                    />
                </label>
            </div>
            <div className="dialogue-footer">
                <button className="ok-btn" onClick={onConfirm}>OK</button>
            </div>
        </div>
    );
};

export default SourceDialogue;
