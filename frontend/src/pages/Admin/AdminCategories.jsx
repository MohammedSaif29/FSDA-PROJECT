import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Grid3X3, Layers3 } from 'lucide-react';
import { getAdminResources } from '../../api/adminService';
import { resolveBackendUrl } from '../../api/apiClient';

export default function AdminCategories() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const data = await getAdminResources();
        setResources(data);
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  const categories = useMemo(() => {
    const grouped = resources.reduce((accumulator, resource) => {
      const key = resource.category || 'General';
      if (!accumulator[key]) {
        accumulator[key] = {
          name: key,
          count: 0,
          textbooks: 0,
          papers: 0,
          imageUrl: resource.imageUrl,
        };
      }

      accumulator[key].count += 1;
      if (resource.type === 'TEXTBOOK') accumulator[key].textbooks += 1;
      if (resource.type === 'PAPER') accumulator[key].papers += 1;
      return accumulator;
    }, {});

    return Object.values(grouped).sort((a, b) => b.count - a.count);
  }, [resources]);

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <h2>Category Library</h2>
          <p className="text-secondary mt-1">See how your resource collection is distributed across categories.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {(loading ? Array.from({ length: 6 }) : categories).map((category, index) => (
          <div
            key={loading ? `category-skeleton-${index}` : category.name}
            className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-xl shadow-slate-950/20 backdrop-blur-xl"
          >
            {loading ? (
              <div className="h-[280px] animate-pulse bg-white/[0.05]" />
            ) : (
              <>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={resolveBackendUrl(category.imageUrl)}
                    alt={category.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Category</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{category.name}</h3>
                  </div>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                    <Layers3 className="h-5 w-5 text-sky-300" />
                    <p className="mt-3 text-2xl font-semibold text-white">{category.count}</p>
                    <p className="text-sm text-slate-400">Total resources</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                    <BookOpen className="h-5 w-5 text-indigo-300" />
                    <p className="mt-3 text-2xl font-semibold text-white">{category.textbooks}</p>
                    <p className="text-sm text-slate-400">Textbooks</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                    <Grid3X3 className="h-5 w-5 text-fuchsia-300" />
                    <p className="mt-3 text-2xl font-semibold text-white">{category.papers}</p>
                    <p className="text-sm text-slate-400">Papers</p>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
