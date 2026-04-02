import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

const TOOLTIP_STYLE = {
  backgroundColor: "#0f0f0f",
  border: "none",
  borderRadius: "4px",
  padding: "6px 10px",
  fontSize: "12px",
  color: "#fff",
};

export default function BarChartComponent({
  title,
  data,
  orientation = "horizontal",
  valueLabel,
  compareMode = false,
}) {
  if (compareMode) {
    return (
      <div className="pt-2">
        {title && (
          <h4 className="text-[11px] font-medium uppercase tracking-[0.12em] opacity-60 mb-4">
            {title}
          </h4>
        )}
        <ResponsiveContainer width="100%" height={240}>
          <ReBarChart data={data} margin={{ top: 0, right: 0, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="rgba(0,0,0,0.15)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "rgba(0,0,0,0.6)", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "rgba(0,0,0,0.5)", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend
              wrapperStyle={{ fontSize: "11px", color: "rgba(0,0,0,0.6)", fontFamily: "DM Sans" }}
              iconType="square"
              iconSize={8}
            />
            <Bar dataKey="q1" name="Q1" fill="rgba(0,0,0,0.25)" radius={[2, 2, 0, 0]} barSize={18} />
            <Bar dataKey="q2" name="Q2" fill="rgba(0,0,0,0.75)" radius={[2, 2, 0, 0]} barSize={18} />
          </ReBarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (orientation === "horizontal") {
    return (
      <div className="pt-2">
        {title && (
          <h4 className="text-[11px] font-medium uppercase tracking-[0.12em] opacity-60 mb-4">
            {title}
          </h4>
        )}
        <ResponsiveContainer width="100%" height={data.length * 44 + 16}>
          <ReBarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="2 4" stroke="rgba(0,0,0,0.12)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: "rgba(0,0,0,0.5)", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 12, fill: "rgba(0,0,0,0.7)", fontFamily: "DM Sans" }}
              axisLine={false}
              tickLine={false}
              width={130}
            />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="value" radius={[0, 3, 3, 0]} barSize={22}>
              {data.map((entry, i) => (
                <Cell key={i} fill="rgba(0,0,0,0.75)" />
              ))}
            </Bar>
          </ReBarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Vertical
  return (
    <div className="pt-2">
      {title && (
        <h4 className="text-[11px] font-medium uppercase tracking-[0.12em] opacity-60 mb-4">
          {title}
        </h4>
      )}
      <ResponsiveContainer width="100%" height={240}>
        <ReBarChart data={data} margin={{ top: 0, right: 0, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="rgba(0,0,0,0.12)" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "rgba(0,0,0,0.6)", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "rgba(0,0,0,0.5)", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Bar dataKey="value" radius={[3, 3, 0, 0]} barSize={28}>
            {data.map((entry, i) => (
              <Cell key={i} fill="rgba(0,0,0,0.75)" />
            ))}
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}
