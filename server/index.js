import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5175",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy does not allow access from this origin."));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
const MODEL_FALLBACKS = [
  DEFAULT_MODEL,
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
  "gemini-2.5-flash-lite-preview-09-2025",
  "gemini-3.1-pro-preview",
];

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set. Please add it to server/.env.");
}

function extractJsonArray(text) {
  const match = text.match(/(\[.*\])/s);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

async function generateWithRetry(prompt) {
  const errors = [];

  for (const model of MODEL_FALLBACKS) {
    if (!model) continue;

    const modelName = model;
    const maxAttempts = 2;
    let lastError;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        return await ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });
      } catch (error) {
        lastError = error;
        const message = error?.message || String(error).toLowerCase();
        const retryable = message.includes("unavailable") || message.includes("503") || message.includes("high demand") || message.includes("rate limit") || message.includes("quota");

        if (attempt < maxAttempts && retryable) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
          continue;
        }

        errors.push({ model: modelName, error });
        break;
      }
    }
  }

  const last = errors[errors.length - 1];
  const errorMessage = last?.error?.message || "Failed to generate AI response.";
  const err = new Error(`AI generation failed: ${errorMessage}`);
  err.details = errors;
  throw err;
}

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.get("/api/health", (req, res) => {
  res.json({ message: "Server working" });
});

app.post("/api/explain", async (req, res) => {
  try {
    const { topic, mode } = req.body;

    console.log("EXPLAIN BODY:", req.body);

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "Topic is required" });
    }

    let stylePrompt = "Explain clearly in a student-friendly way.";

    if (mode === "beginner") {
      stylePrompt = "Explain in very simple words for a beginner student.";
    } else if (mode === "friendly") {
      stylePrompt = "Explain in an easy, fun, student-friendly way with examples.";
    } else if (mode === "strict") {
      stylePrompt = "Explain in a technical, formal and precise way.";
    } else if (mode === "exam") {
      stylePrompt =
        "Explain in exam-oriented format with definition, key points, and short revision notes.";
    }

    const response = await generateWithRetry(`${stylePrompt}\n\nTopic: ${topic}`);
    const answer = response.text;

    if (!answer || !answer.trim()) {
      return res.status(500).json({ error: "No answer generated" });
    }

    res.json({ answer });
  } catch (err) {
    console.error("EXPLAIN ERROR:", err);
    res.status(500).json({
      error: err?.message || "Failed to generate explanation",
    });
  }
});

app.post("/api/quiz", async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const response = await generateWithRetry(`Create 5 ${difficulty || "medium"} multiple-choice questions on the topic: "${topic}".
Return only a valid JSON array with 5 objects.
Each object must include:
- question
- options (array of 4 strings)
- answer (the correct answer string)
Do not include any text before or after the JSON array.
Use only JSON output.
Example:
[
  {
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "answer": "..."
  }
]`);

    const raw = response.text || "";
    let questions = null;

    try {
      questions = JSON.parse(raw);
    } catch {
      questions = extractJsonArray(raw);
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(500).json({
        error: "AI returned invalid quiz data. Please try again.",
        rawResponse: raw,
      });
    }

    res.json({ questions });
  } catch (err) {
    console.error("QUIZ ERROR:", err);
    res.status(500).json({
      error: err?.message || "Failed to generate quiz",
    });
  }
});

app.post("/api/video-summary", async (req, res) => {
  try {
    const { videoLink, summaryType } = req.body;

    if (!videoLink || !videoLink.trim()) {
      return res.status(400).json({ error: "Video link is required" });
    }

    const response = await generateWithRetry(`Generate a ${summaryType || "short"} educational summary for this video link:
${videoLink}

If transcript is not available, clearly say that transcript-based summary would be more accurate, then provide a useful topic-based summary based on the video title and content.
Return only the summary text without extra headers.`);

    const summary = response.text || "No summary generated.";
    res.json({ summary });
  } catch (err) {
    console.error("VIDEO SUMMARY ERROR:", err);
    res.status(500).json({
      error: err?.message || "Failed to generate video summary",
    });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("GEMINI_API_KEY loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Make sure no other backend instance is running and retry.`);
  } else {
    console.error("Server error:", err);
  }
  process.exit(1);
});