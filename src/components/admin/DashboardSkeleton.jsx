export function DashboardHeroSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`stat-skeleton-${index}`}
          className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_24px_50px_rgba(15,23,42,0.18)]"
        >
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-24 rounded-full bg-white/10" />
            <div className="h-10 w-28 rounded-full bg-white/10" />
            <div className="h-12 w-12 rounded-2xl bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardPanelSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded-full bg-white/10" />
          <div className="h-72 rounded-3xl bg-gradient-to-r from-white/5 via-white/10 to-white/5" />
        </div>
      </div>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 rounded-full bg-white/10" />
          <div className="h-72 rounded-3xl bg-gradient-to-r from-white/5 via-white/10 to-white/5" />
        </div>
      </div>
    </div>
  );
}

export function ResourceGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`resource-skeleton-${index}`}
          className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
        >
          <div className="h-48 animate-pulse bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800" />
          <div className="space-y-4 p-5">
            <div className="h-4 w-20 animate-pulse rounded-full bg-white/10" />
            <div className="h-6 w-2/3 animate-pulse rounded-full bg-white/10" />
            <div className="h-4 w-full animate-pulse rounded-full bg-white/10" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-white/10" />
            <div className="h-4 w-1/3 animate-pulse rounded-full bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
