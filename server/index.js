import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

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

// Initialize AI services
const geminiKey = process.env.GEMINI_API_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

const ai = geminiKey ? new GoogleGenAI({ apiKey: geminiKey }) : null;
const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;

console.log("🚀 Server startup:");
console.log("  - GEMINI_API_KEY:", geminiKey ? "✅ Loaded" : "❌ Missing");
console.log("  - OPENAI_API_KEY:", openaiKey ? "✅ Loaded" : "❌ Missing");

if (!geminiKey && !openaiKey) {
  console.warn("⚠️  No AI API keys configured. Using fallback responses only.");
}

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
const MODEL_FALLBACKS = [
  DEFAULT_MODEL,
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
  "gemini-2.5-flash-lite-preview-09-2025",
  "gemini-3.1-pro-preview",
];}

async function generateWithOpenAI(prompt, maxTokens = 2000) {\n  if (!openai) throw new Error(\"OpenAI API not configured\");\n  const response = await openai.chat.completions.create({\n    model: \"gpt-3.5-turbo\",\n    messages: [{ role: \"user\", content: prompt }],\n    max_tokens: maxTokens,\n    temperature: 0.7,\n  });\n  return response.choices[0]?.message?.content || \"No response generated\";\n}\n\nfunction fallbackExplain(topic, mode) {\n  const base = {\n    friendly: `Let's explore ${topic} in a friendly and easy way! Imagine it like a story where each part makes sense step-by-step. Here's what you need to know in a relaxed and helpful voice.`,\n    beginner: `Here's ${topic} explained in beginner-friendly terms. Think of it as the simplest version of the idea with clear definitions and examples to help you understand it quickly.`,\n    strict: `${topic} is explained in a technical, accurate way. Focus on the core principles and the structure behind the concept for a precise understanding.`,\n    exam: `This is an exam-style summary of ${topic}. It highlights key definitions, important points, and quick revision notes so you can study efficiently.`,\n  };\n  return base[mode] || base.friendly;\n}

function fallbackQuiz(topic, difficulty) {
  const questions = [
    {
      question: `What is the primary purpose of ${topic}?`,
      options: [
        `To explain the basic idea of ${topic}`,
        `To describe an unrelated concept`,
        `To confuse the learner`,
        `To ignore key details`,
      ],
      answer: `To explain the basic idea of ${topic}`,
    },
    {
      question: `Which statement best describes ${topic}?`,
      options: [
        `It is a core concept used in related fields`,
        `It has no practical use`,
        `It is only a historical term`,
        `It is unrelated to modern learning`,
      ],
      answer: `It is a core concept used in related fields`,
    },
    {
      question: `Which option is typically true about ${topic}?`,
      options: [
        `It provides a framework or method`,
        `It always has a single answer`,
        `It is never applied in real life`,
        `It is always easy to solve`,
      ],
      answer: `It provides a framework or method`,
    },
    {
      question: `What should you focus on when learning ${topic}?`,
      options: [
        `The main ideas and how they connect`,
        `All unrelated trivia`,
        `Only the last sentence`,
        `Nothing at all`,
      ],
      answer: `The main ideas and how they connect`,
    },
    {
      question: `What is the best way to practice ${topic}?`,
      options: [
        `Review examples and solve related problems`,
        `Avoid thinking about it`,
        `Memorize unrelated facts`,
        `Guess without studying`,
      ],
      answer: `Review examples and solve related problems`,
    },
  ];

  return questions.map((question) => ({
    ...question,
    difficulty: difficulty || "medium",
  }));
}

function fallbackVideoSummary(videoLink, summaryType) {
  const summaryPrefix = {
    short: `Quick summary for the video at ${videoLink}:`,
    detailed: `Detailed summary for the video at ${videoLink}:`,
    keypoints: `Key points from the video at ${videoLink}:`,
    exam: `Exam-style summary for the video at ${videoLink}:`,
  };

  return `${summaryPrefix[summaryType] || summaryPrefix.short}

- The video covers the main ideas behind the topic.
- It explains key concepts clearly.
- You should focus on the core points and review examples.
- This summary helps you remember the most important parts quickly.`;
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
      stylePrompt = "Explain in exam-oriented format with definition, key points, and short revision notes.";
    }

    const fullPrompt = `${stylePrompt}\n\nTopic: ${topic}`;
    let answer = null;
    let source = "fallback";

    if (openai) {
      try {
        console.log("[EXPLAIN] Trying OpenAI...");
        answer = await generateWithOpenAI(fullPrompt);
        source = "openai";
        console.log("[EXPLAIN] OpenAI success");
      } catch (error) {
        console.error("[EXPLAIN] OpenAI failed:", error.message);
      }
    }

    if (!answer && ai) {
      try {
        console.log("[EXPLAIN] Trying Gemini...");
        const response = await generateWithRetry(fullPrompt);
        answer = response.text;
        source = "gemini";
        console.log("[EXPLAIN] Gemini success");
      } catch (error) {
        console.error("[EXPLAIN] Gemini failed:", error.message);
      }
    }

    if (!answer) {
      console.log("[EXPLAIN] Using fallback content");
      answer = fallbackExplain(topic.trim(), mode);
      source = "fallback";
    }

    res.json({ answer, source });
  } catch (err) {
    console.error("[EXPLAIN] Unexpected error:", err);
    res.status(500).json({ error: err?.message || "Failed to generate explanation" });
  }
});

app.post("/api/quiz", async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const quizPrompt = `Create 5 ${difficulty || "medium"} multiple-choice questions on the topic: "${topic}".
Return ONLY a valid JSON array with exactly 5 objects (no other text).
Each object must include:
- question (string)
- options (array of exactly 4 strings)
- answer (the correct answer as a string, matching one of the options)
Use ONLY JSON output, no markdown, no extra text.`;

    let answer = null;
    let source = "fallback";

    if (openai) {
      try {
        console.log("[QUIZ] Trying OpenAI...");
        answer = await generateWithOpenAI(quizPrompt, 1500);
        let parsed = null;
        try {
          parsed = JSON.parse(answer);
        } catch {
          parsed = extractJsonArray(answer);
        }
        if (Array.isArray(parsed) && parsed.length > 0) {
          source = "openai";
          console.log("[QUIZ] OpenAI success");
          return res.json({ questions: parsed, source });
        }
      } catch (error) {
        console.error("[QUIZ] OpenAI failed:", error.message);
      }
    }

    if (ai) {
      try {
        console.log("[QUIZ] Trying Gemini...");
        const response = await generateWithRetry(quizPrompt);
        const raw = response.text || "";
        let parsed = null;
        try {
          parsed = JSON.parse(raw);
        } catch {
          parsed = extractJsonArray(raw);
        }
        if (Array.isArray(parsed) && parsed.length > 0) {
          source = "gemini";
          console.log("[QUIZ] Gemini success");
          return res.json({ questions: parsed, source });
        }
      } catch (error) {
        console.error("[QUIZ] Gemini failed:", error.message);
      }
    }

    console.log("[QUIZ] Using fallback questions");
    const fallbackQuestions = fallbackQuiz(topic.trim(), difficulty);
    res.json({ questions: fallbackQuestions, source: "fallback" });
  } catch (err) {
    console.error("[QUIZ] Unexpected error:", err);
    res.status(500).json({ error: err?.message || "Failed to generate quiz" });
  }
});

app.post("/api/video-summary", async (req, res) => {
  try {
    const { videoLink, summaryType } = req.body;

    if (!videoLink || !videoLink.trim()) {
      return res.status(400).json({ error: "Video link is required" });
    }

    if (!isApiKeyConfigured) {
      const summary = fallbackVideoSummary(videoLink.trim(), summaryType);
      return res.json({ summary, fallback: true });
    }

    try {
      const response = await generateWithRetry(`Generate a ${summaryType || "short"} educational summary for this video link:
${videoLink}

If transcript is not available, clearly say that transcript-based summary would be more accurate, then provide a useful topic-based summary based on the video title and content.
Return only the summary text without extra headers.`);

      const summary = response.text || "No summary generated.";
      return res.json({ summary });
    } catch (error) {
      console.error("VIDEO SUMMARY AI ERROR, falling back:", error);
      const summary = fallbackVideoSummary(videoLink.trim(), summaryType);
      return res.json({ summary, fallback: true, warning: "Using fallback summary due to AI service issue." });
    }
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