import { useState, useEffect } from 'react';
import ResourceCard from '../components/ResourceCard';
import Loader from '../components/ui/Loader';
import { getResources } from '../api/apiClient';

const categoriesList = ['All', 'Computer Science', 'Physics', 'Mathematics', 'Chemistry', 'Economics'];

export default function ResourceList() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getResources();
        setResources(data);
      } catch (err) {
        setError('Could not load resources.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = resources.filter((r) => {
    const byCategory = category === 'All' || r.category?.toLowerCase() === category.toLowerCase();
    const bySearch = search.trim() === '' || [r.title, r.description, r.author].some((v) => v?.toLowerCase().includes(search.toLowerCase()));
    return byCategory && bySearch;
  });

  const skeleton = Array.from({ length: 6 });

  return (
    <div className="space-y-6">
      <section className="glass-panel p-6">
        <h2 className="text-2xl font-semibold">All Resources</h2>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles, authors, category..."
            className="w-full max-w-md rounded-full border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-white outline-none focus:border-indigo-400"
          />
          <div className="flex flex-wrap gap-2">
            {categoriesList.map((cat) => (
              <button
                type="button"
                key={cat}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${category === cat ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-200 hover:bg-white/20'}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {loading && <Loader message="Loading resources..." />}
      {error && <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-rose-200">{error}</div>}
      {!loading && !error && filtered.length === 0 && <div className="rounded-xl border border-white/10 p-8 text-center text-slate-400">No resources match your query.</div>}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {!loading && filtered.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}
        {loading && skeleton.map((_, idx) => <div key={idx} className="h-60 animate-pulse rounded-2xl bg-slate-800/90" />)}
      </section>
    </div>
  );
}


