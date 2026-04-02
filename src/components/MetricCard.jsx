const TREND_ICONS = {
  up: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 3L11 7H8.5V11H5.5V7H3L7 3Z" fill="currentColor" />
    </svg>
  ),
  down: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 11L3 7H5.5V3H8.5V7H11L7 11Z" fill="currentColor" />
    </svg>
  ),
  neutral: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 7H11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
};

export default function MetricCard({ label, value, trend, trendValue }) {
  return (
    <div className="flex flex-col gap-2 p-6">
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] opacity-60">
        {label}
      </span>
      <span
        className="halftone-text font-bold leading-none tracking-tight"
        style={{
          fontSize: "clamp(2.4rem, 5vw, 4rem)",
          "--halftone-color": "#0f0f0f",
        }}
      >
        {value}
      </span>
      {trendValue && (
        <div className="flex items-center gap-1 text-[12px] font-medium opacity-70">
          {trend && TREND_ICONS[trend]}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}
