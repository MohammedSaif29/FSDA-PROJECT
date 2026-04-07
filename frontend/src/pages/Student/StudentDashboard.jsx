import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Clock3, Compass, Download, Eye, Sparkles } from 'lucide-react';
import ResourceCard from '../../components/ResourceCard';
import Button from '../../components/ui/Button';
import StudentOverviewCard from '../../components/student/StudentOverviewCard';
import StudentEmptyState from '../../components/student/StudentEmptyState';
import StudentResourceSkeleton from '../../components/student/StudentResourceSkeleton';
import { getUser } from '../../hooks/useAuth';
import {
  getStudentActivity,
  getStudentDashboard,
  getStudentRecommendations,
} from '../../api/studentService';

function ActivityList({ items, emptyCopy, actionLabel, onAction }) {
  if (items.length === 0) {
    return (
      <StudentEmptyState
        icon={Clock3}
        title={emptyCopy.title}
        description={emptyCopy.description}
        actionLabel={actionLabel}
        onAction={onAction}
      />
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={`${item.resourceId}-${item.id}`} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-white">{item.title}</p>
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
  );
}

export default function StudentDashboard() {
  const user = getUser();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [activity, setActivity] = useState({ downloads: [], viewed: [], saved: [] });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStudentDashboard = async () => {
      if (!user?.id) return;

      setLoading(true);
      setError('');

      try {
        const [dashboardResponse, activityResponse, recommendationResponse] = await Promise.all([
          getStudentDashboard(user.id),
          getStudentActivity(user.id),
          getStudentRecommendations(user.id),
        ]);

        setDashboard(dashboardResponse);
        setActivity(activityResponse);
        setRecommendations(recommendationResponse);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load your student dashboard.');
      } finally {
        setLoading(false);
      }
    };

    loadStudentDashboard();
  }, [user?.id]);

  const quickStats = useMemo(() => ([
    {
      label: 'Downloads',
      value: dashboard?.downloadsCount ?? 0,
      helper: 'Track everything you have taken offline.',
      icon: Download,
      accent: 'from-sky-500/20 via-sky-500/10 to-transparent',
    },
    {
      label: 'Saved Resources',
      value: dashboard?.savedResourcesCount ?? 0,
      helper: 'Your bookmarked library for later review.',
      icon: Bookmark,
      accent: 'from-indigo-500/20 via-indigo-500/10 to-transparent',
    },
    {
      label: 'Recently Viewed',
      value: dashboard?.recentlyViewedCount ?? 0,
      helper: 'Resources you explored most recently.',
      icon: Eye,
      accent: 'from-fuchsia-500/20 via-fuchsia-500/10 to-transparent',
    },
  ]), [dashboard]);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
        <div className="absolute -right-14 top-0 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-sky-200">
              <Sparkles className="h-4 w-4" />
              Student learning hub
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white">Welcome back, {user?.username}</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              Pick up where you left off, discover fresh material, and build a focused personal library for your next study session.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button className="rounded-full px-5" onClick={() => navigate('/student/explore')}>
              <Compass className="h-4 w-4" />
              Explore Resources
            </Button>
            <Button variant="secondary" className="rounded-full px-5" onClick={() => navigate('/student/saved')}>
              <Bookmark className="h-4 w-4" />
              View Saved
            </Button>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-[28px] border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {quickStats.map((item) => (
          <StudentOverviewCard key={item.label} {...item} />
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Recommended for You</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Smart picks from your study behavior</h2>
            <p className="mt-2 text-sm text-slate-400">
              {recommendations[0]?.reason || 'We use your downloads and views to keep this feed relevant.'}
            </p>
          </div>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-3">
          {loading ? (
            <StudentResourceSkeleton count={4} />
          ) : recommendations.length === 0 ? (
            <div className="w-full">
              <StudentEmptyState
                icon={Compass}
                title="No recommendations yet"
                description="Start exploring resources and your personalized suggestions will appear here."
                actionLabel="Explore resources"
                onAction={() => navigate('/student/explore')}
              />
            </div>
          ) : (
            recommendations.slice(0, 8).map((resource) => (
              <div key={resource.id} className="w-[85vw] min-w-[260px] max-w-[310px] sm:w-[310px]">
                <ResourceCard resource={resource} />
              </div>
            ))
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Recently Downloaded</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Your offline-ready resources</h2>
            </div>
            <Download className="h-5 w-5 text-sky-300" />
          </div>

          {loading ? (
            <div className="grid gap-4">
              <StudentResourceSkeleton count={3} compact />
            </div>
          ) : (
            <ActivityList
              items={activity.downloads.slice(0, 4)}
              emptyCopy={{
                title: 'No downloads yet',
                description: 'Start exploring resources and your recent downloads will appear here.',
              }}
              actionLabel="Start exploring"
              onAction={() => navigate('/student/explore')}
            />
          )}
        </div>

        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Recently Viewed</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Continue where you left off</h2>
            </div>
            <Eye className="h-5 w-5 text-sky-300" />
          </div>

          {loading ? (
            <div className="grid gap-4">
              <StudentResourceSkeleton count={3} compact />
            </div>
          ) : (
            <ActivityList
              items={activity.viewed.slice(0, 4)}
              emptyCopy={{
                title: 'No recently viewed items',
                description: 'Open a resource and we will keep your recent trail here.',
              }}
              actionLabel="Browse library"
              onAction={() => navigate('/student/explore')}
            />
          )}
        </div>
      </section>
    </div>
  );
}
