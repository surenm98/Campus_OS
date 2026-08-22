require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.AI_PORT || 3001;

// ── Middleware ──────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const localOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
];

app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : localOrigins,
  methods: ["GET", "POST"],
}));
app.use(express.json());

// ── Groq client ────────────────────────────────────────────
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

if (!GROQ_API_KEY) {
  console.warn("⚠️  GROQ_API_KEY not set — AI responses will use mock fallbacks.");
}

// ── Helper: call Groq ──────────────────────────────────────
async function callGroq(messages, maxTokens = 1024) {
  if (!GROQ_API_KEY) return null;

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || null;
}

// ── POST /api/ai/chat ──────────────────────────────────────
// Body: { messages: [{ role: "system"|"user"|"assistant", content: "..." }] }
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const text = await callGroq(messages);

    if (text) {
      return res.json({
        choices: [{ message: { role: "assistant", content: text } }],
      });
    }

    // ── Fallback mock responses when API key is not set ─────
    const lastUserMsg = messages.filter((m) => m.role === "user").pop()?.content?.toLowerCase() || "";
    let mockResponse = "I'm here to help! How can I assist you today?";

    if (lastUserMsg.includes("attendance")) {
      mockResponse = "Your attendance is at 82% — you're in the safe zone! Aim to attend all classes this week to push it above 85%.";
    } else if (lastUserMsg.includes("exam") || lastUserMsg.includes("study")) {
      mockResponse = "Your exam score is 71% — your biggest opportunity right now. Try a 25-minute flashcard session each morning this week.";
    } else if (lastUserMsg.includes("assignment")) {
      mockResponse = "Assignments are at 76%. Submit your pending work before the weekend to improve this score.";
    } else if (lastUserMsg.includes("project")) {
      mockResponse = "Projects are your strongest area at 88% — great work! Keep the momentum going.";
    } else if (lastUserMsg.includes("check") || lastUserMsg.includes("message")) {
      mockResponse = "Hi, I noticed you've missed a few recent sessions — is everything okay? I'd love to connect during office hours to see if I can help.";
    } else if (lastUserMsg.includes("leave") || lastUserMsg.includes("approve")) {
      mockResponse = "This is a first-time request with valid documentation. Recommend approval.";
    } else if (lastUserMsg.includes("incident") || lastUserMsg.includes("cluster") || lastUserMsg.includes("triage")) {
      mockResponse = "2 active clusters today. Priority: Hostel C lighting — high footfall area at night. Recommend dispatching maintenance before 10 PM.";
    } else if (lastUserMsg.includes("wellbeing") || lastUserMsg.includes("counselor") || lastUserMsg.includes("checkin")) {
      mockResponse = "This student shows signs of academic stress. Approach with empathy; check whether workload, personal factors, or both are involved.";
    } else if (lastUserMsg.includes("child") || lastUserMsg.includes("son") || lastUserMsg.includes("daughter") || lastUserMsg.includes("how is")) {
      mockResponse = "Your child is doing well this week! Attendance is at 90%, all assignments submitted on time, and their participation score has improved.";
    } else if (lastUserMsg.includes("fee") || lastUserMsg.includes("payment")) {
      mockResponse = "The next fee instalment of ₹18,500 is due on 30 Aug. The previous payment was processed successfully. No overdue amounts.";
    } else if (lastUserMsg.includes("alert") || lastUserMsg.includes("response")) {
      mockResponse = "Send one guard immediately. Conduct a verbal check-in with the student. If no response within 5 minutes, escalate to senior warden.";
    } else if (lastUserMsg.includes("pattern") || lastUserMsg.includes("tonight") || lastUserMsg.includes("patrol")) {
      mockResponse = "Tonight's pattern shows 65% of alerts originating near Hostel B & C. Recommend repositioning one patrol guard from 9 PM onwards.";
    } else if (lastUserMsg.includes("route") || lastUserMsg.includes("safe") || lastUserMsg.includes("path") || lastUserMsg.includes("walk")) {
      mockResponse = "Safe route recommended: Take the Main Walkway via Admin Block. Avoid the east path near Block D — low lighting reported tonight.";
    }

    return res.json({
      choices: [{ message: { role: "assistant", content: mockResponse } }],
    });
  } catch (error) {
    console.error("AI error:", error?.message || error);
    res.status(500).json({ error: "AI service error", details: error?.message });
  }
});

// ── Health check ───────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", provider: "groq", apiKey: !!GROQ_API_KEY, model: GROQ_MODEL });
});

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Campus OS AI Backend running on http://localhost:${PORT}`);
  console.log(`   Provider:   Groq (${GROQ_MODEL})`);
  console.log(`   API Key:    ${GROQ_API_KEY ? "✅ Connected" : "⚠️  Mock mode (no API key)"}`);
  console.log(`   Health:     http://localhost:${PORT}/health\n`);
});
