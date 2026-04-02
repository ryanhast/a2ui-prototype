import StatusDot from "../primitives/StatusDot";
import Attribution from "../primitives/Attribution";
import FadeIn from "../motion/FadeIn";
import CountUp from "../motion/CountUp";

/*
  Typography: Google Sans Text only. Three sizes.
    Display:  48px / 400  — big numbers, project name
    Body:     14px / 400  — readable text, descriptions
    Caption:  11px / 500  — labels, metadata, dates
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

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ── Cells ──────────────────────────────────────────────────────────── */

function Cell({ children, borderRight = false, borderBottom = false, className = "", style = {} }) {
  return (
    <div
      className={className}
      style={{
        padding: 24,
        borderRight: borderRight ? "1px solid #e5e5e5" : "none",
        borderBottom: borderBottom ? "1px solid #e5e5e5" : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function StatusLayout({ data, summary }) {
  const {
    projectName,
    phase,
    period,
    overallStatus,
    statusGrid,
    milestones,
    risks,
    recentActivity,
  } = data;

  const complete = milestones.filter((m) => m.status === "complete").length;
  const total = milestones.length;
  const current = milestones.find((m) => m.status === "current");
  const upcoming = milestones.filter((m) => m.status === "upcoming");

  return (
    <div className="max-w-4xl mx-auto">

      {/* ─── Title bar ─── */}
      <FadeIn>
        <div style={{ borderBottom: "2px solid #000", paddingBottom: 20, marginBottom: 0 }}>
          <p style={T.caption}>{phase} &middot; {period}</p>
          <h2 style={{ ...T.display, fontSize: "clamp(40px, 7vw, 64px)", letterSpacing: "-0.02em", marginTop: 4 }}>
            {projectName}
          </h2>
        </div>
      </FadeIn>

      {/* ─── Row 1: status grid (3 cols, last item spans or 4th wraps) ─── */}
      <FadeIn delay={100}>
        <div className="grid grid-cols-3" style={{ borderBottom: "1px solid #e5e5e5" }}>
          {statusGrid.slice(0, 3).map((item, i) => (
            <Cell key={item.label} borderRight={i < 2} className="">
              <p style={T.caption}>{item.label}</p>
              <div className="flex items-center gap-2 mt-2">
                <StatusDot status={item.status} size="sm" />
                <span style={T.body}>{item.detail}</span>
              </div>
            </Cell>
          ))}
        </div>
        {statusGrid.length > 3 && (
          <div className="grid grid-cols-3" style={{ borderBottom: "1px solid #e5e5e5" }}>
            {statusGrid.slice(3).map((item, i) => (
              <Cell key={item.label} borderRight={i < statusGrid.slice(3).length - 1} className="">
                <p style={T.caption}>{item.label}</p>
                <div className="flex items-center gap-2 mt-2">
                  <StatusDot status={item.status} size="sm" />
                  <span style={T.body}>{item.detail}</span>
                </div>
              </Cell>
            ))}
          </div>
        )}
      </FadeIn>

      {/* ─── Row 2: big number + milestone bars + current ─── */}
      <FadeIn delay={200}>
        <div className="grid grid-cols-3" style={{ borderBottom: "1px solid #e5e5e5" }}>

          {/* Col 1: big fraction */}
          <Cell borderRight>
            <p style={T.caption}>Milestones</p>
            <p style={{ ...T.display, fontSize: 64, marginTop: 8 }}>
              <CountUp target={complete} duration={800} /><span style={{ color: "#e5e5e5" }}>/</span><span style={{ color: "#999" }}>{total}</span>
            </p>
          </Cell>

          {/* Col 2: bar visualization */}
          <Cell borderRight>
            <div className="flex items-end gap-1 h-full" style={{ paddingBottom: 0 }}>
              {milestones.map((m) => (
                <div key={m.title} className="flex-1 flex flex-col justify-end" style={{ height: 80 }}>
                  <div style={{
                    height: m.status === "complete" ? "100%" : m.status === "current" ? "60%" : "20%",
                    backgroundColor: m.status === "complete" ? "#000" : m.status === "current" ? "#999" : "#e5e5e5",
                  }} />
                  <p style={{ ...T.caption, fontSize: 9, marginTop: 4, lineHeight: 1.1 }}>
                    {m.title.split(" ").slice(0, 2).join(" ")}
                  </p>
                </div>
              ))}
            </div>
          </Cell>

          {/* Col 3: current + next */}
          <Cell>
            <p style={T.caption}>Current</p>
            {current && (
              <>
                <p style={{ ...T.body, marginTop: 4 }}>{current.title}</p>
                <p style={{ ...T.caption, marginTop: 2 }}>{fmt(current.date)}</p>
              </>
            )}
            {upcoming.length > 0 && (
              <div style={{ borderTop: "1px solid #e5e5e5", marginTop: 16, paddingTop: 12 }}>
                <p style={T.caption}>Next</p>
                <p style={{ ...T.body, marginTop: 4 }}>{upcoming[0].title}</p>
                <p style={{ ...T.caption, marginTop: 2 }}>{fmt(upcoming[0].date)}</p>
              </div>
            )}
          </Cell>
        </div>
      </FadeIn>

      {/* ─── Row 3: risks + activity + summary ─── */}
      <FadeIn delay={350}>
        <div className="grid grid-cols-3" style={{ borderBottom: "2px solid #000" }}>

          {/* Col 1: risks */}
          <Cell borderRight>
            <div className="flex items-end justify-between mb-4">
              <p style={T.caption}>Risks</p>
              <span style={{ ...T.display, fontSize: 36 }}>{risks?.length || 0}</span>
            </div>
            {risks?.map((risk, i) => (
              <div key={i} style={{
                borderTop: "1px solid #e5e5e5",
                paddingTop: 10,
                marginTop: i > 0 ? 10 : 0,
              }}>
                <p style={T.body}>{risk.title}</p>
                <p style={{ ...T.caption, marginTop: 2 }}>
                  {risk.owner} &middot; {fmt(risk.due)}
                </p>
              </div>
            ))}
          </Cell>

          {/* Col 2: recent activity */}
          <Cell borderRight>
            <p style={{ ...T.caption, marginBottom: 12 }}>Activity</p>
            {recentActivity?.map((item, i) => (
              <div key={i} style={{
                borderTop: i > 0 ? "1px solid #f5f5f5" : "none",
                paddingTop: i > 0 ? 8 : 0,
                paddingBottom: 8,
              }}>
                <p style={T.body}>
                  <span style={{ fontWeight: 500 }}>{item.actor}</span>{" "}
                  {item.text}
                </p>
                <p style={T.caption}>{fmt(item.date)}</p>
              </div>
            ))}
          </Cell>

          {/* Col 3: summary */}
          <Cell>
            <p style={{ ...T.caption, marginBottom: 8 }}>Summary</p>
            <p style={{ ...T.body, color: "#555" }}>{summary}</p>
          </Cell>
        </div>
      </FadeIn>

      <Attribution />
    </div>
  );
}
