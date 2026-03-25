import { motion } from 'framer-motion';

export default function DashboardStatCard({ icon: Icon, label, value, accent, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${accent} p-6 shadow-[0_24px_60px_rgba(15,23,42,0.28)]`}
    >
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-white/10 blur-3xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-200/80">{label}</p>
          <p className="mt-4 text-4xl font-bold tracking-tight text-white">{value}</p>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/10 p-3 text-white shadow-inner shadow-white/10">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}
