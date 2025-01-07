import {useState} from "react";

const Sidebar: React.FC = () => {
    const [height, setWidth] = useState<number>(50);
    const [startingNumber, setStartingLetter] = useState<number>(0);
    return (
        <canvas></canvas>
    )
}

export default Sidebar