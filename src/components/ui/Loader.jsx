export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 p-6 text-slate-200">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      <span>{message}</span>
    </div>
  );
}
