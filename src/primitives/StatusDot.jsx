const SIZES = { sm: 6, md: 8, lg: 12 };

export default function StatusDot({ status = "neutral", pulse = false, size = "md" }) {
  const px = SIZES[size] || SIZES.md;

  // Shape-based encoding: no color dependency
  const isOnTrack = status === "on-track" || status === "green";
  const isAtRisk = status === "at-risk" || status === "yellow";
  const isOffTrack = status === "off-track" || status === "red";

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 12 12"
      className={`inline-block flex-shrink-0 ${pulse ? "pulse-subtle" : ""}`}
      aria-label={status}
    >
      {isOnTrack && (
        /* Filled black circle */
        <circle cx="6" cy="6" r="5.5" fill="#000000" />
      )}
      {isAtRisk && (
        /* Half-filled circle: outlined top, filled bottom */
        <>
          <circle cx="6" cy="6" r="5" fill="none" stroke="#555555" strokeWidth="1.5" />
          <path d="M 0.5 6 A 5.5 5.5 0 0 1 11.5 6 L 11.5 6 A 5.5 5.5 0 0 0 0.5 6 Z" fill="none" />
          <path d="M 1 6 A 5 5 0 0 0 11 6" fill="#555555" />
        </>
      )}
      {isOffTrack && (
        /* Filled black square */
        <rect x="1" y="1" width="10" height="10" fill="#000000" />
      )}
      {!isOnTrack && !isAtRisk && !isOffTrack && (
        /* Outlined gray circle */
        <circle cx="6" cy="6" r="4.5" fill="none" stroke="#999999" strokeWidth="1.5" />
      )}
    </svg>
  );
}
