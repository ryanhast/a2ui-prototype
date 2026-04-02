import { MOCK_RESPONSES, DEFAULT_RESPONSE } from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Check if the API is available
async function checkApi() {
  try {
    const res = await fetch("/api/health");
    const data = await res.json();
    return data.hasApiKey;
  } catch {
    return false;
  }
}

// Real orchestration via Claude API
async function orchestrateReal(query, onSummary, onAgentResponse) {
  // Step 1: Orchestrator call - decide what agents to invoke
  const orchRes = await fetch("/api/orchestrate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!orchRes.ok) {
    throw new Error(`Orchestrator failed: ${orchRes.status}`);
  }

  const { summary, agents } = await orchRes.json();
  onSummary(summary);

  // Step 2: Fire all agent calls in parallel
  // Each resolves independently = real staggered arrival
  const agentPromises = agents.map((agent, index) =>
    fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentId: agent.id,
        agentLabel: agent.label,
        instruction: agent.instruction,
        query,
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Agent ${agent.id} failed: ${res.status}`);
        const data = await res.json();
        onAgentResponse(data, index);
        return data;
      })
      .catch((err) => {
        console.error(`Agent ${agent.id} error:`, err);
        onAgentResponse(
          {
            agent: agent.id,
            agentLabel: agent.label,
            status: "error",
            components: [],
          },
          index
        );
      })
  );

  await Promise.all(agentPromises);
  return { summary, agents };
}

// Mock fallback orchestration
async function orchestrateMock(query, onSummary, onAgentResponse) {
  const response = MOCK_RESPONSES[query] || DEFAULT_RESPONSE;

  await delay(600);
  onSummary(response.orchestrator_summary);

  for (let i = 0; i < response.agent_responses.length; i++) {
    await delay(400 + Math.random() * 300);
    onAgentResponse(response.agent_responses[i], i);
  }

  return response;
}

// Main entry point - tries API first, falls back to mock
export async function orchestrate(query, onSummary, onAgentResponse, onAgentSpecs) {
  const hasApi = await checkApi();

  if (hasApi) {
    // Real API mode
    const { agents } = await orchestrateReal(query, onSummary, onAgentResponse);
    // Return agent specs so the UI can set up skeleton placeholders
    return { agents: agents.map((a) => ({ id: a.id, label: a.label })) };
  } else {
    // Mock fallback
    const response = await orchestrateMock(query, onSummary, onAgentResponse);
    return {
      agents: response.agent_responses.map((a) => ({
        id: a.agent,
        label: a.agentLabel,
      })),
    };
  }
}

// Separate function to get orchestrator plan (agents list) before full execution
export async function getOrchestratorPlan(query) {
  const hasApi = await checkApi();

  if (hasApi) {
    const orchRes = await fetch("/api/orchestrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!orchRes.ok) throw new Error(`Orchestrator failed: ${orchRes.status}`);
    return orchRes.json();
  } else {
    const response = MOCK_RESPONSES[query] || DEFAULT_RESPONSE;
    await delay(600);
    return {
      summary: response.orchestrator_summary,
      agents: response.agent_responses.map((a) => ({
        id: a.agent,
        label: a.agentLabel,
        instruction: "",
      })),
      _mockResponses: response.agent_responses,
    };
  }
}

// Execute agent calls in parallel (called after getOrchestratorPlan)
export async function executeAgents(plan, query, onAgentResponse) {
  if (plan._mockResponses) {
    // Mock mode - staggered delivery
    for (let i = 0; i < plan._mockResponses.length; i++) {
      await delay(400 + Math.random() * 300);
      onAgentResponse(plan._mockResponses[i], i);
    }
    return;
  }

  // Real API mode - parallel calls
  const agentPromises = plan.agents.map((agent, index) =>
    fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentId: agent.id,
        agentLabel: agent.label,
        instruction: agent.instruction,
        query,
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Agent ${agent.id} failed: ${res.status}`);
        const data = await res.json();
        onAgentResponse(data, index);
        return data;
      })
      .catch((err) => {
        console.error(`Agent ${agent.id} error:`, err);
        onAgentResponse(
          {
            agent: agent.id,
            agentLabel: agent.label,
            status: "error",
            components: [],
          },
          index
        );
      })
  );

  await Promise.all(agentPromises);
}
