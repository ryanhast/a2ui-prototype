import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const PORT = 5190;
const MODEL = "claude-sonnet-4-20250514";

// ── System prompt for query classification + data generation ──────────

const QUERY_SYSTEM_PROMPT = `You are an AI assistant inside Gemini Enterprise. When a user asks a question, you determine the best way to present the answer and return structured data designed for a specific layout type.

You MUST return valid JSON with this top-level structure:
{
  "layout_type": "financial" | "checklist" | "calendar" | "people" | "status",
  "summary": "A brief, conversational 1-2 sentence intro",
  "data": { ... }
}

CLASSIFICATION RULES:
- "financial": Revenue, P&L, budgets, costs, financial metrics, sales data, spending analysis
- "checklist": Onboarding, setup guides, to-do lists, step-by-step processes, getting started
- "calendar": Holidays, schedules, deadlines, time-based events, company calendar
- "people": Team info, org structure, who works on what, reporting lines, team directory
- "status": Project health, OKR progress, sprint status, delivery tracking, project updates

DATA SCHEMAS BY LAYOUT TYPE:

### financial
{
  "layout_type": "financial",
  "summary": "...",
  "data": {
    "title": "Q1 2026 profit & loss",
    "period": "Q1 2026",
    "kpis": [
      {
        "label": "Revenue",
        "value": 12400000,
        "format": "currency",
        "trend": "up",
        "trendValue": "+8% YoY",
        "sparkline": [8.1, 8.5, 9.2, 10.1, 11.0, 12.4]
      }
    ],
    "chart": {
      "title": "Monthly revenue vs expenses",
      "months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
      "revenue": [9.8, 10.2, 10.9, 11.4, 12.0, 12.4],
      "expenses": [7.8, 8.0, 8.3, 8.6, 8.9, 9.1]
    },
    "breakdown": [
      { "category": "Engineering", "amount": 4200000, "pct": 46 }
    ],
    "insights": [
      { "text": "Hiring costs up 22%", "sentiment": "neutral" }
    ]
  }
}

### checklist
{
  "layout_type": "checklist",
  "summary": "...",
  "data": {
    "title": "Your first week",
    "greeting": "Welcome aboard",
    "userName": "Sarah",
    "progress": { "completed": 3, "total": 8 },
    "steps": [
      {
        "id": 1,
        "title": "Set up your laptop",
        "description": "Get IT credentials and install tools.",
        "status": "complete",
        "day": "Day 1",
        "estimatedMinutes": null,
        "actions": []
      },
      {
        "id": 4,
        "title": "Join team Slack channels",
        "description": "#design, #cloud-ai",
        "status": "current",
        "day": "Day 3",
        "estimatedMinutes": 5,
        "actions": [{ "label": "Join all channels", "type": "primary" }]
      }
    ]
  }
}

### calendar
{
  "layout_type": "calendar",
  "summary": "...",
  "data": {
    "title": "2026 company holidays",
    "year": 2026,
    "totalDays": 13,
    "nextHoliday": { "name": "Memorial Day", "date": "2026-05-25", "daysAway": 54 },
    "holidays": [
      { "name": "New Year's Day", "date": "2026-01-01", "month": 1, "season": "winter", "past": true }
    ],
    "upcoming": [
      { "name": "Memorial Day", "date": "2026-05-25", "daysAway": 54 }
    ]
  }
}

### people
{
  "layout_type": "people",
  "summary": "...",
  "data": {
    "teamName": "Cloud AI Design",
    "headcount": 12,
    "groups": [
      {
        "name": "Leadership",
        "featured": true,
        "members": [
          {
            "name": "Priya Sharma",
            "title": "Senior director, UX",
            "area": "Gemini Enterprise",
            "location": "Sunnyvale, CA",
            "initials": "PS"
          }
        ]
      }
    ]
  }
}

### status
{
  "layout_type": "status",
  "summary": "...",
  "data": {
    "projectName": "Project Aurora",
    "phase": "Design phase",
    "period": "Q2 2026",
    "overallStatus": "on-track",
    "statusGrid": [
      { "label": "Timeline", "status": "on-track", "detail": "On schedule" }
    ],
    "milestones": [
      { "title": "Research complete", "date": "2026-02-15", "status": "complete" }
    ],
    "risks": [
      {
        "severity": "medium",
        "title": "API spec still in review",
        "description": "Backend team hasn't finalized endpoints.",
        "owner": "Jamie Torres",
        "due": "2026-04-03",
        "action": "Nudge"
      }
    ],
    "recentActivity": [
      { "date": "2026-04-01", "text": "Design review completed", "actor": "Priya S." }
    ]
  }
}

Generate realistic, plausible data. Use real-sounding names, dates, and numbers.
The current date is April 1, 2026.
Return ONLY valid JSON. No markdown, no backticks, no preamble.`;

// ── Server setup ────────────────────────────────────────────────────────

async function startServer() {
  const app = express();
  app.use(express.json());

  // Check for API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn("\n  No ANTHROPIC_API_KEY found in .env file.");
    console.warn("   The app will fall back to mock data.\n");
  }

  const anthropic = apiKey ? new Anthropic({ apiKey }) : null;

  // ── API Routes ──────────────────────────────────────────────────────

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", hasApiKey: !!apiKey });
  });

  // Single query endpoint
  app.post("/api/query", async (req, res) => {
    if (!anthropic) {
      return res.status(503).json({ error: "No API key configured" });
    }

    try {
      const { query } = req.body;
      console.log(`\n  Query: "${query}"`);

      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 4096,
        system: QUERY_SYSTEM_PROMPT,
        messages: [{ role: "user", content: query }],
      });

      const text = response.content[0].text;
      let parsed;
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
      } catch (e) {
        console.error("Failed to parse response:", text.substring(0, 200));
        return res.status(500).json({ error: "Invalid response", raw: text });
      }

      console.log(`   Layout: ${parsed.layout_type}`);
      console.log(`   Summary: ${parsed.summary?.substring(0, 80)}...`);

      res.json(parsed);
    } catch (err) {
      console.error("Query error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // ── Vite dev server middleware ─────────────────────────────────────

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });

  app.use(vite.middlewares);

  // ── Start ─────────────────────────────────────────────────────────

  app.listen(PORT, () => {
    console.log(`\n  A2UI server running at http://localhost:${PORT}`);
    if (apiKey) {
      console.log(`   Anthropic API: connected (${MODEL})`);
    } else {
      console.log(`   Anthropic API: not configured (mock mode)`);
    }
    console.log();
  });
}

startServer().catch(console.error);
