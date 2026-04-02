import { MOCK_RESPONSES, DEFAULT_RESPONSE, EXAMPLE_PROMPTS } from "./mockData";

let hasApiKey = null;

async function checkApiKey() {
  if (hasApiKey !== null) return hasApiKey;
  try {
    const res = await fetch("/api/health");
    const data = await res.json();
    hasApiKey = data.hasApiKey;
    return hasApiKey;
  } catch {
    hasApiKey = false;
    return false;
  }
}

function findMockResponse(query) {
  // Exact match
  if (MOCK_RESPONSES[query]) return MOCK_RESPONSES[query];

  // Fuzzy match by keywords
  const q = query.toLowerCase();
  for (const [key, value] of Object.entries(MOCK_RESPONSES)) {
    const k = key.toLowerCase();
    const qWords = q.split(/\s+/).filter((w) => w.length > 3);
    const kWords = k.split(/\s+/).filter((w) => w.length > 3);
    const overlap = qWords.filter((w) => kWords.some((kw) => kw.includes(w) || w.includes(kw)));
    if (overlap.length >= 2) return value;
  }

  // Keyword-based classification fallback
  if (q.match(/p&l|profit|loss|revenue|financ|budget|spend|cost|quarter/)) {
    return MOCK_RESPONSES[EXAMPLE_PROMPTS[0]];
  }
  if (q.match(/onboard|new|start|first day|setup|getting started|need to do/)) {
    return MOCK_RESPONSES[EXAMPLE_PROMPTS[1]];
  }
  if (q.match(/holiday|calendar|day.?off|vacation|time.?off|schedule/)) {
    return MOCK_RESPONSES[EXAMPLE_PROMPTS[2]];
  }
  if (q.match(/team|who|people|org|directory|report/)) {
    return MOCK_RESPONSES[EXAMPLE_PROMPTS[3]];
  }
  if (q.match(/status|project|progress|health|sprint|milestone|aurora/)) {
    return MOCK_RESPONSES[EXAMPLE_PROMPTS[4]];
  }

  return null;
}

export async function queryA2UI(query) {
  // Always try mock first — instant response for known queries
  const mock = findMockResponse(query);
  if (mock) {
    return { ...mock };
  }

  // Only hit the API for queries we don't have mock data for
  const apiAvailable = await checkApiKey();

  if (apiAvailable) {
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      return data;
    } catch (err) {
      console.warn("API call failed, falling back to default mock:", err.message);
    }
  }

  return { ...DEFAULT_RESPONSE };
}
