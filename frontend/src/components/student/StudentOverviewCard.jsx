import { motion } from 'framer-motion';

export default function StudentOverviewCard({ icon: Icon, label, value, helper, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-[28px] border border-white/10 bg-gradient-to-br ${accent} p-5 shadow-xl shadow-slate-950/20 backdrop-blur-xl`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-300">{label}</p>
          <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
        </div>
        <div className="rounded-2xl bg-slate-950/25 p-3 text-white">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-300">{helper}</p>
    </motion.div>
  );
}
