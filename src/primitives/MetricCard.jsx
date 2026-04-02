import CountUp from "../motion/CountUp";
import Sparkline from "./Sparkline";

function formatValue(value, format) {
  if (format === "currency") {
    if (value >= 1000000) return { prefix: "$", number: value / 1000000, suffix: "M", decimals: 1 };
    if (value >= 1000) return { prefix: "$", number: value / 1000, suffix: "K", decimals: 0 };
    return { prefix: "$", number: value, suffix: "", decimals: 0 };
  }
  return { prefix: "", number: value, suffix: "", decimals: 0 };
}

export default function MetricCard({
  label,
  value,
  format = "number",
  trend,
  trendValue,
  sparkline,
  className = "",
}) {
  const { prefix, number, suffix, decimals } = formatValue(value, format);

  // B&W trend colors — arrows carry directional meaning
  const trendColor =
    trend === "up" ? "#000000" :
    trend === "down" ? "#000000" :
    "#999999";

  const trendIcon =
    trend === "up" ? "\u2191" :
    trend === "down" ? "\u2193" :
    "\u2192";

  return (
    <div className={`p-5 ${className}`}>
      {/* Label: label-medium */}
      <span className="type-label-medium block mb-3" style={{
        color: "var(--md-sys-color-outline)",
      }}>
        {label}
      </span>
      <div className="flex items-end justify-between gap-3">
        <div>
          {/* Value: headline-large weight */}
          <span
            className="block leading-none"
            style={{
              fontFamily: "var(--md-ref-typeface-plain)",
              fontSize: "clamp(36px, 5vw, 48px)",
              fontWeight: 400,
              fontVariantNumeric: "tabular-nums",
              color: "var(--md-sys-color-on-surface)",
            }}
          >
            <CountUp
              target={number}
              prefix={prefix}
              suffix={suffix}
              decimals={decimals}
              duration={1000}
            />
          </span>
          {/* Trend: label-medium */}
          {trendValue && (
            <span className="type-label-medium mt-2 block" style={{ color: trendColor }}>
              {trendIcon} {trendValue}
            </span>
          )}
        </div>
        {sparkline && sparkline.length > 1 && (
          <Sparkline
            data={sparkline}
            width={72}
            height={28}
            color={trendColor}
            fillOpacity={0.08}
          />
        )}
      </div>
    </div>
  );
}
