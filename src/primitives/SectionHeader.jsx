export default function SectionHeader({
  title,
  subtitle = null,
  size = "md",
  serif = false,
  className = "",
}) {
  // Map sizes to M3 type roles
  const typeClass = {
    sm: "type-label-medium",
    md: "type-title-large",
    lg: "type-headline-small",
    xl: "type-display-small",
  }[size] || "type-title-large";

  // sm uses label style — sentence case per M3 rules
  const smStyle = size === "sm" ? {
    color: "var(--md-sys-color-outline)",
  } : {
    color: "var(--md-sys-color-on-surface)",
  };

  const Tag = size === "xl" || size === "lg" ? "h2" : "h3";

  return (
    <div className={className}>
      <Tag className={typeClass} style={smStyle}>
        {title}
      </Tag>
      {subtitle && (
        <p className="type-body-small mt-1" style={{ color: "var(--md-sys-color-outline)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
