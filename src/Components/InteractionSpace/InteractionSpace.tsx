import CellSelectionBox from "./CellSelectionBox";

const InteractionSpace: React.FC = () => {
    return (
        <>
            <CellSelectionBox cellName={"A1"} />
            <div style={{ width: "100%", height: "75vh", border: "1px solid black" }}></div>
        </>
    );
};

export default InteractionSpace;
