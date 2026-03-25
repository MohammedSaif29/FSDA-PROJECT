import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Search, SlidersHorizontal } from 'lucide-react';
import ResourceCard from '../../components/ResourceCard';
import StudentEmptyState from '../../components/student/StudentEmptyState';
import StudentResourceSkeleton from '../../components/student/StudentResourceSkeleton';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import { getExploreResources } from '../../api/studentService';

export default function ExploreResources() {
  const navigate = useNavigate();
  const location = useLocation();
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState(location.state?.initialSearch || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const debouncedSearch = useDebouncedValue(search, 300).trim().toLowerCase();

  useEffect(() => {
    const loadResources = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await getExploreResources();
        setResources(response);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load resources.');
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(resources.map((resource) => resource.category).filter(Boolean))).sort();
    return ['All', ...uniqueCategories];
  }, [resources]);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const haystack = [resource.title, resource.author, resource.category, resource.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
      return matchesCategory && (!debouncedSearch || haystack.includes(debouncedSearch));
    });
  }, [resources, selectedCategory, debouncedSearch]);

  return (
    <div className="space-y-7">
      <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Explore Resources</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Browse books, papers, and learning material</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Search across title, author, and category to find the next resource worth saving or downloading.
            </p>
          </div>

          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search resources, authors, topics..."
              className="w-full rounded-full border border-white/10 bg-slate-950/45 py-3 pl-11 pr-4 text-sm text-slate-100 outline-none transition focus:border-sky-400/40"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-400">
            <SlidersHorizontal className="h-4 w-4" />
            Category
          </div>

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-950/30'
                  : 'border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]'
              }`}
            >
              {category}
            </button>
          ))}
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
        ) : filteredResources.length === 0 ? (
          <StudentEmptyState
            icon={BookOpen}
            title="No resources available"
            description="Try a different search term or reset the category filter to explore more material."
            actionLabel="Reset filters"
            onAction={() => {
              setSearch('');
              setSelectedCategory('All');
            }}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                query={debouncedSearch}
                onSaved={() => navigate('/student/saved')}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
