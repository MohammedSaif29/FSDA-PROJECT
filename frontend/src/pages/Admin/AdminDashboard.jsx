import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  BookOpen,
  Database,
  Download,
  FileText,
  LayoutGrid,
  RefreshCcw,
  Search,
  Users,
} from 'lucide-react';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Button from '../../components/ui/Button';
import ResourceCard from '../../components/ResourceCard';
import DashboardStatCard from '../../components/admin/DashboardStatCard';
import EmptyState from '../../components/admin/EmptyState';
import {
  DashboardHeroSkeleton,
  DashboardPanelSkeleton,
  ResourceGridSkeleton,
} from '../../components/admin/DashboardSkeleton';
import { getAdminDashboardData } from '../../api/adminService';
import useDebouncedValue from '../../hooks/useDebouncedValue';

const STAT_CARD_ACCENTS = [
  'from-indigo-600 via-indigo-500 to-blue-500',
  'from-emerald-600 via-teal-500 to-cyan-500',
  'from-fuchsia-600 via-violet-500 to-indigo-500',
  'from-amber-500 via-orange-500 to-rose-500',
];

const CHART_COLORS = ['#818cf8', '#38bdf8', '#22c55e', '#f59e0b', '#f472b6', '#fb7185'];

const PRESET_CATEGORY_CHIPS = [
  { label: 'All', value: 'All' },
  { label: 'Physics', value: 'Physics' },
  { label: 'CS', value: 'Computer Science' },
  { label: 'Math', value: 'Mathematics' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/95 px-4 py-3 shadow-2xl">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{payload[0].value} downloads</p>
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/95 px-4 py-3 shadow-2xl">
      <p className="text-sm font-semibold text-white">{payload[0].name}</p>
      <p className="mt-1 text-sm text-slate-300">{payload[0].value} resources</p>
    </div>
  );
};

const formatCompactNumber = (value) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value ?? 0);

const matchesCategory = (resourceCategory, selectedCategory) => {
  if (selectedCategory === 'All') return true;
  return resourceCategory?.toLowerCase() === selectedCategory.toLowerCase();
};

const matchesSearch = (resource, query) => {
  if (!query) return true;

  const haystack = [resource.title, resource.description, resource.author, resource.category]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(query);
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalResources: 0,
      totalDownloads: 0,
      activeUsers: 0,
    },
    downloadsTrend: [],
    categoryStats: [],
    recentActivity: [],
    resources: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const debouncedSearch = useDebouncedValue(search, 300).trim().toLowerCase();

  const loadDashboard = async ({ showRefresh = false } = {}) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      setError('');
      const nextData = await getAdminDashboardData();
      setDashboardData(nextData);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Unable to load admin dashboard.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const categoryChips = useMemo(() => {
    const dynamicCategories = dashboardData.resources
      .map((resource) => resource.category)
      .filter(Boolean)
      .filter((value, index, array) => array.indexOf(value) === index)
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({ label: value, value }));

    const seen = new Set();

    return [...PRESET_CATEGORY_CHIPS, ...dynamicCategories].filter((chip) => {
      if (seen.has(chip.value)) return false;
      seen.add(chip.value);
      return true;
    });
  }, [dashboardData.resources]);

  const filteredResources = useMemo(() => {
    return dashboardData.resources.filter((resource) => {
      return matchesCategory(resource.category, selectedCategory) && matchesSearch(resource, debouncedSearch);
    });
  }, [dashboardData.resources, selectedCategory, debouncedSearch]);

  const topCategories = useMemo(() => dashboardData.categoryStats.slice(0, 4), [dashboardData.categoryStats]);

  const totalTrendDownloads = useMemo(
    () => dashboardData.downloadsTrend.reduce((sum, point) => sum + point.downloads, 0),
    [dashboardData.downloadsTrend]
  );

  const statCards = useMemo(
    () => [
      { label: 'Total Users', value: formatCompactNumber(dashboardData.stats.totalUsers), icon: Users },
      { label: 'Total Resources', value: formatCompactNumber(dashboardData.stats.totalResources), icon: FileText },
      { label: 'Total Downloads', value: formatCompactNumber(dashboardData.stats.totalDownloads), icon: Download },
      { label: 'Active Users', value: formatCompactNumber(dashboardData.stats.activeUsers), icon: Activity },
    ],
    [dashboardData.stats]
  );

  return (
    <div className="space-y-8 text-white">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">Overview</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-white">Monitor platform health in real time</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            Review adoption, see what learners download, compare category demand, and keep your resource library polished from one admin cockpit.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" className="rounded-full px-5 py-3" onClick={() => loadDashboard({ showRefresh: true })} loading={refreshing}>
            <RefreshCcw className="h-4 w-4" />
            Refresh Data
          </Button>
          <Link to="/admin/resources">
            <Button className="rounded-full px-5 py-3">
              <Database className="h-4 w-4" />
              Manage Resources
            </Button>
          </Link>
        </div>
      </motion.section>

      {error ? (
        <EmptyState
          icon={Database}
          title="Dashboard data is unavailable"
          description={error}
          actionLabel="Retry loading"
          onAction={() => loadDashboard()}
        />
      ) : null}

      {loading ? (
        <>
          <DashboardHeroSkeleton />
          <DashboardPanelSkeleton />
          <ResourceGridSkeleton />
        </>
      ) : (
        <>
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card, index) => (
              <DashboardStatCard
                key={card.label}
                icon={card.icon}
                label={card.label}
                value={card.value}
                accent={STAT_CARD_ACCENTS[index]}
                delay={index * 0.08}
              />
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.22)]"
            >
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Downloads Over Time</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Weekly download trend</h3>
                </div>
                <div className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-200">
                  {formatCompactNumber(totalTrendDownloads)} this week
                </div>
              </div>

              {totalTrendDownloads === 0 ? (
                <EmptyState
                  icon={Download}
                  title="No download activity yet"
                  description="When learners start downloading resources, the trend line will appear here automatically."
                />
              ) : (
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboardData.downloadsTrend} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="downloads"
                        stroke="#818cf8"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#818cf8', strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: '#c4b5fd', strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.22)]"
            >
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Resources By Category</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Inventory mix</h3>
              </div>

              {dashboardData.categoryStats.length === 0 ? (
                <EmptyState
                  icon={LayoutGrid}
                  title="No resource categories yet"
                  description="Publish or approve resources to see category distribution here."
                />
              ) : (
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.categoryStats}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={72}
                        outerRadius={108}
                        paddingAngle={4}
                      >
                        {dashboardData.categoryStats.map((entry, index) => (
                          <Cell key={`cell-${entry.name}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                      <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ color: '#cbd5e1' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.22)]"
            >
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Resource Library</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Search and filter approved resources</h3>
                </div>
                <div className="relative w-full max-w-sm">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search title, author, category..."
                    className="w-full rounded-full border border-white/10 bg-slate-900/80 py-3 pl-11 pr-4 text-sm text-slate-100 outline-none transition focus:border-indigo-400/40 focus:bg-slate-900"
                  />
                </div>
              </div>

              <div className="mb-6 flex flex-wrap gap-3">
                {categoryChips.map((chip) => (
                  <button
                    key={chip.value}
                    type="button"
                    onClick={() => setSelectedCategory(chip.value)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      selectedCategory === chip.value
                        ? 'bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-400/40'
                        : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {dashboardData.resources.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title="No resources available"
                  description="Approve or upload resources to populate the dashboard library with rich previews and analytics."
                  actionLabel="Go to resource manager"
                  onAction={() => navigate('/admin/resources')}
                />
              ) : filteredResources.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="No resources match your filters"
                  description="Try a broader search term or switch to another category chip."
                  actionLabel="Clear filters"
                  onAction={() => {
                    setSearch('');
                    setSelectedCategory('All');
                  }}
                />
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredResources.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} detailPathBase="/admin/resources" />
                  ))}
                </div>
              )}
            </motion.div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.22)]"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Recent Activity</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">Latest download actions</h3>
                  </div>
                </div>

                {dashboardData.recentActivity.length === 0 ? (
                  <EmptyState
                    icon={Activity}
                    title="No recent activity"
                    description="Download events will appear here once users start interacting with resources."
                  />
                ) : (
                  <div className="space-y-4">
                    {dashboardData.recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.12)]"
                      >
                        <p className="text-sm font-semibold text-slate-100">
                          <span className="text-indigo-300">{activity.userName}</span> {activity.action}{' '}
                          <span className="text-white">{activity.resourceTitle}</span>
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">{activity.activityTime}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 }}
                className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.22)]"
              >
                <div className="mb-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Top Categories</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Highest inventory segments</h3>
                </div>

                {topCategories.length === 0 ? (
                  <EmptyState
                    icon={LayoutGrid}
                    title="No categories to rank"
                    description="Once resources are available, this panel will show the strongest content buckets."
                  />
                ) : (
                  <div className="space-y-4">
                    {topCategories.map((category, index) => {
                      const maxValue = topCategories[0]?.value || 1;
                      const width = `${Math.max(12, (category.value / maxValue) * 100)}%`;

                      return (
                        <div key={category.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                              />
                              <p className="text-sm font-semibold text-slate-100">{category.name}</p>
                            </div>
                            <span className="text-sm text-slate-300">{category.value}</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-800">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width,
                                background: `linear-gradient(90deg, ${CHART_COLORS[index % CHART_COLORS.length]}, rgba(255,255,255,0.9))`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
