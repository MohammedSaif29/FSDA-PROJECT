import { useEffect, useState } from 'react';
import { Activity, Bookmark, Download, Eye } from 'lucide-react';
import { getUser } from '../../hooks/useAuth';
import { getStudentActivity } from '../../api/studentService';
import StudentEmptyState from '../../components/student/StudentEmptyState';
import StudentResourceSkeleton from '../../components/student/StudentResourceSkeleton';

function ActivitySection({ title, description, icon: Icon, items, loading, emptyTitle, emptyDescription }) {
  return (
    <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">{title}</p>
          <p className="mt-2 text-sm text-slate-400">{description}</p>
        </div>
        <div className="rounded-2xl bg-white/[0.05] p-3 text-sky-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4">
          <StudentResourceSkeleton count={3} compact />
        </div>
      ) : items.length === 0 ? (
        <StudentEmptyState icon={Icon} title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={`${title}-${item.id}`} className="rounded-[24px] border border-white/10 bg-slate-950/35 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{item.author} • {item.category}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  {item.type}
                </span>
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-500">{item.timestamp}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function MyActivity() {
  const user = getUser();
  const [activity, setActivity] = useState({ downloads: [], viewed: [], saved: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadActivity = async () => {
      if (!user?.id) return;

      setLoading(true);
      setError('');

      try {
        const response = await getStudentActivity(user.id);
        setActivity(response);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load your activity.');
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [user?.id]);

  return (
    <div className="space-y-7">
      <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">My Activity</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Your recent learning trail</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Keep track of what you downloaded, viewed, and saved so you can jump back into study mode quickly.
            </p>
          </div>
          <div className="rounded-2xl bg-white/[0.05] p-3 text-sky-300">
            <Activity className="h-6 w-6" />
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-[28px] border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-3">
        <ActivitySection
          title="Recently Downloaded"
          description="Every resource you took offline."
          icon={Download}
          items={activity.downloads.slice(0, 8)}
          loading={loading}
          emptyTitle="No downloads yet"
          emptyDescription="Start exploring resources and your downloads will show up here."
        />
        <ActivitySection
          title="Recently Viewed"
          description="Resources you opened most recently."
          icon={Eye}
          items={activity.viewed.slice(0, 8)}
          loading={loading}
          emptyTitle="No recent views yet"
          emptyDescription="Open a resource detail page and we will keep track of it here."
        />
        <ActivitySection
          title="Saved Resources"
          description="Bookmarks ready for later review."
          icon={Bookmark}
          items={activity.saved.slice(0, 8)}
          loading={loading}
          emptyTitle="No saved resources yet"
          emptyDescription="Bookmark resources while browsing to build your study list."
        />
      </div>
    </div>
  );
}
