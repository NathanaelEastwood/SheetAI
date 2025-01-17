interface HighlightCoordinates {
    left: number,
    right: number,
    top: number,
    bottom: number,
}

const CellHighlighter: React.FC<HighlightCoordinates> = (highlightCoordinates: HighlightCoordinates) => {

    const cellWidth = highlightCoordinates.right - highlightCoordinates.left;
    const cellHeight = highlightCoordinates.bottom - highlightCoordinates.top;

    return (
        <div style={{
            position: "absolute",
            top: `${highlightCoordinates.top}px`,
            left: `${highlightCoordinates.left}px`,
            width: `${cellWidth}px`,
            height: `${cellHeight}px`,
            border: "2px solid",
            borderColor: "#6495ED",
            pointerEvents: "none"
        }}>
        </div>
    )
}

export default CellHighlighter;