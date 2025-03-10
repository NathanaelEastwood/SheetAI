import "dotenv/config"; // Loads .env variables automatically
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse JSON request bodies

const openai = new OpenAI({ apiKey: process.env.API_KEY }); // Correct initialization

// Proxy endpoint
app.post("/data", async (req, res) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "o3-mini",
            messages: [
                { role: "system", content: "You are an AI designed to write Excel-style formulas. Only respond with the exact Excel formula requested and nothing else. Do not provide quotation marks in the response" },
                { role: "user", content: JSON.stringify(req.body) }, // Ensure the body is a string
            ],
            store: true,
        });

        return res.json(completion);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error fetching data" });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
