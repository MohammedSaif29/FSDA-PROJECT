import { motion } from 'framer-motion';

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-[280px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-slate-950/40 px-6 py-12 text-center"
    >
      <div className="mb-5 rounded-3xl border border-white/10 bg-white/5 p-5 text-indigo-300 shadow-[0_10px_40px_rgba(99,102,241,0.18)]">
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">{description}</p>
      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-full border border-indigo-400/40 bg-indigo-500/15 px-5 py-2.5 text-sm font-semibold text-indigo-200 transition hover:bg-indigo-500/25"
        >
          {actionLabel}
        </button>
      ) : null}
    </motion.div>
  );
}
