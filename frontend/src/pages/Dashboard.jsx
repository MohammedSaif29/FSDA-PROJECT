import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Activity,
  ArrowRight,
  BookOpen,
  Download,
  GraduationCap,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';
import ResourceCard from '../components/ResourceCard';
import ResearchPaperCard from '../components/dashboard/ResearchPaperCard';
import Button from '../components/ui/Button';
import { getDashboardContent } from '../api/dashboardService';
import { getUser } from '../hooks/useAuth';
import useDebouncedValue from '../hooks/useDebouncedValue';

const CATEGORY_ART = {
  Physics: 'https://source.unsplash.com/400x300/?physics',
  'Computer Science': 'https://source.unsplash.com/400x300/?computer-science',
  Mathematics: 'https://source.unsplash.com/400x300/?mathematics',
  Chemistry: 'https://source.unsplash.com/400x300/?chemistry',
  Economics: 'https://source.unsplash.com/400x300/?economics',
  AI: 'https://source.unsplash.com/400x300/?artificial-intelligence',
  ML: 'https://source.unsplash.com/400x300/?machine-learning',
};

const currencyFormatter = new Intl.NumberFormat('en-US', { notation: 'compact' });

function AnimatedCounter({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const target = Number(value) || 0;
    let frame = 0;
    const totalFrames = 24;

    const interval = window.setInterval(() => {
      frame += 1;
      const progress = frame / totalFrames;
      setDisplayValue(Math.round(target * progress));

      if (frame >= totalFrames) {
        window.clearInterval(interval);
      }
    }, 24);

    return () => window.clearInterval(interval);
  }, [value]);

  return <span>{currencyFormatter.format(displayValue)}</span>;
}

function ChartTooltip({ active, payload, label, suffix }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/95 px-4 py-3 shadow-2xl">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">
        {payload[0].value} {suffix}
      </p>
    </div>
  );
}

function CategoryShowcaseCard({ category, active, onClick }) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -6 }}
      onClick={onClick}
      className={`group relative min-w-[250px] overflow-hidden rounded-[28px] border ${
        active ? 'border-indigo-400/40 shadow-indigo-900/30' : 'border-white/10'
      } bg-white/[0.04] text-left shadow-xl shadow-slate-950/20 backdrop-blur-xl transition`}
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={CATEGORY_ART[category.name] || `https://source.unsplash.com/400x300/?${encodeURIComponent(category.name.toLowerCase())}`}
          alt={category.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className={`text-lg font-semibold transition ${active ? 'text-indigo-200' : 'text-white group-hover:text-indigo-200'}`}>
          {category.name}
        </p>
        <p className="mt-1 text-sm text-slate-300">{category.count} resources</p>
      </div>
    </motion.button>
  );
}

export default function Dashboard() {
  const user = getUser();
  const [dashboardData, setDashboardData] = useState({
    resources: [],
    analytics: [],
    activity: [],
    recommendations: [],
    overview: {
      totalUsers: 0,
      totalDownloads: 0,
      totalResources: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const debouncedSearch = useDebouncedValue(search, 300).trim().toLowerCase();

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getDashboardContent(user?.id);
        setDashboardData(data);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load dashboard content.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user?.id]);

  const categorySummary = useMemo(() => {
    const preferredOrder = ['Physics', 'Computer Science', 'Mathematics', 'Chemistry', 'Economics', 'AI', 'ML'];
    const counts = dashboardData.resources.reduce((accumulator, resource) => {
      accumulator[resource.category] = (accumulator[resource.category] || 0) + 1;
      return accumulator;
    }, {});

    return preferredOrder
      .filter((category) => counts[category])
      .map((category) => ({ name: category, count: counts[category] }));
  }, [dashboardData.resources]);

  const filteredResources = useMemo(() => {
    return dashboardData.resources.filter((resource) => {
      const matchesCategory = selectedCategory === 'All' || resource.category?.toLowerCase() === selectedCategory.toLowerCase();
      const haystack = [resource.title, resource.description, resource.author, resource.category]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return matchesCategory && (!debouncedSearch || haystack.includes(debouncedSearch));
    });
  }, [dashboardData.resources, selectedCategory, debouncedSearch]);

  const latestPapers = useMemo(() => {
    return dashboardData.resources
      .filter((resource) => resource.type === 'PAPER')
      .filter((resource) => selectedCategory === 'All' || resource.category?.toLowerCase() === selectedCategory.toLowerCase())
      .filter((resource) => {
        const haystack = [resource.title, resource.description, resource.author, resource.category]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return !debouncedSearch || haystack.includes(debouncedSearch);
      })
      .slice(0, 6);
  }, [dashboardData.resources, selectedCategory, debouncedSearch]);

  const topDownloadedResources = useMemo(() => {
    return [...dashboardData.resources]
      .sort((a, b) => (b.downloadsCount || 0) - (a.downloadsCount || 0))
      .slice(0, 5)
      .map((resource) => ({
        name: resource.title.length > 22 ? `${resource.title.slice(0, 22)}...` : resource.title,
        downloads: resource.downloadsCount || 0,
      }));
  }, [dashboardData.resources]);

  const recommendationSubtitle = dashboardData.recommendations[0]?.reason || 'Recommended from your recent activity';

  const skeletonCards = Array.from({ length: 8 });

  return (
    <div className="space-y-10 text-white">
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-slate-950/25 backdrop-blur-xl">
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-indigo-200 backdrop-blur">
              <Sparkles className="mr-2 h-4 w-4" />
              Intelligent learning dashboard
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">
              Welcome back, {user?.username || 'Learner'}
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Discover high-value textbooks, research papers, and personalized recommendations in a dashboard designed to feel like Netflix for learning.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Total Users', value: dashboardData.overview.totalUsers, icon: Users },
              { label: 'Total Downloads', value: dashboardData.overview.totalDownloads, icon: Download },
              { label: 'Resources Count', value: dashboardData.overview.totalResources, icon: BookOpen },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[26px] border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20 backdrop-blur"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-400">{item.label}</p>
                  <item.icon className="h-5 w-5 text-indigo-300" />
                </div>
                <p className="mt-4 text-3xl font-bold text-white">
                  <AnimatedCounter value={item.value} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">Recommended for You</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Curated from your learning patterns</h2>
            <p className="mt-2 text-sm text-slate-400">{recommendationSubtitle}</p>
          </div>
        </div>

        <div className="flex snap-x gap-5 overflow-x-auto pb-2">
          {(loading ? skeletonCards.slice(0, 6) : dashboardData.recommendations).map((resource, index) => (
            <div key={loading ? `recommended-skeleton-${index}` : resource.id} className="min-w-[310px] snap-start">
              {loading ? (
                <div className="h-[420px] animate-pulse rounded-[28px] border border-white/10 bg-white/[0.04]" />
              ) : (
                <ResourceCard resource={resource} />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">Download Analytics</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">See what learners engage with most</h2>
          </div>

          {loading ? (
            <div className="h-[340px] animate-pulse rounded-3xl bg-white/5" />
          ) : (
            <div className="grid gap-6 xl:grid-cols-2">
              <div className="h-[300px] rounded-[28px] border border-white/10 bg-slate-950/35 p-4">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Downloads trend</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData.analytics}>
                    <defs>
                      <linearGradient id="downloadsStroke" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#38bdf8" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip suffix="downloads" />} />
                    <Line type="monotone" dataKey="count" stroke="url(#downloadsStroke)" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="h-[300px] rounded-[28px] border border-white/10 bg-slate-950/35 p-4">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Top downloaded resources</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topDownloadedResources}>
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip suffix="downloads" />} />
                    <Bar dataKey="downloads" radius={[10, 10, 0, 0]} fill="#818cf8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">Recent Activity</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">What your learners did last</h2>
            </div>
            <Activity className="h-5 w-5 text-indigo-300" />
          </div>

          <div className="space-y-4">
            {(loading ? skeletonCards.slice(0, 5) : dashboardData.activity).map((item, index) => (
              <div
                key={loading ? `activity-skeleton-${index}` : item.id}
                className="rounded-[24px] border border-white/10 bg-slate-950/35 p-4"
              >
                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 w-3/4 rounded-full bg-white/10" />
                    <div className="h-3 w-1/2 rounded-full bg-white/10" />
                  </div>
                ) : (
                  <>
                    <p className="text-sm leading-6 text-slate-200">
                      <span className="font-semibold text-white">{item.userName}</span> {item.action}{' '}
                      <span className="font-semibold text-indigo-200">{item.resourceTitle}</span>
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-500">
                      <span>{item.category}</span>
                      <span>{item.activityTime}</span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">Browse by Categories</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Start from the subjects you care about most</h2>
          </div>
          <Button variant="secondary" className="rounded-full px-5 py-3" onClick={() => setSelectedCategory('All')}>
            <ArrowRight className="h-4 w-4" />
            Reset filter
          </Button>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-3">
          {categorySummary.map((category) => (
            <CategoryShowcaseCard
              key={category.name}
              category={category}
              active={selectedCategory === category.name}
              onClick={() => setSelectedCategory(category.name)}
            />
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">All Resources</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Books, guides, and research in one intelligent library</h2>
          </div>
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, author, or category..."
              className="w-full rounded-full border border-white/10 bg-slate-950/35 py-3 pl-11 pr-4 text-sm text-slate-100 outline-none transition focus:border-indigo-400/40"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {skeletonCards.map((_, index) => (
              <div key={`resource-skeleton-${index}`} className="h-[430px] animate-pulse rounded-[28px] border border-white/10 bg-white/[0.04]" />
            ))}
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-slate-950/35 text-center">
            <GraduationCap className="h-12 w-12 text-slate-600" />
            <p className="mt-5 text-lg font-medium text-slate-200">No resources match your search right now</p>
            <p className="mt-2 text-sm text-slate-500">Try another category or broaden your search query.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} query={debouncedSearch} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">Latest Research Papers</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Fresh papers across AI, science, and applied research</h2>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {skeletonCards.slice(0, 6).map((_, index) => (
              <div key={`paper-skeleton-${index}`} className="h-[420px] animate-pulse rounded-[28px] border border-white/10 bg-white/[0.04]" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {latestPapers.map((resource) => (
              <ResearchPaperCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
