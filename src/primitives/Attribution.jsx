export default function Attribution({ text = "Composed by Gemini", className = "" }) {
  return (
    <p
      className={`type-label-small text-right mt-10 ${className}`}
      style={{ color: "var(--md-sys-color-outline)" }}
    >
      {text}
    </p>
  );
}
