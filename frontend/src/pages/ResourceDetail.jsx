import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getResourceAvailability, getResourceById, getResourceDownloadUrl, recordResourceView, resolveBackendUrl, saveResourceItem } from '../api/apiClient';
import { Minus, ArrowLeft, Download as DownloadIcon, Star, BookOpen, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { toast } from 'react-hot-toast';
import { getUser } from '../hooks/useAuth';
import { getResourceFallbackImage } from '../lib/resourceMedia';

export default function ResourceDetail() {
  const { id } = useParams();
  const user = getUser();
  const [resource, setResource] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const isAdmin = user?.role === 'ADMIN';
  const backPath = isAdmin ? '/admin/resources' : '/student/explore';

  useEffect(() => {
    const fetchResource = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getResourceById(id);
        setResource(data);
        setReviews(data.reviews || []);
        if (!isAdmin) {
          await recordResourceView(id);
        }
      } catch (err) {
        setError('Could not load resource.');
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id, isAdmin]);

  const addFeedback = (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast.error('Feedback cannot be empty.');
      return;
    }

    const newReview = {
      id: Date.now(),
      user: 'You',
      date: 'Just now',
      text: feedback,
      rating: 5,
    };

    setReviews((prev) => [newReview, ...prev]);
    setFeedback('');
    toast.success('Feedback added');
  };

  const handleDownload = async () => {
    if (!resource) return;

    try {
      const availability = await getResourceAvailability(resource.id);
      if (!availability.downloadAvailable) {
        toast.error('This file is missing from local storage. Please re-upload it from the admin panel.');
        return;
      }
      window.open(getResourceDownloadUrl(resource.id), '_blank', 'noopener,noreferrer');
    } catch {
      toast.error('Unable to open this resource right now.');
    }
  };

  const handleSave = async () => {
    if (!resource) return;

    try {
      await saveResourceItem(resource.id);
      toast.success('Saved to your library');
    } catch {
      // API layer handles errors
    }
  };

  if (loading) return <Loader message="Loading resource details..." />;
  if (error) return <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-rose-200">{error}</div>;

  return (
    <div className="space-y-6">
      <Link to={backPath} className="text-indigo-400 hover:text-indigo-200 inline-flex items-center gap-1 text-sm font-semibold">
        <ArrowLeft className="h-4 w-4" /> Back to resources
      </Link>

      <section className="glass-panel p-6">
        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          <div className="relative overflow-hidden rounded-2xl bg-slate-800">
            <img
              src={resource.imageUrl && !imageError ? resolveBackendUrl(resource.imageUrl) : getResourceFallbackImage(resource)}
              alt={resource.title}
              onError={() => setImageError(true)}
              className="h-64 w-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <span className="rounded-full bg-indigo-500/20 px-2 py-1">{resource.category || 'General'}</span>
              <span className="rounded-full bg-slate-700/50 px-2 py-1">{resource.type || 'Resource'}</span>
            </div>
            <h1 className="text-3xl font-bold text-white">{resource.title}</h1>
            <p className="text-slate-400">By {resource.author || 'Unknown Author'}</p>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 text-amber-400" />{resource.rating ?? 'N/A'}</span>
              <span className="inline-flex items-center gap-1"><DownloadIcon className="h-4 w-4" /> {resource.downloadsCount || 0} downloads</span>
              <span className="inline-flex items-center gap-1"><Minus className="h-4 w-4" /> {resource.pages || '--'} pages</span>
            </div>

            <div className="flex gap-3">
              <Button variant="primary" onClick={handleDownload}><DownloadIcon className="h-4 w-4" /> Download</Button>
              {!isAdmin ? <Button variant="secondary" onClick={handleSave} >Save</Button> : null}
            </div>
            {resource.fileUrl?.startsWith('/uploads/') ? (
              <p className="flex items-center gap-2 text-sm text-amber-300">
                <AlertCircle className="h-4 w-4" />
                This item uses local uploads. If the file was deleted from storage, it must be re-uploaded.
              </p>
            ) : null}
          </div>
        </div>

        <article className="mt-6">
          <h2 className="mb-3 text-xl font-semibold">Overview</h2>
          <p className="text-slate-300 leading-relaxed">{resource.description || 'No description available.'}</p>
        </article>
      </section>

      {!isAdmin ? (
        <section className="glass-panel p-6">
          <h3 className="mb-3 text-xl font-semibold">Give Feedback</h3>
          <form onSubmit={addFeedback} className="flex flex-col gap-2">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="form-control"
              placeholder="Share your thoughts..."
            />
            <Button type="submit">Submit Feedback</Button>
          </form>

          <div className="mt-6 space-y-3">
            {reviews.length === 0 ? (
              <p className="text-slate-400">No feedback yet.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="rounded-xl border border-white/10 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>{review.user}</span>
                    <span>{review.date}</span>
                  </div>
                  <p className="mt-2 text-slate-200">{review.text}</p>
                </div>
              ))
            )}
          </div>
        </section>
      ) : (
        <section className="glass-panel p-6">
          <h3 className="mb-3 text-xl font-semibold">Admin Actions</h3>
          <p className="text-slate-300">
            This resource is available for secure download. Uploading and catalog management remain restricted to admins only.
          </p>
        </section>
      )}
    </div>
  );
}

