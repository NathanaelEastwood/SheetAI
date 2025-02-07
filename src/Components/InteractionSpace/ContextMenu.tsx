import React, { useEffect, useRef } from "react";
import ContextMenuOption from "../../Entities/InteractionSpace/ContextMenuOption";

interface ContextMenuProps {
    x: number;
    y: number;
    visible: boolean;
    options: ContextMenuOption[];
    onClose: () => void; // callback to close the menu
}

const ContextMenu: React.FC<ContextMenuProps> = ({
                                                     x,
                                                     y,
                                                     visible,
                                                     options,
                                                     onClose,
                                                 }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    // Listen for clicks outside the menu to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // If clicking outside the menu, trigger onClose
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (visible) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [visible, onClose]);

    return (
        <div
            ref={menuRef}
            style={{
                visibility: visible ? "visible" : "hidden",
                position: "absolute",
                top: y,
                left: x,
                background: "white",
                border: "1px solid #ccc",
                boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
                padding: "8px",
                borderRadius: "4px",
                zIndex: 1000,
            }}
        >
            <div>
                {options.map((option, index) => (
                    <div
                        key={index}
                        style={{ padding: "4px 8px", cursor: "pointer" }}
                        onClick={() => {
                            option.callback(x, y);
                            onClose();
                        }}
                    >
                        {option.value}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContextMenu;
