import Attribution from "../primitives/Attribution";
import FadeIn from "../motion/FadeIn";
import CountUp from "../motion/CountUp";

/*
  Typography: Google Sans Text only. Three sizes.
    Display:  48px / 400  — team name, headcount
    Body:     14px / 400  — person names, titles
    Caption:  11px / 500  — areas, labels, locations
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

function Avatar({ initials, size = 48 }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%",
      border: "1.5px solid #000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fff",
      flexShrink: 0,
    }}>
      <span style={{
        ...T.body,
        fontWeight: 500,
        fontSize: size * 0.32,
        color: "#000",
      }}>
        {initials}
      </span>
    </div>
  );
}

function PersonNode({ person, avatarSize = 48, align = "center" }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: align,
      textAlign: align,
      gap: 6,
    }}>
      <Avatar initials={person.initials} size={avatarSize} />
      <div>
        <p style={{ ...T.body, fontWeight: 500 }}>{person.name}</p>
        <p style={T.caption}>{person.title}</p>
        {person.area && <p style={{ ...T.caption, color: "#ccc", marginTop: 1 }}>{person.area}</p>}
      </div>
    </div>
  );
}

export default function PeopleLayout({ data, summary }) {
  const { teamName, headcount, groups } = data;

  const leadership = groups.find((g) => g.featured);
  const subGroups = groups.filter((g) => !g.featured);
  const leader = leadership?.members[0];

  return (
    <div className="max-w-4xl mx-auto">

      {/* ─── Title bar ─── */}
      <FadeIn>
        <div style={{ borderBottom: "2px solid #000", paddingBottom: 16 }}>
          <p style={T.caption}>{headcount} people</p>
          <h2 style={{ ...T.display, fontSize: "clamp(40px, 7vw, 64px)", letterSpacing: "-0.02em", marginTop: 4 }}>
            {teamName}
          </h2>
          <p style={{ ...T.body, color: "#555", marginTop: 8 }}>{summary}</p>
        </div>
      </FadeIn>

      {/* ─── Org chart ─── */}
      <FadeIn delay={150}>
        <div style={{ padding: "48px 0 32px", borderBottom: "1px solid #e5e5e5" }}>

          {/* Leader at top center */}
          {leader && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <PersonNode person={leader} avatarSize={72} />

              {/* Vertical connector from leader */}
              <div style={{ width: 1, height: 40, backgroundColor: "#e5e5e5" }} />

              {/* Horizontal connector bar */}
              <div style={{
                width: `${Math.min(subGroups.length * 33, 100)}%`,
                height: 1,
                backgroundColor: "#e5e5e5",
              }} />
            </div>
          )}

          {/* Sub-group columns with vertical connectors */}
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${subGroups.length}, 1fr)`,
            gap: 0,
          }}>
            {subGroups.map((group, gi) => (
              <div key={group.name} style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRight: gi < subGroups.length - 1 ? "1px solid #e5e5e5" : "none",
                padding: "0 16px",
              }}>
                {/* Vertical connector down from horizontal bar */}
                <div style={{ width: 1, height: 32, backgroundColor: "#e5e5e5" }} />

                {/* Group label */}
                <p style={{ ...T.caption, marginBottom: 20 }}>{group.name}</p>

                {/* Members */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 24,
                  width: "100%",
                }}>
                  {group.members.map((person) => (
                    <PersonNode key={person.name} person={person} avatarSize={48} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ─── Bottom: 3-col team stats ─── */}
      <FadeIn delay={300}>
        <div className="grid grid-cols-3" style={{ borderBottom: "2px solid #000" }}>
          <div style={{ padding: 24, borderRight: "1px solid #e5e5e5" }}>
            <p style={T.caption}>Headcount</p>
            <p style={{ ...T.display, marginTop: 8 }}>
              <CountUp target={headcount} duration={800} />
            </p>
          </div>
          <div style={{ padding: 24, borderRight: "1px solid #e5e5e5" }}>
            <p style={T.caption}>Functions</p>
            <p style={{ ...T.display, marginTop: 8 }}>
              <CountUp target={subGroups.length} duration={600} />
            </p>
          </div>
          <div style={{ padding: 24 }}>
            <p style={T.caption}>Reports to</p>
            <p style={{ ...T.body, marginTop: 8 }}>{leader?.name || "—"}</p>
            <p style={{ ...T.caption, marginTop: 2 }}>{leader?.title || ""}</p>
          </div>
        </div>
      </FadeIn>

      <Attribution />
    </div>
  );
}
