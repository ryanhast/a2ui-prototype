export default function ListGroup({ title, items = [], ordered = false }) {
  const Tag = ordered ? "ol" : "ul";

  return (
    <div className="bg-surface-card border border-border rounded-xl p-5">
      {title && (
        <h4 className="text-xs font-medium text-text-muted uppercase tracking-wide mb-3">
          {title}
        </h4>
      )}
      <Tag className={`flex flex-col gap-2 ${ordered ? "list-decimal" : "list-none"} ${ordered ? "pl-4" : ""}`}>
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm">
            {!ordered && (
              <span className="text-primary mt-1.5 flex-shrink-0">
                <svg width="6" height="6" viewBox="0 0 6 6">
                  <circle cx="3" cy="3" r="3" fill="currentColor" />
                </svg>
              </span>
            )}
            <div className="flex flex-col gap-0.5">
              <span className="text-text font-medium text-sm">
                {typeof item === "string" ? item : item.label}
              </span>
              {typeof item === "object" && item.description && (
                <span className="text-xs text-text-secondary">{item.description}</span>
              )}
            </div>
          </li>
        ))}
      </Tag>
    </div>
  );
}
