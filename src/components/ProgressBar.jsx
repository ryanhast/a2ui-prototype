export default function ProgressBar({ label, value, maxValue = 100, colorHint = "primary", suffix = "%" }) {
  const pct = Math.min(100, Math.max(0, (value / maxValue) * 100));

  return (
    <div className="flex flex-col gap-3 p-6">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] opacity-55">{label}</span>
        <span
          className="halftone-text font-bold leading-none"
          style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", "--halftone-color": "#0f0f0f" }}
        >
          {value}{suffix}
        </span>
      </div>
      <div className="h-2 rounded-none overflow-hidden" style={{ backgroundColor: "rgba(0,0,0,0.15)" }}>
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: "rgba(0,0,0,0.75)" }}
        />
      </div>
    </div>
  );
}
