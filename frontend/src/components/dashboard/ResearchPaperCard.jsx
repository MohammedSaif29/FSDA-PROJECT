import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Download, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../ui/Button';
import { getResourceAvailability, getResourceDownloadUrl, resolveBackendUrl } from '../../api/apiClient';
import { getResourceFallbackImage } from '../../lib/resourceMedia';

const PAPER_IMAGE_FALLBACK = {
  ai: 'https://source.unsplash.com/400x300/?ai,research',
  ml: 'https://source.unsplash.com/400x300/?machine-learning,research',
  physics: 'https://source.unsplash.com/400x300/?science,physics',
};

const getPaperImage = (resource) => {
  if (resource.imageUrl) return resolveBackendUrl(resource.imageUrl);

  const categoryKey = resource.category?.toLowerCase();
  return PAPER_IMAGE_FALLBACK[categoryKey] || getResourceFallbackImage(resource);
};

export default function ResearchPaperCard({ resource }) {
  const handleDownload = async () => {
    const availability = await getResourceAvailability(resource.id);
    if (!availability.downloadAvailable) {
      toast.error('This paper file is currently unavailable.');
      return;
    }
    window.open(getResourceDownloadUrl(resource.id), '_blank', 'noopener,noreferrer');
  };

  const publishedDate = new Date(resource.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-xl shadow-slate-950/20 backdrop-blur-xl transition-all hover:border-indigo-400/30 hover:shadow-2xl hover:shadow-indigo-900/20"
    >
      <div className="relative h-44 overflow-hidden">
        <Link to={`/student/resources/${resource.id}`} className="block h-full">
          <img
            src={getPaperImage(resource)}
            alt={resource.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-slate-950/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-100 backdrop-blur">
          Research Paper
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
          <FileText className="h-3.5 w-3.5" />
          <span>{publishedDate}</span>
        </div>

        <div>
          <Link to={`/student/resources/${resource.id}`}>
            <h3 className="line-clamp-2 text-lg font-semibold text-white">{resource.title}</h3>
          </Link>
          <p className="mt-2 text-sm text-indigo-200">{resource.author}</p>
        </div>

        <p className="line-clamp-4 text-sm leading-6 text-slate-400">
          {resource.description}
        </p>

        <Button className="w-full justify-center rounded-full" onClick={handleDownload}>
          <Download className="h-4 w-4" />
          Download paper
        </Button>
      </div>
    </motion.article>
  );
}
