export const EXAMPLE_PROMPTS = [
  "Show me last quarter's P&L",
  "I'm starting Monday, what do I need to do?",
  "What are the company holidays this year?",
  "Who's on the Cloud AI design team?",
  "How's Project Aurora doing?",
];

const financialResponse = {
  layout_type: "financial",
  summary:
    "Here's your Q1 2026 profit and loss summary. Revenue grew 8% year-over-year to $12.4M, while expenses rose a modest 3%, resulting in net income of $3.3M, an 18% improvement.",
  data: {
    title: "Q1 2026 profit & loss",
    period: "Q1 2026",
    kpis: [
      {
        label: "Revenue",
        value: 12400000,
        format: "currency",
        trend: "up",
        trendValue: "+8% YoY",
        sparkline: [8.1, 8.5, 9.2, 10.1, 11.0, 12.4],
      },
      {
        label: "Expenses",
        value: 9100000,
        format: "currency",
        trend: "up",
        trendValue: "+3% YoY",
        sparkline: [7.2, 7.5, 7.8, 8.2, 8.8, 9.1],
      },
      {
        label: "Net income",
        value: 3300000,
        format: "currency",
        trend: "up",
        trendValue: "+18% YoY",
        sparkline: [0.9, 1.0, 1.4, 1.9, 2.2, 3.3],
      },
    ],
    chart: {
      title: "Monthly revenue vs expenses",
      months: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
      revenue: [9.8, 10.2, 10.9, 11.4, 12.0, 12.4],
      expenses: [7.8, 8.0, 8.3, 8.6, 8.9, 9.1],
    },
    breakdown: [
      { category: "Engineering", amount: 4200000, pct: 46 },
      { category: "Sales & marketing", amount: 2100000, pct: 23 },
      { category: "Cloud infrastructure", amount: 1400000, pct: 15 },
      { category: "G&A", amount: 900000, pct: 10 },
      { category: "R&D (other)", amount: 500000, pct: 6 },
    ],
    insights: [
      { text: "Hiring costs up 22% driven by Cloud AI expansion", sentiment: "neutral" },
      { text: "Infrastructure spend down 8% due to efficiency gains", sentiment: "positive" },
      { text: "Marketing spend flat quarter-over-quarter", sentiment: "neutral" },
      { text: "Net margin improved from 21% to 27%", sentiment: "positive" },
    ],
  },
};

const checklistResponse = {
  layout_type: "checklist",
  summary:
    "Welcome to the team. Here's everything you need to get set up in your first week. You're making great progress with 3 of 8 items already complete.",
  data: {
    title: "Your first week",
    greeting: "Welcome aboard",
    userName: "Sarah",
    progress: { completed: 3, total: 8 },
    steps: [
      {
        id: 1,
        title: "Set up your laptop",
        description: "Get IT credentials, install required tools, and configure VPN access.",
        status: "complete",
        day: "Day 1",
        estimatedMinutes: null,
      },
      {
        id: 2,
        title: "Meet your manager",
        description: "30-minute intro call with Jordan. They'll walk you through team goals and your first project.",
        status: "complete",
        day: "Day 1",
        estimatedMinutes: null,
      },
      {
        id: 3,
        title: "Complete compliance training",
        description: "Three modules covering security, data privacy, and code of conduct.",
        status: "complete",
        day: "Day 2",
        estimatedMinutes: 45,
      },
      {
        id: 4,
        title: "Join team Slack channels",
        description: "#cloud-ai-design, #design-system, #social, #shipped",
        status: "current",
        day: "Day 3",
        estimatedMinutes: 5,
        actions: [{ label: "Join all channels", type: "primary" }],
      },
      {
        id: 5,
        title: "Read the team wiki",
        description: "Design principles, component guidelines, and project history.",
        status: "upcoming",
        day: "Day 3",
        estimatedMinutes: 30,
      },
      {
        id: 6,
        title: "Set up 1:1s with your peers",
        description: "Schedule 30-minute coffee chats with each teammate. Jordan will share the list.",
        status: "upcoming",
        day: "Day 4",
        estimatedMinutes: null,
      },
      {
        id: 7,
        title: "First project briefing",
        description: "Sit in on the Aurora project sync and get context on your first assignment.",
        status: "upcoming",
        day: "Day 5",
        estimatedMinutes: 60,
      },
      {
        id: 8,
        title: "30-day check-in with manager",
        description: "Reflect on your first month. Jordan will set this up.",
        status: "upcoming",
        day: "Week 4",
        estimatedMinutes: null,
      },
    ],
  },
};

const calendarResponse = {
  layout_type: "calendar",
  summary:
    "Your company observes 13 holidays in 2026. The next one is Memorial Day on May 25, which is 54 days away.",
  data: {
    title: "2026 company holidays",
    year: 2026,
    totalDays: 13,
    nextHoliday: {
      name: "Memorial Day",
      date: "2026-05-25",
      daysAway: 54,
    },
    holidays: [
      { name: "New Year's Day", date: "2026-01-01", month: 1, season: "winter", past: true },
      { name: "MLK Jr. Day", date: "2026-01-19", month: 1, season: "winter", past: true },
      { name: "Presidents' Day", date: "2026-02-16", month: 2, season: "winter", past: true },
      { name: "Memorial Day", date: "2026-05-25", month: 5, season: "spring", past: false },
      { name: "Juneteenth", date: "2026-06-19", month: 6, season: "summer", past: false },
      { name: "Independence Day", date: "2026-07-03", month: 7, season: "summer", past: false },
      { name: "Labor Day", date: "2026-09-07", month: 9, season: "summer", past: false },
      { name: "Indigenous Peoples' Day", date: "2026-10-12", month: 10, season: "fall", past: false },
      { name: "Veterans Day", date: "2026-11-11", month: 11, season: "fall", past: false },
      { name: "Thanksgiving", date: "2026-11-26", month: 11, season: "fall", past: false },
      { name: "Day after Thanksgiving", date: "2026-11-27", month: 11, season: "fall", past: false },
      { name: "Christmas Eve", date: "2026-12-24", month: 12, season: "winter", past: false },
      { name: "Christmas Day", date: "2026-12-25", month: 12, season: "winter", past: false },
    ],
    upcoming: [
      { name: "Memorial Day", date: "2026-05-25", daysAway: 54 },
      { name: "Juneteenth", date: "2026-06-19", daysAway: 79 },
      { name: "Independence Day", date: "2026-07-03", daysAway: 93 },
      { name: "Labor Day", date: "2026-09-07", daysAway: 159 },
    ],
  },
};

const peopleResponse = {
  layout_type: "people",
  summary:
    "The Cloud AI Design team has 12 people across three functions: design, research, and design engineering. The team is led by Priya Sharma.",
  data: {
    teamName: "Cloud AI Design",
    headcount: 12,
    groups: [
      {
        name: "Leadership",
        featured: true,
        members: [
          {
            name: "Priya Sharma",
            title: "Senior director, UX",
            area: "Gemini Enterprise",
            location: "Sunnyvale, CA",
            initials: "PS",
          },
        ],
      },
      {
        name: "Design",
        featured: false,
        members: [
          { name: "Alex Chen", title: "Staff designer", area: "Model Garden", initials: "AC" },
          { name: "Maya Johnson", title: "Senior designer", area: "Vertex AI", initials: "MJ" },
          { name: "Leo Kim", title: "Designer", area: "Agent Builder", initials: "LK" },
          { name: "Sofia Reyes", title: "Designer", area: "Notebooks", initials: "SR" },
        ],
      },
      {
        name: "Research",
        featured: false,
        members: [
          { name: "James Okafor", title: "Senior UX researcher", area: "Generative AI", initials: "JO" },
          { name: "Nadia Petrova", title: "UX researcher", area: "Enterprise workflows", initials: "NP" },
          { name: "Raj Mehta", title: "UX researcher", area: "Developer experience", initials: "RM" },
        ],
      },
      {
        name: "Design engineering",
        featured: false,
        members: [
          { name: "Tomoko Hayashi", title: "Senior design engineer", area: "Design systems", initials: "TH" },
          { name: "Ben Adler", title: "Design engineer", area: "Prototyping", initials: "BA" },
          { name: "Ines Morales", title: "Design engineer", area: "Motion & interaction", initials: "IM" },
        ],
      },
    ],
  },
};

const statusResponse = {
  layout_type: "status",
  summary:
    "Project Aurora is on track overall. Design sprint 2 wraps this week. One scope risk: the API spec is still pending review.",
  data: {
    projectName: "Project Aurora",
    phase: "Design phase",
    period: "Q2 2026",
    overallStatus: "on-track",
    statusGrid: [
      { label: "Timeline", status: "on-track", detail: "On schedule" },
      { label: "Budget", status: "on-track", detail: "82% used" },
      { label: "Scope", status: "at-risk", detail: "1 open risk" },
      { label: "Team health", status: "on-track", detail: "Good" },
    ],
    milestones: [
      { title: "Research complete", date: "2026-02-15", status: "complete" },
      { title: "Design sprint 1", date: "2026-03-01", status: "complete" },
      { title: "Design sprint 2", date: "2026-03-30", status: "current" },
      { title: "Eng handoff", date: "2026-04-15", status: "upcoming" },
      { title: "Beta launch", date: "2026-05-01", status: "upcoming" },
      { title: "GA release", date: "2026-06-15", status: "upcoming" },
    ],
    risks: [
      {
        severity: "medium",
        title: "API spec still in review",
        description: "Backend team hasn't finalized the v2 endpoints. This could delay eng handoff by a week.",
        owner: "Jamie Torres",
        due: "2026-04-03",
        action: "Nudge",
      },
    ],
    recentActivity: [
      { date: "2026-04-01", text: "Design review completed", actor: "Priya S." },
      { date: "2026-03-28", text: "Sprint 2 kicked off", actor: "Alex C." },
      { date: "2026-03-25", text: "Stakeholder feedback incorporated", actor: "Maya J." },
      { date: "2026-03-22", text: "User testing round 2 finished", actor: "James O." },
      { date: "2026-03-18", text: "Sprint 1 retrospective", actor: "Priya S." },
    ],
  },
};

export const MOCK_RESPONSES = {
  "Show me last quarter's P&L": financialResponse,
  "I'm starting Monday, what do I need to do?": checklistResponse,
  "What are the company holidays this year?": calendarResponse,
  "Who's on the Cloud AI design team?": peopleResponse,
  "How's Project Aurora doing?": statusResponse,
};

export const DEFAULT_RESPONSE = financialResponse;
