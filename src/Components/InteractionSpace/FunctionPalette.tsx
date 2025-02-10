import { useState } from "react";
import Functions from "../../Entities/InteractionSpace/FunctionsEnum";

const FunctionPalette = () => {
    const [search, setSearch] = useState("");
    const filteredFunctions = Object.keys(Functions)
        .filter(key => isNaN(Number(key))) // Ensure only names, not values
        .filter(name => name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={{ padding: "16px", width: "250px", background: "#f9f9f9", borderRadius: "8px", boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", display: "flex", flexDirection: "column", gap: "10px", border: "1px solid #ddd" }}>
            <input
                type="text"
                placeholder="Search functions..."
                style={{ padding: "8px", background: "#fff", color: "#333", border: "1px solid #ccc", borderRadius: "6px", outline: "none" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px" }}>
                {filteredFunctions.map((fn) => (
                    <div key={fn} style={{ background: "#fff", color: "#333", padding: "10px", textAlign: "center", borderRadius: "6px", cursor: "pointer", transition: "background 0.2s, box-shadow 0.2s", border: "1px solid #ccc" }}
                         onMouseOver={(e) => { e.currentTarget.style.background = "#f0f0f0"; e.currentTarget.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.1)"; }}
                         onMouseOut={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "none"; }}>
                        {fn}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FunctionPalette;
