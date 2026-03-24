export default function InputField({ label, icon: Icon, error, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-slate-200">{label}</label>}
      <div className="relative">
        {Icon ? <Icon className="absolute left-3 top-1/2 h-4 w-4 text-slate-400 -translate-y-1/2" /> : null}
        <input
          className={`w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-400 transition focus:border-indigo-400 focus:outline-none ${Icon ? 'pl-10' : 'pl-4'}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-rose-400">{error}</span>}
    </div>
  );
}
