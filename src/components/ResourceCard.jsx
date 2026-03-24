import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Download } from 'lucide-react';

export default function ResourceCard({ resource }) {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-950/60 p-4 backdrop-blur-lg transition"
    >
      <div className="relative mb-4 h-44 overflow-hidden rounded-xl bg-slate-800">
        {resource.imageUrl ? (
          <img src={resource.imageUrl.startsWith('http') ? resource.imageUrl : `http://localhost:8080${resource.imageUrl}`} alt={resource.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">No image</div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span className="rounded-full bg-indigo-500/20 px-2 py-1">{resource.category || 'General'}</span>
          <span className="inline-flex items-center gap-1">{resource.rating?.toFixed(1) || 'N/A'} <Star className="h-3.5 w-3.5 text-amber-300" /></span>
        </div>
        <Link to={`/resources/${resource.id}`} className="text-lg font-bold leading-snug text-slate-100 hover:text-indigo-300 transition">
          {resource.title}
        </Link>
        <p className="line-clamp-2 text-sm text-slate-300">{resource.description || 'No description available.'}</p>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{resource.author || 'Unknown author'}</span>
          <span className="inline-flex items-center gap-1"><Download className="h-3.5 w-3.5" />{resource.downloadsCount || 0}</span>
        </div>
      </div>
    </motion.article>
  );
}
