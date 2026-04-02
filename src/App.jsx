import { useState, useCallback, useRef, useEffect } from "react";
import { queryA2UI } from "./api/query";
import { EXAMPLE_PROMPTS } from "./api/mockData";
import LayoutRouter from "./router/LayoutRouter";
import BlueprintInspector from "./inspector/BlueprintInspector";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [currentQuery, setCurrentQuery] = useState("");
  const [state, setState] = useState("idle"); // idle | morphing | complete
  const [layoutType, setLayoutType] = useState(null);
  const [layoutData, setLayoutData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [rawResponse, setRawResponse] = useState(null);
  const [prevLayout, setPrevLayout] = useState(null);
  const [morphPhase, setMorphPhase] = useState(null);
  const inputRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleSubmit = useCallback(
    async (text) => {
      const queryText = (text || prompt).trim();
      if (!queryText) return;

      setPrompt("");

      const hadPrevious = state === "complete" && layoutType;

      if (hadPrevious) {
        setPrevLayout({ layoutType, layoutData, summary });
      }

      setCurrentQuery(queryText);
      setState("morphing");
      setMorphPhase(hadPrevious ? "cross" : "first");

      // Scroll content area to top
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }

      const [result] = await Promise.all([
        queryA2UI(queryText),
        new Promise((r) => setTimeout(r, hadPrevious ? 800 : 1000)),
      ]);

      setLayoutType(result.layout_type);
      setSummary(result.summary);
      setLayoutData(result.data);
      setRawResponse(result);
      setMorphPhase("cross");

      setTimeout(() => {
        setPrevLayout(null);
        setMorphPhase("done");
        setState("complete");
        if (inputRef.current) inputRef.current.focus();
      }, 900);
    },
    [prompt, state, layoutType, layoutData, summary]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const T = {
    sans: "var(--md-ref-typeface-plain)",
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      backgroundColor: "#fff",
      overflow: "hidden",
    }}>

      {/* ─── Scrollable content area ─── */}
      <div
        ref={contentRef}
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {state === "idle" ? (
          /* Empty state */
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100%",
            padding: "64px 24px",
            gap: 8,
          }}>
            <div style={{
              width: 32, height: 32,
              backgroundColor: "#000",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 16,
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M4 4H7V7H4V4Z" fill="white" opacity="0.7" />
                <path d="M9 4H12V7H9V4Z" fill="white" />
                <path d="M4 9H7V12H4V9Z" fill="white" />
                <path d="M9 9H12V12H9V9Z" fill="white" opacity="0.5" />
              </svg>
            </div>
            <p style={{
              fontFamily: T.sans, fontSize: 14, fontWeight: 500, color: "#000",
            }}>
              Operator
            </p>
            <p style={{
              fontFamily: T.sans, fontSize: 14, color: "#999",
              textAlign: "center", maxWidth: 280,
            }}>
              Ask me anything about your business.
            </p>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 8,
              marginTop: 16,
              maxWidth: 480,
            }}>
              {EXAMPLE_PROMPTS.map((ex) => (
                <button
                  key={ex}
                  onClick={() => handleSubmit(ex)}
                  style={{
                    fontFamily: T.sans,
                    fontSize: 13,
                    fontWeight: 400,
                    color: "#444",
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: 9999,
                    padding: "8px 16px",
                    cursor: "pointer",
                    transition: "background-color 150ms ease, border-color 150ms ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                    e.currentTarget.style.borderColor = "#ccc";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#fff";
                    e.currentTarget.style.borderColor = "#e0e0e0";
                  }}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Results */
          <div style={{ maxWidth: 768, margin: "0 auto", padding: "24px 24px 120px" }}>
            {/* Query */}
            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 24,
            }}>
              <div style={{
                fontFamily: T.sans, fontSize: 14, fontWeight: 400, color: "#000",
                backgroundColor: "#f5f5f5",
                padding: "10px 16px",
                maxWidth: "70%",
              }}>
                {currentQuery}
              </div>
            </div>

            {/* Morph container */}
            <div className="morph-container">
              {prevLayout && morphPhase === "cross" && (
                <div className="morph-out">
                  <LayoutRouter
                    layoutType={prevLayout.layoutType}
                    data={prevLayout.layoutData}
                    summary={prevLayout.summary}
                  />
                </div>
              )}

              {state === "morphing" && !layoutData && (
                <div className="morph-first-enter" style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  minHeight: 200,
                }}>
                  <div style={{
                    width: "40%", height: 1, backgroundColor: "#000",
                    animation: "subtlePulse 1s ease-in-out infinite",
                  }} />
                </div>
              )}

              {layoutData && (
                <div
                  key={layoutType + currentQuery}
                  className={morphPhase === "cross" ? "morph-in" : morphPhase === "first" ? "morph-first-enter" : ""}
                >
                  <LayoutRouter layoutType={layoutType} data={layoutData} summary={summary} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ─── Input bar at bottom ─── */}
      <div style={{
        borderTop: "1px solid #e5e5e5",
        backgroundColor: "#fff",
        padding: "12px 24px",
        flexShrink: 0,
      }}>
        <div style={{
          maxWidth: 768,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 12,
          backgroundColor: "#f5f5f5",
          padding: "4px 4px 4px 16px",
        }}>
          <input
            ref={inputRef}
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Operator..."
            style={{
              flex: 1,
              fontFamily: T.sans,
              fontSize: 14,
              fontWeight: 400,
              color: "#000",
              border: "none",
              outline: "none",
              background: "transparent",
              padding: "10px 0",
            }}
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!prompt.trim()}
            aria-label="Send"
            style={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: prompt.trim() ? "#000" : "transparent",
              border: "none",
              cursor: prompt.trim() ? "pointer" : "default",
              transition: "background-color 150ms ease",
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 13L13 8L3 3V7L9 8L3 9V13Z"
                fill={prompt.trim() ? "#fff" : "#ccc"}
              />
            </svg>
          </button>
        </div>
      </div>

      <BlueprintInspector response={rawResponse} />
    </div>
  );
}
