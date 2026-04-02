import { useState } from "react";

export default function BlueprintInspector({ response }) {
  const [open, setOpen] = useState(false);

  if (!response) return null;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 type-label-large"
        style={{
          padding: "8px 16px",
          backgroundColor: "var(--md-sys-color-inverse-surface)",
          color: "var(--md-sys-color-inverse-on-surface)",
          borderRadius: "var(--md-sys-shape-corner-full)",
          border: "none",
          cursor: "pointer",
        }}
        aria-label="Toggle response inspector"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M5 2L9 7L5 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: open ? "rotate(90deg)" : "none",
              transformOrigin: "center",
            }}
          />
        </svg>
        {open ? "Hide" : "Show"} response
      </button>

      {/* Inspector panel */}
      {open && (
        <div
          className="fixed bottom-14 right-4 z-50 flex flex-col overflow-hidden"
          style={{
            width: 480,
            maxWidth: "calc(100vw - 2rem)",
            maxHeight: "60vh",
            backgroundColor: "var(--md-sys-color-surface)",
            border: "1px solid var(--md-sys-color-outline-variant)",
            borderRadius: "var(--md-sys-shape-corner-extra-large)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{
              borderBottom: "1px solid var(--md-sys-color-outline-variant)",
              backgroundColor: "var(--md-sys-color-surface-container-low)",
            }}
          >
            <span className="type-label-large" style={{ color: "var(--md-sys-color-on-surface)" }}>
              Response JSON
            </span>
            <span
              className="type-label-medium"
              style={{
                padding: "2px 10px",
                borderRadius: "var(--md-sys-shape-corner-full)",
                backgroundColor: "var(--md-sys-color-primary-container)",
                color: "var(--md-sys-color-on-primary-container)",
              }}
            >
              {response.layout_type}
            </span>
          </div>

          {/* JSON content */}
          <div className="overflow-auto flex-1 p-4">
            <pre
              className="type-label-small whitespace-pre-wrap break-words"
              style={{
                fontFamily: "var(--md-ref-typeface-mono)",
                color: "var(--md-sys-color-on-surface-variant)",
              }}
            >
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>

          <div
            className="px-4 py-2"
            style={{
              borderTop: "1px solid var(--md-sys-color-outline-variant)",
              backgroundColor: "var(--md-sys-color-surface-container-low)",
            }}
          >
            <span className="type-label-small" style={{ color: "var(--md-sys-color-outline)" }}>
              Adaptive A2UI &middot; layout: {response.layout_type} &middot;{" "}
              {Object.keys(response.data || {}).length} data fields
            </span>
          </div>
        </div>
      )}
    </>
  );
}
