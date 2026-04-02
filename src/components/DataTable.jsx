import { useState, useMemo } from "react";
import RiskBadge from "./RiskBadge";

function parseCurrency(str) {
  const clean = str.replace(/[^0-9.KMBkmb-]/g, "");
  const num = parseFloat(clean);
  if (isNaN(num)) return NaN;
  if (/[Bb]$/i.test(clean)) return num * 1e9;
  if (/[Mm]$/i.test(clean)) return num * 1e6;
  if (/[Kk]$/i.test(clean)) return num * 1e3;
  return num;
}

export default function DataTable({
  columns,
  rows,
  sortable = false,
  highlightCondition,
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = (key) => {
    if (!sortable) return;
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];
      const aNum = typeof aVal === "string" ? parseCurrency(aVal) : aVal;
      const bNum = typeof bVal === "string" ? parseCurrency(bVal) : bVal;
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortDir === "asc" ? aNum - bNum : bNum - aNum;
      }
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, sortKey, sortDir]);

  const isHighlighted = (row) => {
    if (!highlightCondition) return false;
    return row[highlightCondition.column] === highlightCondition.value;
  };

  const renderCell = (row, col) => {
    const value = row[col.key];
    if (col.key === "risk" || (typeof value === "string" && ["High", "Medium", "Low"].includes(value))) {
      return <RiskBadge level={value} />;
    }
    return value;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.2)" }}>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className={`px-3 py-3 text-[10px] font-medium uppercase tracking-[0.12em] opacity-55 ${
                  sortable ? "cursor-pointer hover:opacity-100 select-none" : ""
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {sortable && sortKey === col.key && (
                    <svg width="10" height="10" viewBox="0 0 12 12">
                      <path
                        d={sortDir === "asc" ? "M6 3L10 7H2L6 3Z" : "M6 9L2 5H10L6 9Z"}
                        fill="currentColor"
                      />
                    </svg>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, i) => (
            <tr
              key={i}
              className="transition-colors"
              style={{
                borderBottom: "1px solid rgba(0,0,0,0.1)",
                backgroundColor: isHighlighted(row) ? "rgba(0,0,0,0.07)" : "transparent",
              }}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-2.5 text-sm whitespace-nowrap">
                  {renderCell(row, col)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
