const RISK_STYLES = {
  High: { bg: "rgba(0,0,0,0.75)", color: "#fff" },
  Medium: { bg: "rgba(0,0,0,0.4)", color: "#0f0f0f" },
  Low: { bg: "rgba(0,0,0,0.12)", color: "#0f0f0f" },
};

export default function RiskBadge({ level }) {
  const style = RISK_STYLES[level] || RISK_STYLES.Low;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-sm uppercase tracking-wide"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {level}
    </span>
  );
}
