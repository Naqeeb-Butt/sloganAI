import express from "express";
import path from "path";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

// Replace with your Gemini API key
const GEMINI_API_KEY = "AIzaSyC4N2-8iJo75_yw6Yhzcdf0RVTvKNuv6KM";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the public folder
app.use(express.static(path.join(process.cwd(), "public")));

// Endpoint to generate slogans
app.post("/generate-slogans", async (req, res) => {
    try {
        const { description, variants, tone } = req.body;

        if (!description || !variants || !tone) {
            return res.status(400).json({ error: "All fields (description, variants, tone) are required." });
        }

        // <— FIX: use a template literal for text
        const payload = {
            contents: [
                {
                    parts: [
                        {
                            text: `Generate ${variants} creative and catchy slogans for the following description. Ensure the tone is ${tone}: "${description}"`,
                        },
                    ],
                },
            ],
        };

        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API error:", errorText);
            return res.status(response.status).json({ error: "Failed to generate slogans from the Gemini API." });
        }

        const data = await response.json();

        if (!data?.candidates || data.candidates.length === 0) {
            return res.json({ slogans: ["No slogans generated."] });
        }

        const text = data.candidates[0]?.content?.parts?.[0]?.text || "No text available.";

        // Clean up the text by removing double numbering (e.g., "1. 1." -> "1.")
        const cleanedText = text.replace(/(\d+)\. (\d+)\./g, '$1.'); // Fix double numbering

        // Split the cleaned text by new lines and filter out empty strings
        const slogans = cleanedText.split("\n").filter(Boolean);

        res.json({ slogans });
    } catch (error) {
        console.error("Error generating slogans:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// <— FIX: use quotes/backticks in console.log
app.listen(3000, '127.0.0.1', () => {
    console.log('Server is running at http://127.0.0.1:3000');
});
