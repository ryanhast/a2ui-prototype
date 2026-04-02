import { useState } from "react";
import Attribution from "../primitives/Attribution";
import FadeIn from "../motion/FadeIn";
import CountUp from "../motion/CountUp";

/*
  Typography: Google Sans Text only. Three sizes.
    Display:  48px / 400  — month names, big numbers
    Body:     14px / 400  — holiday names, descriptions
    Caption:  11px / 500  — day numbers, labels
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

const MONTH_NAMES = [
  "", "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

const DAY_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month - 1, 1).getDay();
}

function MonthCard({ monthNum, year, holidays, isPast, isExpanded, onToggle }) {
  const name = MONTH_NAMES[monthNum];
  const daysInMonth = getDaysInMonth(year, monthNum);
  const firstDay = getFirstDayOfWeek(year, monthNum);
  const monthHolidays = holidays.filter((h) => h.month === monthNum);
  const holidayDays = new Set(monthHolidays.map((h) => new Date(h.date + "T12:00:00").getDate()));
  const hasHolidays = monthHolidays.length > 0;

  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        cursor: "pointer",
        transition: "all 300ms cubic-bezier(0.2,0,0,1)",
        overflow: "hidden",
      }}
      onClick={onToggle}
    >
      {/* Collapsed: month name + holiday count */}
      <div style={{
        padding: isExpanded ? "20px 20px 0" : 20,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        backgroundColor: hasHolidays && !isPast ? "#000" : isPast ? "#f5f5f5" : "#fff",
        transition: "background-color 300ms cubic-bezier(0.2,0,0,1)",
      }}>
        <span style={{
          ...T.display,
          fontSize: isExpanded ? 36 : 24,
          color: hasHolidays && !isPast ? "#fff" : isPast ? "#999" : "#000",
          transition: "font-size 300ms cubic-bezier(0.2,0,0,1), color 300ms cubic-bezier(0.2,0,0,1)",
        }}>
          {name}
        </span>
        {monthHolidays.length > 0 && (
          <span style={{
            ...T.display,
            fontSize: isExpanded ? 28 : 20,
            color: hasHolidays && !isPast ? "#fff" : "#999",
            opacity: 0.7,
            transition: "font-size 300ms cubic-bezier(0.2,0,0,1)",
          }}>
            {monthHolidays.length}
          </span>
        )}
      </div>

      {/* Expanded: full calendar grid + holidays */}
      {isExpanded && (
        <div style={{
          padding: 20,
          backgroundColor: hasHolidays && !isPast ? "#000" : isPast ? "#f5f5f5" : "#fff",
        }}>
          {/* Day headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 0,
            marginBottom: 4,
          }}>
            {DAY_HEADERS.map((d) => (
              <span key={d} style={{
                ...T.caption,
                textAlign: "center",
                color: hasHolidays && !isPast ? "rgba(255,255,255,0.4)" : "#999",
                padding: "4px 0",
              }}>
                {d}
              </span>
            ))}
          </div>

          {/* Day numbers grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 0,
          }}>
            {/* Empty cells for offset */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} style={{ padding: "6px 0" }} />
            ))}
            {/* Day numbers */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isHoliday = holidayDays.has(day);
              const invertColors = hasHolidays && !isPast;

              return (
                <div
                  key={day}
                  style={{
                    textAlign: "center",
                    padding: "6px 0",
                    position: "relative",
                  }}
                >
                  <span style={{
                    ...T.body,
                    fontWeight: isHoliday ? 500 : 400,
                    fontSize: isHoliday ? 18 : 14,
                    color: invertColors
                      ? (isHoliday ? "#fff" : "rgba(255,255,255,0.5)")
                      : (isHoliday ? "#000" : "#999"),
                    fontVariantNumeric: "tabular-nums",
                  }}>
                    {day}
                  </span>
                  {isHoliday && (
                    <div style={{
                      width: 4,
                      height: 4,
                      backgroundColor: invertColors ? "#fff" : "#000",
                      margin: "2px auto 0",
                    }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Holiday names list */}
          {monthHolidays.length > 0 && (
            <div style={{
              borderTop: `1px solid ${hasHolidays && !isPast ? "rgba(255,255,255,0.2)" : "#e5e5e5"}`,
              marginTop: 12,
              paddingTop: 12,
            }}>
              {monthHolidays.map((h) => {
                const day = new Date(h.date + "T12:00:00").getDate();
                return (
                  <div key={h.name} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    padding: "4px 0",
                  }}>
                    <span style={{
                      ...T.body,
                      color: hasHolidays && !isPast ? "#fff" : "#000",
                    }}>
                      {h.name}
                    </span>
                    <span style={{
                      ...T.caption,
                      color: hasHolidays && !isPast ? "rgba(255,255,255,0.5)" : "#999",
                      fontVariantNumeric: "tabular-nums",
                    }}>
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CalendarLayout({ data, summary }) {
  const { title, year, totalDays, nextHoliday, holidays } = data;
  const [expanded, setExpanded] = useState(null);

  // Auto-expand the month with the next holiday
  const nextMonth = nextHoliday ? new Date(nextHoliday.date + "T12:00:00").getMonth() + 1 : null;

  function toggleMonth(monthNum) {
    setExpanded((prev) => (prev === monthNum ? null : monthNum));
  }

  // Current month is April (4) based on mock date
  const currentMonth = 4;

  return (
    <div className="max-w-4xl mx-auto">

      {/* ─── Title bar ─── */}
      <FadeIn>
        <div style={{ borderBottom: "2px solid #000", paddingBottom: 16 }}>
          <p style={T.caption}>{year}</p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <h2 style={{ ...T.display, fontSize: "clamp(40px, 7vw, 64px)", letterSpacing: "-0.02em", marginTop: 4 }}>
              {title}
            </h2>
            <span style={{ ...T.display, fontSize: 64, color: "#000" }}>
              <CountUp target={totalDays} duration={800} />
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <p style={T.body}>{summary}</p>
            <p style={{ ...T.caption, textAlign: "right", flexShrink: 0, marginLeft: 24 }}>days off</p>
          </div>
        </div>
      </FadeIn>

      {/* ─── 3-column month grid ─── */}
      <FadeIn delay={150}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 0,
          borderBottom: "2px solid #000",
        }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const monthNum = i + 1;
            const isPast = monthNum < currentMonth;
            const isExp = expanded === monthNum;

            return (
              <MonthCard
                key={monthNum}
                monthNum={monthNum}
                year={year}
                holidays={holidays}
                isPast={isPast}
                isExpanded={isExp}
                onToggle={() => toggleMonth(monthNum)}
              />
            );
          })}
        </div>
      </FadeIn>

      {/* ─── Next holiday callout ─── */}
      {nextHoliday && (
        <FadeIn delay={300}>
          <div className="grid grid-cols-3" style={{ borderBottom: "1px solid #e5e5e5" }}>
            <div style={{ padding: 24, borderRight: "1px solid #e5e5e5" }}>
              <p style={T.caption}>Next holiday</p>
              <p style={{ ...T.display, fontSize: 28, marginTop: 8 }}>{nextHoliday.name}</p>
            </div>
            <div style={{ padding: 24, borderRight: "1px solid #e5e5e5" }}>
              <p style={T.caption}>Date</p>
              <p style={{ ...T.body, marginTop: 8 }}>
                {new Date(nextHoliday.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
            <div style={{ padding: 24 }}>
              <p style={T.caption}>Days away</p>
              <p style={{ ...T.display, fontSize: 48, marginTop: 8, fontVariantNumeric: "tabular-nums" }}>
                <CountUp target={nextHoliday.daysAway} duration={800} />
              </p>
            </div>
          </div>
        </FadeIn>
      )}

      <Attribution />
    </div>
  );
}
