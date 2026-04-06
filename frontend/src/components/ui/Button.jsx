import { motion } from 'framer-motion';

export default function Button({ type = 'button', variant = 'primary', children, className = '', loading = false, ...props }) {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40',
    secondary: 'border border-white/20 bg-white/5 text-white hover:bg-white/10',
    danger: 'bg-rose-500/90 text-white hover:bg-rose-500',
  };

  return (
    <motion.button
      type={type}
      disabled={loading || props.disabled}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition-all ${variants[variant]} ${className} ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
      {...props}
    >
      {loading ? <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : null}
      {children}
    </motion.button>
  );
}
