import "dotenv/config"; // Loads .env variables automatically
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { createClient } from '@supabase/supabase-js';
import session from 'express-session';

const app = express();
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse JSON request bodies

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

const openai = new OpenAI({ apiKey: process.env.API_KEY }); // Correct initialization

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true // Auto-confirm for testing
  });
  
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ user: data.user });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ 
    user: data.user,
    session: data.session
  });
});

app.post('/api/auth/logout', async (req, res) => {
  const { access_token } = req.body;
  const { error } = await supabase.auth.admin.signOut(access_token);
  
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ success: true });
});

// Verify token middleware
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Protected route example
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});

// Proxy endpoint
app.post("/data", async (req, res) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
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

app.post("/agent", async (req, res) => {
    try {
        const { query, selection, selectedRange, spreadsheetData } = req.body;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { 
                    role: "system", 
                    content: `You are an AI assistant analyzing spreadsheet data. 
                              Provide clear, concise insights based on the spreadsheet data provided.
                              Focus on answering the user's query with relevant information from the data.`
                },
                { 
                    role: "user", 
                    content: `
                        Current selection: ${selection}
                        ${selectedRange ? `Selected range: ${selectedRange}` : ''}
                        The spreadsheet contains the following data: 
                        ${spreadsheetData}
                        
                        My question is: ${query}
                    `
                },
            ],
            temperature: 0.7,
        });

        return res.json(completion);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error analyzing spreadsheet data" });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));