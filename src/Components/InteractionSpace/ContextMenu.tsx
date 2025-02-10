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
                background: "#f8f9fa", // Light background for modern look
                border: "1px solid #ddd", // Lighter border
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)", // Subtle shadow for depth
                borderRadius: "8px", // Rounded corners for modern touch
                zIndex: 1000,
                padding: "10px",
                minWidth: "180px",
            }}
        >
            <div>
                {options.map((option, index) => (
                    <div
                        key={index}
                        style={{
                            padding: "8px 12px", // Padding for each option
                            cursor: "pointer",
                            transition: "background-color 0.3s ease",
                            borderRadius: "6px", // Round each option slightly
                        }}
                        onClick={() => {
                            option.callback(x, y);
                            onClose();
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f1f1f1"; // Light hover effect
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent"; // Reset on leave
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
