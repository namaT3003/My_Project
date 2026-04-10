import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${stylePrompt}\n\nTopic: ${topic}`,
    });

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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create 5 ${difficulty || "medium"} MCQs on "${topic}".
Return valid JSON array only.
Each object must have:
- question
- options (array of 4 strings)
- answer`,
    });

    const raw = response.text || "[]";

    let quiz;
    try {
      quiz = JSON.parse(raw);
    } catch {
      quiz = [
        {
          question: `What is an important idea in ${topic}?`,
          options: ["Concept", "Random", "Noise", "Nothing"],
          answer: "Concept",
        },
      ];
    }

    res.json({ quiz });
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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Give a ${summaryType || "short"} educational summary for this video link:
${videoLink}

If exact transcript is unavailable, clearly say that transcript-based summary would be more accurate, then provide a useful topic-based learning summary.`,
    });

    const summary = response.text || "No summary generated.";
    res.json({ summary });
  } catch (err) {
    console.error("VIDEO SUMMARY ERROR:", err);
    res.status(500).json({
      error: err?.message || "Failed to generate video summary",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("GEMINI_API_KEY loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");
});