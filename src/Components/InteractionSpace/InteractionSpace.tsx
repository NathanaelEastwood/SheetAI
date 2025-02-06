import CellSelectionBox from "./CellSelectionBox";
import {createEditor} from "../../Entities/InteractionSpace/Editor";
import {useRete} from "rete-react-plugin";

const InteractionSpace: React.FC = () => {
    const [ref] = useRete(createEditor);

    return (
        <>
            <CellSelectionBox cellName={"A1"} />
            <div ref={ref} style={{ width: "100%", height: "75vh", border: "1px solid black" }}></div>
        </>
    );
};

export default InteractionSpace;
