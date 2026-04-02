import AgentSection from "./AgentSection";

export default function BlueprintRenderer({
  summary,
  agentResponses,
  onAction,
  onRegenerate,
}) {
  return (
    <div className="flex flex-col gap-0">
      {/* Orchestrator summary */}
      {summary && (
        <div className="agent-enter px-4 sm:px-6 py-4">
          <p className="text-sm text-text-secondary leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Agent sections */}
      {agentResponses.map((agentResp, i) => (
        <AgentSection
          key={`${agentResp.agent}-${i}`}
          agent={agentResp.agent}
          agentLabel={agentResp.agentLabel}
          status={agentResp.status}
          components={agentResp.components}
          onAction={onAction}
          onRegenerate={() => onRegenerate?.(agentResp.agent)}
          index={i}
        />
      ))}
    </div>
  );
}
