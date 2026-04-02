import Attribution from "../primitives/Attribution";
import FadeIn from "../motion/FadeIn";
import CountUp from "../motion/CountUp";

/*
  Typography: Google Sans Text only. Three sizes.
    Display:  48px / 400  — title, big numbers
    Body:     14px / 400  — task names, descriptions
    Caption:  11px / 500  — labels, day tags, time estimates
*/

const T = {
  display: {
    fontFamily: "var(--md-ref-typeface-plain)",
    fontSize: 48,
    fontWeight: 400,
    lineHeight: 1,
    color: "#000",
  },
  body: {
    fontFamily: "var(--md-ref-typeface-plain)",
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.5,
    color: "#000",
  },
  caption: {
    fontFamily: "var(--md-ref-typeface-plain)",
    fontSize: 11,
    fontWeight: 500,
    lineHeight: 1.3,
    color: "#999",
  },
};

function Checkbox({ checked }) {
  return (
    <div style={{
      width: 28,
      height: 28,
      border: "2px solid #000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}>
      {checked && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8L6.5 11.5L13 4.5" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

export default function ChecklistLayout({ data, summary }) {
  const { greeting, userName, progress, steps } = data;
  const done = progress.completed;
  const total = progress.total;

  return (
    <div className="max-w-4xl mx-auto">

      {/* ─── Header: black banner with white title ─── */}
      <FadeIn>
        <div style={{
          backgroundColor: "#000",
          padding: "32px 32px 28px",
          marginBottom: 0,
        }}>
          <p style={{ ...T.display, color: "#fff", fontSize: "clamp(36px, 6vw, 56px)", letterSpacing: "-0.02em" }}>
            {greeting},<br />{userName}.
          </p>
        </div>
      </FadeIn>

      {/* ─── Column headers ─── */}
      <FadeIn delay={80}>
        <div className="grid" style={{
          gridTemplateColumns: "80px 1fr 80px 80px 72px 72px",
          borderBottom: "2px solid #000",
          padding: "12px 0",
        }}>
          <span style={T.caption}>Day</span>
          <span style={T.caption}>Task</span>
          <span style={T.caption}>Time</span>
          <span style={T.caption}>Who</span>
          <span style={{ ...T.caption, textAlign: "center" }}>In progress</span>
          <span style={{ ...T.caption, textAlign: "center" }}>Done</span>
        </div>
      </FadeIn>

      {/* ─── Rows ─── */}
      <FadeIn delay={150}>
        {steps.map((step, i) => {
          const isComplete = step.status === "complete";
          const isCurrent = step.status === "current";

          return (
            <div
              key={step.id}
              className="grid"
              style={{
                gridTemplateColumns: "80px 1fr 80px 80px 72px 72px",
                borderBottom: "1px solid #e5e5e5",
                padding: "16px 0",
                alignItems: "center",
                backgroundColor: isCurrent ? "#f5f5f5" : "transparent",
              }}
            >
              {/* Day */}
              <span style={{ ...T.display, fontSize: 28 }}>
                {step.day?.replace("Day ", "") || ""}
              </span>

              {/* Task + description */}
              <div style={{ paddingRight: 16 }}>
                <p style={{
                  ...T.body,
                  fontWeight: 500,
                  color: isComplete ? "#999" : "#000",
                  textDecoration: isComplete ? "line-through" : "none",
                }}>
                  {step.title}
                </p>
                <p style={{ ...T.caption, marginTop: 2 }}>
                  {step.description}
                </p>
              </div>

              {/* Time */}
              <span style={T.body}>
                {step.estimatedMinutes ? `${step.estimatedMinutes}m` : "\u2014"}
              </span>

              {/* Who */}
              <span style={{ ...T.caption, color: "#555" }}>
                {step.actions?.length > 0 ? "You" : "\u2014"}
              </span>

              {/* In progress checkbox */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Checkbox checked={isCurrent} />
              </div>

              {/* Done checkbox */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Checkbox checked={isComplete} />
              </div>
            </div>
          );
        })}
      </FadeIn>

      {/* ─── Bottom: progress + notes ─── */}
      <FadeIn delay={300}>
        <div className="grid grid-cols-3 gap-0" style={{ borderTop: "2px solid #000", marginTop: 0 }}>

          {/* Progress fraction */}
          <div style={{ padding: 24, borderRight: "1px solid #e5e5e5" }}>
            <p style={T.caption}>Progress</p>
            <p style={{ ...T.display, fontSize: 64, marginTop: 8 }}>
              <CountUp target={done} duration={800} /><span style={{ color: "#e5e5e5" }}>/</span><span style={{ color: "#999" }}>{total}</span>
            </p>
          </div>

          {/* Progress bar */}
          <div style={{ padding: 24, borderRight: "1px solid #e5e5e5", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ width: "100%", height: 8, backgroundColor: "#e5e5e5" }}>
              <div style={{
                width: `${(done / total) * 100}%`,
                height: "100%",
                backgroundColor: "#000",
                transition: "width 800ms cubic-bezier(0.2,0,0,1)",
              }} />
            </div>
            <p style={{ ...T.caption, marginTop: 8 }}>{Math.round((done / total) * 100)}% complete</p>
          </div>

          {/* Notes / summary */}
          <div style={{ padding: 24 }}>
            <p style={{ ...T.display, fontSize: 28, marginBottom: 12 }}>Notes</p>
            <p style={{ ...T.body, color: "#555" }}>{summary}</p>
          </div>
        </div>
      </FadeIn>

      <Attribution />
    </div>
  );
}
