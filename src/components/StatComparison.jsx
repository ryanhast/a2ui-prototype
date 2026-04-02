export default function StatComparison({ labelA, valueA, labelB, valueB, title, trend }) {
  return (
    <div className="p-6 flex flex-col gap-3">
      {title && (
        <h4 className="text-[11px] font-medium uppercase tracking-[0.12em] opacity-55">
          {title}
        </h4>
      )}
      <div className="flex items-center gap-6">
        <div className="flex flex-col gap-1">
          <span
            className="halftone-text font-bold leading-none tracking-tight"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", "--halftone-color": "#0f0f0f" }}
          >
            {valueA}
          </span>
          <p className="text-[11px] opacity-60">{labelA}</p>
        </div>

        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="opacity-40 flex-shrink-0">
          <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div className="flex flex-col gap-1">
          <span
            className="halftone-text font-bold leading-none tracking-tight"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", "--halftone-color": "#0f0f0f" }}
          >
            {valueB}
          </span>
          <p className="text-[11px] opacity-60">{labelB}</p>
        </div>
      </div>
    </div>
  );
}
