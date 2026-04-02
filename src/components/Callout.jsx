const VARIANT_BORDER = {
  info: "rgba(0,0,0,0.5)",
  warning: "rgba(0,0,0,0.5)",
  success: "rgba(0,0,0,0.5)",
  error: "rgba(0,0,0,0.7)",
};

const VARIANT_ICONS = {
  info: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7V11M8 5V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1L15 14H1L8 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 6V9M8 11V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  success: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 6L10 10M10 6L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

export default function Callout({ variant = "info", title, message }) {
  return (
    <div
      className="flex gap-3 py-4"
      style={{ borderLeft: `3px solid ${VARIANT_BORDER[variant] || VARIANT_BORDER.info}`, paddingLeft: "1rem" }}
    >
      <div className="flex-shrink-0 mt-0.5 opacity-70">
        {VARIANT_ICONS[variant] || VARIANT_ICONS.info}
      </div>
      <div className="flex flex-col gap-1">
        {title && <h4 className="text-sm font-bold">{title}</h4>}
        <p className="text-sm leading-relaxed opacity-70">{message}</p>
      </div>
    </div>
  );
}
