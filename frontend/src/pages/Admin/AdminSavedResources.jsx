import { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import { getAdminSavedResources } from '../../api/adminService';
import { resolveBackendUrl } from '../../api/apiClient';

export default function AdminSavedResources() {
  const [savedResources, setSavedResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSavedResources = async () => {
      try {
        const data = await getAdminSavedResources();
        setSavedResources(data);
      } finally {
        setLoading(false);
      }
    };

    loadSavedResources();
  }, []);

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <h2>Saved Resources</h2>
          <p className="text-secondary mt-1">See which resources users are bookmarking most often.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {(loading ? Array.from({ length: 6 }) : savedResources).map((resource, index) => (
          <div
            key={loading ? `saved-skeleton-${index}` : resource.resourceId}
            className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-xl shadow-slate-950/20 backdrop-blur-xl"
          >
            {loading ? (
              <div className="h-[320px] animate-pulse bg-white/[0.05]" />
            ) : (
              <>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={resolveBackendUrl(resource.imageUrl)}
                    alt={resource.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
                  <div className="absolute right-4 top-4 rounded-full border border-white/15 bg-slate-950/60 p-2 text-white">
                    <Bookmark className="h-4 w-4" />
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{resource.category} • {resource.type}</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{resource.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">By {resource.author}</p>
                  <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                    <p className="text-3xl font-semibold text-white">{resource.saveCount}</p>
                    <p className="text-sm text-slate-400">times saved by users</p>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}

        {!loading && savedResources.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] p-10 text-center md:col-span-2 xl:col-span-3">
            <Bookmark className="mx-auto h-8 w-8 text-slate-500" />
            <p className="mt-4 text-lg font-medium text-white">No saved resources yet</p>
            <p className="mt-2 text-sm text-slate-400">Once students start bookmarking resources, the most popular ones will appear here.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
