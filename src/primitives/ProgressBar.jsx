import { useState, useEffect, useRef } from "react";

export default function ProgressBar({
  completed = 0,
  total = 1,
  animated = true,
  label = null,
  className = "",
}) {
  const pct = total > 0 ? (completed / total) * 100 : 0;
  const [width, setWidth] = useState(animated ? 0 : pct);
  const ref = useRef(null);

  useEffect(() => {
    if (!animated) {
      setWidth(pct);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => setWidth(pct));
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [pct, animated]);

  return (
    <div ref={ref} className={className}>
      {label && (
        <div className="flex justify-between items-baseline mb-2">
          <span className="type-label-large" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
            {label}
          </span>
          <span className="type-body-small tabular-nums" style={{ color: "var(--md-sys-color-outline)" }}>
            {completed} of {total} complete
          </span>
        </div>
      )}
      <div
        className="w-full overflow-hidden"
        style={{
          height: 6,
          borderRadius: "var(--md-sys-shape-corner-full)",
          backgroundColor: "var(--md-sys-color-surface-container-high)",
        }}
      >
        <div
          className="h-full"
          style={{
            width: `${width}%`,
            borderRadius: "var(--md-sys-shape-corner-full)",
            backgroundColor: "var(--md-sys-color-primary)",
            transition: animated ? "width 800ms var(--motion-easing-standard)" : "none",
          }}
        />
      </div>
    </div>
  );
}
