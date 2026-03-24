import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { getResources } from '../api/apiClient';
import ResourceCard from '../components/ResourceCard';
import Loader from '../components/ui/Loader';

const categories = ['All', 'Computer Science', 'Physics', 'Mathematics', 'Chemistry', 'Economics'];

export default function Dashboard() {
  const [resources, setResources] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getResources();
        setResources(data);
      } catch (err) {
        setError('Failed to load resources.');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  useEffect(() => {
    let current = [...resources];

    if (selectedCategory !== 'All') {
      current = current.filter((r) => r.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      current = current.filter((r) => r.title?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q));
    }

    setFiltered(current);
  }, [resources, selectedCategory, search]);

  const stats = useMemo(() => ({
    total: resources.length,
    categories: Array.from(new Set(resources.map((r) => r.category))).length,
    topRating: Math.max(...resources.map((r) => r.rating || 0), 0).toFixed(1),
  }), [resources]);

  const withSkeleton = loading ? Array.from({ length: 6 }) : filtered;

  return (
    <div className="space-y-6">
      <section className="glass-panel p-6">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-slate-300">Welcome back! Explore resources, filter by category, and monitor your content performance.</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-sm text-slate-400">Total resources</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-sm text-slate-400">Categories</p>
            <p className="text-2xl font-bold">{stats.categories}</p>
          </div>
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-sm text-slate-400">Top rating</p>
            <p className="text-2xl font-bold">{stats.topRating}</p>
          </div>
        </div>
      </section>

      <section className="glass-panel p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="w-full max-w-sm rounded-full border border-white/10 bg-slate-900/70 py-2 px-4 text-sm text-white outline-none focus:border-indigo-400"
          />

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedCategory === category ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-200 hover:bg-white/20'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading && <Loader />}
        {error && <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-rose-200">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-xl border border-white/10 p-12 text-center text-slate-300">No results found. Try another keyword or category.</div>
        )}

        <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {!loading && filtered.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}
          {loading && withSkeleton.map((_, index) => (
            <div key={index} className="h-60 animate-pulse rounded-2xl bg-slate-800/80" />
          ))}
        </motion.div>
      </section>
    </div>
  );
}
