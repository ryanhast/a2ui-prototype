// This registry is the A2UI contract between agents and the host app.
// It's included in every agent's system prompt so the LLM knows what it can render.
// Agents can ONLY use component types listed here.

export const COMPONENT_REGISTRY = `
## Available Component Types

You must return a JSON array of components. Each component has a "type" and "props" object.
Use ONLY these types. Pick the types that best communicate your analysis.

### metric-card
A single KPI with trend indicator. Use for headline numbers.
\`\`\`json
{
  "type": "metric-card",
  "props": {
    "label": "Total revenue",
    "value": "$4.2M",
    "trend": "up",
    "trendValue": "+18% YoY"
  }
}
\`\`\`
- label: short descriptor (2-4 words)
- value: the main number/metric (formatted, e.g. "$4.2M", "87%", "142")
- trend: "up" | "down" | "neutral"
- trendValue: context string (e.g. "+18% YoY", "On target", "-3pp vs Q1")

### data-table
A sortable data table. Use when showing structured records.
\`\`\`json
{
  "type": "data-table",
  "props": {
    "columns": [
      { "key": "name", "label": "Name" },
      { "key": "status", "label": "Status" }
    ],
    "rows": [
      { "name": "Project Alpha", "status": "On track" }
    ],
    "sortable": true,
    "highlightCondition": { "column": "status", "value": "At risk" }
  }
}
\`\`\`
- columns: array of { key, label } objects
- rows: array of objects with keys matching column keys
- Values of "High", "Medium", "Low" auto-render as colored badges
- sortable: enable click-to-sort on column headers
- highlightCondition: optional, highlights rows where column matches value

### bar-chart
Horizontal or vertical bar chart. Use for comparisons or rankings.
\`\`\`json
{
  "type": "bar-chart",
  "props": {
    "title": "Revenue by region",
    "orientation": "horizontal",
    "data": [
      { "name": "North America", "value": 4200, "fill": "#1a73e8" },
      { "name": "Europe", "value": 3100, "fill": "#8430ce" }
    ],
    "valueLabel": "Revenue ($K)"
  }
}
\`\`\`
- orientation: "horizontal" or "vertical"
- data: array of { name, value, fill? } objects. fill is optional hex color.
- For compare mode (e.g. Q1 vs Q2), use: data items with named numeric keys + compareMode:true
  \`\`\`json
  { "data": [{ "name": "Jan", "current": 100, "previous": 80 }], "compareMode": true }
  \`\`\`

### action-card
A recommended action with CTA buttons. Use for suggestions/next steps.
\`\`\`json
{
  "type": "action-card",
  "props": {
    "title": "Schedule team sync",
    "description": "A 30-minute alignment session could resolve the blockers on Q2 deliverables.",
    "actions": [
      { "label": "Schedule now", "variant": "primary" },
      { "label": "View calendar", "variant": "secondary" }
    ]
  }
}
\`\`\`
- actions: 1-2 buttons. variant is "primary" (blue filled) or "secondary" (outlined).

### summary-text
A prose paragraph. Use for narrative context or explanations.
\`\`\`json
{
  "type": "summary-text",
  "props": {
    "text": "Revenue grew 18% but margins compressed due to higher acquisition costs.",
    "emphasis": ["18%", "margins compressed"]
  }
}
\`\`\`
- emphasis: optional array of substrings to bold within the text.

### progress-bar
A labeled progress bar. Use for quotas, completion, capacity.
\`\`\`json
{
  "type": "progress-bar",
  "props": {
    "label": "Q2 quota attainment",
    "value": 73,
    "maxValue": 100,
    "colorHint": "primary",
    "suffix": "%"
  }
}
\`\`\`
- colorHint: "primary" (blue) | "success" (green) | "warning" (orange) | "danger" (red) | "purple"
- suffix: appended to value display (default "%")

### stat-comparison
A before/after or A-vs-B comparison. Use for showing change.
\`\`\`json
{
  "type": "stat-comparison",
  "props": {
    "title": "Response time improvement",
    "labelA": "Before",
    "valueA": "4.2s",
    "labelB": "After",
    "valueB": "1.8s",
    "trend": "positive"
  }
}
\`\`\`
- trend: "positive" (green arrow) | "negative" (red arrow) | "neutral" (gray)

### callout
A highlighted insight or warning box. Use sparingly for key takeaways.
\`\`\`json
{
  "type": "callout",
  "props": {
    "variant": "warning",
    "title": "Budget threshold exceeded",
    "message": "Cloud infrastructure spend is 15% over the approved quarterly budget."
  }
}
\`\`\`
- variant: "info" (blue) | "warning" (orange) | "success" (green) | "error" (red)

### list-group
A titled list with optional descriptions per item. Use for enumerations, steps, findings.
\`\`\`json
{
  "type": "list-group",
  "props": {
    "title": "Key findings",
    "ordered": false,
    "items": [
      { "label": "Customer churn increased", "description": "Up 2.3pp in enterprise segment" },
      { "label": "NPS score stable", "description": "Holding at 72, above industry benchmark" }
    ]
  }
}
\`\`\`
- items: array of strings OR { label, description? } objects
- ordered: false (bullets) or true (numbered)

---

## Layout rules
- metric-card, action-card, progress-bar, and stat-comparison render in a responsive grid (3 columns on desktop, stacked on mobile)
- data-table, bar-chart, summary-text, callout, and list-group render full-width
- Place metric-cards first for the "headline numbers" effect
- Place action-cards last for "what to do next"
- 2-5 components per agent is ideal. Don't over-generate.
`;
