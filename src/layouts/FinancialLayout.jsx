import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import Attribution from "../primitives/Attribution";
import FadeIn from "../motion/FadeIn";
import CountUp from "../motion/CountUp";

/*
  Typography: Google Sans Text only. Three sizes.
    Display:  48px / 400  — hero numbers
    Body:     14px / 400  — descriptions, labels
    Caption:  11px / 500  — metadata, axis labels
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

function Cell({ children, borderRight = false, borderBottom = false, style = {} }) {
  return (
    <div style={{
      padding: 24,
      borderRight: borderRight ? "1px solid #e5e5e5" : "none",
      borderBottom: borderBottom ? "1px solid #e5e5e5" : "none",
      ...style,
    }}>
      {children}
    </div>
  );
}

function fmtCurrency(val) {
  if (val >= 1000000) return { num: val / 1000000, suffix: "M", decimals: 1 };
  if (val >= 1000) return { num: val / 1000, suffix: "K", decimals: 0 };
  return { num: val, suffix: "", decimals: 0 };
}

function BreakdownRow({ category, amount, pct, maxPct }) {
  const barWidth = (pct / maxPct) * 100;
  const { num, suffix, decimals } = fmtCurrency(amount);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 80px",
      alignItems: "center",
      borderBottom: "1px solid #e5e5e5",
      padding: "12px 0",
    }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Bar */}
          <div style={{ flex: 1, height: 20, backgroundColor: "#f5f5f5", position: "relative" }}>
            <div style={{
              width: `${barWidth}%`,
              height: "100%",
              backgroundColor: "#000",
            }} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={T.body}>{category}</span>
          <span style={{ ...T.caption, fontVariantNumeric: "tabular-nums" }}>{pct}%</span>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <span style={{ ...T.body, fontVariantNumeric: "tabular-nums" }}>
          ${num.toFixed(decimals)}{suffix}
        </span>
      </div>
    </div>
  );
}

export default function FinancialLayout({ data, summary }) {
  const { title, period, kpis, chart, breakdown, insights } = data;

  const chartData = chart.months.map((month, i) => ({
    month,
    revenue: chart.revenue[i],
    expenses: chart.expenses[i],
  }));

  const maxPct = Math.max(...breakdown.map((b) => b.pct));

  // Compute net (revenue - expenses) for the latest month
  const latestRev = chart.revenue[chart.revenue.length - 1];
  const latestExp = chart.expenses[chart.expenses.length - 1];

  return (
    <div className="max-w-4xl mx-auto">

      {/* ─── Title bar ─── */}
      <FadeIn>
        <div style={{ borderBottom: "2px solid #000", paddingBottom: 16 }}>
          <p style={T.caption}>{period}</p>
          <h2 style={{ ...T.display, fontSize: "clamp(40px, 7vw, 64px)", letterSpacing: "-0.02em", marginTop: 4 }}>
            {title}
          </h2>
        </div>
      </FadeIn>

      {/* ─── Row 1: KPI numbers in 3-col grid ─── */}
      <FadeIn delay={100}>
        <div className="grid grid-cols-3" style={{ borderBottom: "1px solid #e5e5e5" }}>
          {kpis.slice(0, 3).map((kpi, i) => {
            const { num, suffix, decimals } = fmtCurrency(kpi.value);
            return (
              <Cell key={kpi.label} borderRight={i < 2}>
                <p style={T.caption}>{kpi.label}</p>
                <p style={{ ...T.display, marginTop: 8, fontVariantNumeric: "tabular-nums" }}>
                  $<CountUp target={num} decimals={decimals} duration={900} />{suffix}
                </p>
                <p style={{ ...T.caption, marginTop: 4, color: "#000" }}>
                  {kpi.trend === "up" ? "\u2191" : kpi.trend === "down" ? "\u2193" : "\u2192"} {kpi.trendValue}
                </p>
              </Cell>
            );
          })}
        </div>
        {/* Overflow KPIs in a second row */}
        {kpis.length > 3 && (
          <div className="grid grid-cols-3" style={{ borderBottom: "1px solid #e5e5e5" }}>
            {kpis.slice(3).map((kpi, i) => {
              const { num, suffix, decimals } = fmtCurrency(kpi.value);
              return (
                <Cell key={kpi.label} borderRight={i < kpis.slice(3).length - 1}>
                  <p style={T.caption}>{kpi.label}</p>
                  <p style={{ ...T.display, marginTop: 8, fontVariantNumeric: "tabular-nums" }}>
                    {kpi.format === "currency" ? "$" : ""}
                    <CountUp target={kpi.format === "currency" ? num : kpi.value} decimals={kpi.format === "currency" ? decimals : 0} duration={900} />
                    {kpi.format === "currency" ? suffix : ""}
                    {kpi.trendValue?.includes("pp") ? "%" : ""}
                  </p>
                  <p style={{ ...T.caption, marginTop: 4, color: "#000" }}>
                    {kpi.trend === "up" ? "\u2191" : kpi.trend === "down" ? "\u2193" : "\u2192"} {kpi.trendValue}
                  </p>
                </Cell>
              );
            })}
          </div>
        )}
      </FadeIn>

      {/* ─── Row 2: chart (2 cols) + annotations (1 col) ─── */}
      <FadeIn delay={250}>
        <div className="grid grid-cols-3" style={{ borderBottom: "1px solid #e5e5e5" }}>
          {/* Chart: spans 2 columns */}
          <div style={{
            gridColumn: "span 2",
            padding: 24,
            borderRight: "1px solid #e5e5e5",
          }}>
            <p style={{ ...T.caption, marginBottom: 12 }}>{chart.title}</p>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#000" stopOpacity={0.05} />
                      <stop offset="100%" stopColor="#000" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e5e5e5" strokeDasharray="2 4" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#999", fontFamily: "var(--md-ref-typeface-plain)" }}
                    axisLine={{ stroke: "#e5e5e5" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#999", fontFamily: "var(--md-ref-typeface-plain)" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 11,
                      fontFamily: "var(--md-ref-typeface-plain)",
                      border: "1px solid #e5e5e5",
                      boxShadow: "none",
                      background: "#fff",
                    }}
                    formatter={(v) => [`$${v}M`]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#000" strokeWidth={1.5} fill="url(#revGrad)" name="Revenue" />
                  <Area type="monotone" dataKey="expenses" stroke="#000" strokeWidth={1} strokeDasharray="4 3" fill="none" name="Expenses" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 16, height: 0, borderTop: "1.5px solid #000" }} />
                <span style={T.caption}>Revenue</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 16, height: 0, borderTop: "1px dashed #000" }} />
                <span style={T.caption}>Expenses</span>
              </div>
            </div>
          </div>

          {/* Annotations column */}
          <Cell>
            <p style={T.caption}>Latest month</p>
            <p style={{ ...T.display, fontSize: 36, marginTop: 8, fontVariantNumeric: "tabular-nums" }}>
              ${latestRev}M
            </p>
            <p style={{ ...T.caption, color: "#000", marginTop: 2 }}>Revenue</p>

            <div style={{ borderTop: "1px dashed #e5e5e5", marginTop: 20, paddingTop: 16 }}>
              <p style={{ ...T.display, fontSize: 36, fontVariantNumeric: "tabular-nums" }}>
                ${latestExp}M
              </p>
              <p style={{ ...T.caption, color: "#000", marginTop: 2 }}>Expenses</p>
            </div>

            <div style={{ borderTop: "1px dashed #e5e5e5", marginTop: 20, paddingTop: 16 }}>
              <p style={{ ...T.display, fontSize: 36, fontVariantNumeric: "tabular-nums" }}>
                ${(latestRev - latestExp).toFixed(1)}M
              </p>
              <p style={{ ...T.caption, color: "#000", marginTop: 2 }}>Net</p>
            </div>
          </Cell>
        </div>
      </FadeIn>

      {/* ─── Row 3: breakdown (2 cols) + insights (1 col) ─── */}
      <FadeIn delay={400}>
        <div className="grid grid-cols-3" style={{ borderBottom: "2px solid #000" }}>

          {/* Breakdown: spans 2 columns */}
          <div style={{
            gridColumn: "span 2",
            padding: 24,
            borderRight: "1px solid #e5e5e5",
          }}>
            <p style={{ ...T.caption, marginBottom: 8 }}>Expense breakdown</p>
            {breakdown.map((item) => (
              <BreakdownRow
                key={item.category}
                category={item.category}
                amount={item.amount}
                pct={item.pct}
                maxPct={maxPct}
              />
            ))}
          </div>

          {/* Insights */}
          <Cell>
            <p style={{ ...T.caption, marginBottom: 12 }}>Insights</p>
            {insights.map((item, i) => (
              <div key={i} style={{
                borderBottom: i < insights.length - 1 ? "1px solid #f5f5f5" : "none",
                paddingBottom: 10,
                marginBottom: 10,
              }}>
                <span style={{ ...T.body, color: "#555" }}>{item.text}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px dashed #e5e5e5", marginTop: 8, paddingTop: 12 }}>
              <p style={{ ...T.caption, marginBottom: 4 }}>Summary</p>
              <p style={{ ...T.body, color: "#555" }}>{summary}</p>
            </div>
          </Cell>
        </div>
      </FadeIn>

      <Attribution />
    </div>
  );
}
