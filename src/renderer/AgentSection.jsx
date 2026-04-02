import ComponentRouter from "./ComponentRouter";
import {
  SkeletonMetrics,
  SkeletonChart,
  SkeletonTable,
  SkeletonActions,
} from "../components/SkeletonPlaceholder";

// Editorial color palette — saturated backgrounds with dark text
const SECTION_PALETTE = [
  { bg: "#FF6200", text: "#0f0f0f", muted: "rgba(0,0,0,0.5)" },   // orange
  { bg: "#E8197A", text: "#0f0f0f", muted: "rgba(0,0,0,0.5)" },   // hot pink
  { bg: "#EDE8DF", text: "#0f0f0f", muted: "rgba(0,0,0,0.45)" },  // warm cream
  { bg: "#FFD166", text: "#0f0f0f", muted: "rgba(0,0,0,0.5)" },   // amber
  { bg: "#B8F0D8", text: "#0f0f0f", muted: "rgba(0,0,0,0.5)" },   // mint
];

const SKELETON_CYCLE = [
  <>
    <SkeletonMetrics />
    <SkeletonChart />
  </>,
  <SkeletonTable />,
  <SkeletonActions />,
];

const GRID_TYPES = new Set(["metric-card", "action-card", "stat-comparison", "progress-bar"]);

function groupComponents(components) {
  if (!components) return [];
  const groups = [];
  let currentGrid = null;

  for (const comp of components) {
    if (GRID_TYPES.has(comp.type)) {
      if (!currentGrid) {
        currentGrid = { grid: true, items: [] };
        groups.push(currentGrid);
      }
      currentGrid.items.push(comp);
    } else {
      currentGrid = null;
      groups.push({ grid: false, items: [comp] });
    }
  }
  return groups;
}

export default function AgentSection({
  agent,
  agentLabel,
  status,
  components,
  onAction,
  onRegenerate,
  index = 0,
}) {
  const palette = SECTION_PALETTE[index % SECTION_PALETTE.length];

  return (
    <div
      className="agent-enter -mx-4 sm:-mx-6"
      style={{ backgroundColor: palette.bg, color: palette.text }}
    >
      {/* Attribution bar */}
      <div className="flex items-center justify-between px-6 sm:px-8 pt-6 pb-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full ${status === "loading" ? "pulse-subtle" : ""}`}
            style={{ backgroundColor: palette.muted.replace("rgba", "rgba").replace("0.5", "0.7").replace("0.45", "0.6") }}
          />
          <span
            className="text-[11px] font-medium tracking-wide uppercase"
            style={{ color: palette.muted }}
          >
            via {agentLabel}
          </span>
          {status === "loading" && (
            <span className="text-[10px] pulse-subtle" style={{ color: palette.muted }}>
              Analyzing...
            </span>
          )}
        </div>
        {status === "complete" && onRegenerate && (
          <button
            onClick={onRegenerate}
            className="text-[11px] flex items-center gap-1 transition-opacity hover:opacity-100"
            style={{ color: palette.muted }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M10 6A4 4 0 1 1 6 2M10 2V6H6"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Regenerate
          </button>
        )}
      </div>

      {/* Content */}
      {status === "loading" ? (
        <div className="flex flex-col gap-3 px-6 sm:px-8 pb-8">
          {SKELETON_CYCLE[index % SKELETON_CYCLE.length]}
        </div>
      ) : status === "error" ? (
        <div className="mx-6 sm:mx-8 mb-8 rounded-lg border border-black/20 bg-black/10 p-4 text-sm">
          This agent encountered an error. Try regenerating.
        </div>
      ) : (
        <div className="flex flex-col gap-4 px-6 sm:px-8 pb-8">
          {groupComponents(components).map((group, gi) =>
            group.grid ? (
              <div key={gi} className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ backgroundColor: "rgba(0,0,0,0.12)" }}>
                {group.items.map((comp, i) => (
                  <div key={i} style={{ backgroundColor: palette.bg }}>
                    <ComponentRouter
                      type={comp.type}
                      props={comp.props}
                      onAction={onAction}
                      sectionColor={palette.bg}
                    />
                  </div>
                ))}
              </div>
            ) : (
              group.items.map((comp, i) => (
                <ComponentRouter
                  key={`${gi}-${i}`}
                  type={comp.type}
                  props={comp.props}
                  onAction={onAction}
                  sectionColor={palette.bg}
                />
              ))
            )
          )}
        </div>
      )}
    </div>
  );
}
