import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/journal-prompt", async (req, res) => {
  const { mood } = req.body;

  if (!mood) {
    return res.status(400).json({
      error: "Mood is required"
    });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Write a short and encouraging journal prompt for someone feeling ${mood}. Return only plain text. Do not use markdown, stars, hashtags, headings, bullet points, or special formatting.`
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", errorData);

      return res.status(500).json({
        error: "Gemini API request failed"
      });
    }

    const data = await response.json();

    const journalPrompt =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!journalPrompt) {
      console.error("Gemini response:", data);

      return res.status(500).json({
        error: "Gemini did not return a journal prompt"
      });
    }

    res.json({
      prompt: journalPrompt
    });

  } catch (error) {
    console.error("Gemini API Error:", error);

    res.status(500).json({
      error: "Failed to generate journal prompt"
    });
  }
});

export default app;