export function SkeletonMetrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-surface-card border border-border-light rounded-xl p-5 flex flex-col gap-2">
          <div className="skeleton h-3 w-20" />
          <div className="skeleton h-8 w-16" />
          <div className="skeleton h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-surface-card border border-border-light rounded-xl p-5">
      <div className="skeleton h-4 w-40 mb-4" />
      <div className="flex flex-col gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton h-5 flex-1" style={{ maxWidth: `${80 - i * 15}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-surface-card border border-border-light rounded-xl p-5">
      <div className="skeleton h-4 w-32 mb-4" />
      <div className="flex flex-col gap-2">
        <div className="skeleton h-8 w-full" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-surface-card border border-border-light rounded-xl p-5 flex flex-col gap-3">
          <div className="skeleton h-4 w-32" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-3/4" />
          <div className="flex gap-2 pt-1">
            <div className="skeleton h-7 w-20" />
            <div className="skeleton h-7 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
