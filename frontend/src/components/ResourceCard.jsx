import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, Download, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from './ui/Button';
import { getResourceDownloadUrl, resolveBackendUrl, saveResourceItem } from '../api/apiClient';
import { getUser } from '../hooks/useAuth';

const TYPE_IMAGE_FALLBACK = {
  TEXTBOOK: 'https://source.unsplash.com/400x300/?book',
  PAPER: 'https://source.unsplash.com/400x300/?research',
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const Highlight = ({ text = '', query = '' }) => {
  if (!query.trim()) return text;

  const matcher = new RegExp(`(${escapeRegExp(query)})`, 'ig');
  const parts = text.split(matcher);

  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={`${part}-${index}`} className="rounded bg-indigo-400/20 px-1 text-indigo-100">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    )
  );
};

const renderStars = (rating = 0) => {
  const normalized = Math.max(0, Math.min(5, Number(rating) || 0));

  return Array.from({ length: 5 }).map((_, index) => {
    const filled = index < Math.round(normalized);
    return (
      <Star
        key={`star-${index}`}
        className={`h-3.5 w-3.5 ${filled ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
      />
    );
  });
};

export default function ResourceCard({ resource, query = '', detailPathBase = '/student/resources', onSaved, onDownloaded }) {
  const user = getUser();
  const allowSave = user?.role !== 'ADMIN';
  const numericRating = Number(resource.rating ?? 0);
  const detailPath = `${detailPathBase}/${resource.id}`;

  const imageUrl = useMemo(() => {
    if (resource.imageUrl) {
      return resolveBackendUrl(resource.imageUrl);
    }

    if (resource.category) {
      return `https://source.unsplash.com/400x300/?${encodeURIComponent(resource.category.toLowerCase())}`;
    }

    return TYPE_IMAGE_FALLBACK[resource.type] || 'https://source.unsplash.com/400x300/?learning';
  }, [resource.category, resource.imageUrl, resource.type]);

  const handleDownload = async () => {
    try {
      onDownloaded?.(resource);
      window.open(getResourceDownloadUrl(resource.id), '_blank', 'noopener,noreferrer');
    } catch {
      // shared API layer already handles toast feedback
    }
  };

  const handleSave = async () => {
    try {
      await saveResourceItem(resource.id);
      onSaved?.(resource);
      toast.success(`Saved "${resource.title}" for later`);
    } catch {
      // API layer handles error feedback
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.25 }}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-xl shadow-slate-950/20 backdrop-blur-xl transition-all hover:border-indigo-400/30 hover:shadow-2xl hover:shadow-indigo-900/20"
    >
      <div className="relative h-48 overflow-hidden">
        <Link to={detailPath} className="block h-full">
          <img
            src={imageUrl}
            alt={resource.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/15 bg-slate-950/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-100 backdrop-blur">
            <Highlight text={resource.category || 'General'} query={query} />
          </span>
          <span className="rounded-full border border-indigo-400/25 bg-indigo-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-100 backdrop-blur">
            {resource.type}
          </span>
        </div>
        {allowSave ? (
          <button
            type="button"
            onClick={handleSave}
            className="absolute right-4 top-4 rounded-full border border-white/15 bg-slate-950/65 p-2 text-white/80 backdrop-blur transition hover:scale-105 hover:text-white"
          >
            <Bookmark className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">{renderStars(numericRating)}</div>
          <div className="text-right">
            <p className="text-sm font-semibold text-amber-300">{numericRating.toFixed(1)}</p>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{resource.downloadsCount || 0} downloads</p>
          </div>
        </div>

        <Link to={detailPath} className="mb-2 block">
          <h3 className="line-clamp-2 text-lg font-semibold text-white transition group-hover:text-indigo-200">
            <Highlight text={resource.title} query={query} />
          </h3>
        </Link>

        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-6 text-slate-400">
          <Highlight text={resource.description || 'No description provided for this resource.'} query={query} />
        </p>

        <div className="mb-5 border-t border-white/10 pt-4">
          <p className="text-sm font-medium text-slate-100">
            <Highlight text={resource.author || 'Unknown Author'} query={query} />
          </p>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Author</p>
        </div>

        <div className="mt-auto flex gap-3">
          <Button className="flex-1 justify-center rounded-full" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download
          </Button>
          {allowSave ? (
            <Button variant="secondary" className="flex-1 justify-center rounded-full" onClick={handleSave}>
              <Bookmark className="h-4 w-4" />
              Save
            </Button>
          ) : (
            <Link
              to={detailPath}
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-center font-semibold text-white transition-all hover:bg-white/10"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}
