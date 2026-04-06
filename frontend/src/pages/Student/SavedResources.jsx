import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import ResourceCard from '../../components/ResourceCard';
import StudentEmptyState from '../../components/student/StudentEmptyState';
import StudentResourceSkeleton from '../../components/student/StudentResourceSkeleton';
import { getUser } from '../../hooks/useAuth';
import { getStudentSavedResources } from '../../api/studentService';

export default function SavedResources() {
  const user = getUser();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSavedResources = async () => {
      if (!user?.id) return;

      setLoading(true);
      setError('');

      try {
        const response = await getStudentSavedResources(user.id);
        setResources(response);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load saved resources.');
      } finally {
        setLoading(false);
      }
    };

    loadSavedResources();
  }, [user?.id]);

  return (
    <div className="space-y-7">
      <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Saved Resources</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Your bookmarked learning library</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Everything you saved for later is gathered here so you can return to it when you are ready.
            </p>
          </div>
          <div className="rounded-2xl bg-white/[0.05] p-3 text-sky-300">
            <Bookmark className="h-6 w-6" />
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-[28px] border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <StudentResourceSkeleton count={8} />
          </div>
        ) : resources.length === 0 ? (
          <StudentEmptyState
            icon={Bookmark}
            title="No saved resources yet"
            description="Bookmark resources while browsing and they will appear here for quick access."
            actionLabel="Explore resources"
            onAction={() => navigate('/student/explore')}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
