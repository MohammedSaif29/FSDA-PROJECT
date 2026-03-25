export default function StudentResourceSkeleton({ count = 4, compact = false }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`student-skeleton-${index}`}
          className={`overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] ${compact ? 'h-[180px]' : 'h-[430px]'} animate-pulse`}
        >
          <div className={`${compact ? 'h-24' : 'h-48'} bg-white/5`} />
          <div className="space-y-3 p-5">
            <div className="h-4 w-2/3 rounded-full bg-white/10" />
            <div className="h-3 w-1/2 rounded-full bg-white/10" />
            <div className="h-3 w-full rounded-full bg-white/10" />
            <div className="h-3 w-5/6 rounded-full bg-white/10" />
          </div>
        </div>
      ))}
    </>
  );
}
