import { useEffect, useMemo, useState } from 'react';
import { Edit, ImageIcon, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { deleteAdminResource, getAdminResources } from '../../api/adminService';
import { resolveBackendUrl } from '../../api/apiClient';

export default function ManageResources() {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const data = await getAdminResources();
        setResources(data);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to load resources');
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  const filteredResources = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return resources;

    return resources.filter((resource) =>
      [resource.title, resource.author, resource.category, resource.type]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [resources, searchQuery]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      await deleteAdminResource(id);
      setResources((current) => current.filter((resource) => resource.id !== id));
      toast.success('Resource deleted');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete resource');
    }
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h2>Manage Educational Resources</h2>
          <p className="text-secondary mt-1">Browse the real resource catalog, with covers, authors, and categories.</p>
        </div>
      </div>

      <div className="glass-panel p-6 mb-8">
        <div className="search-input-wrapper max-w-md w-full mb-6">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search catalog..."
            className="search-input"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left">
            <thead>
              <tr className="border-b border-white/10 text-sm uppercase tracking-[0.18em] text-slate-500">
                <th className="pb-4">Resource</th>
                <th className="pb-4">Type</th>
                <th className="pb-4">Category</th>
                <th className="pb-4">Author</th>
                <th className="pb-4">Downloads</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(loading ? Array.from({ length: 6 }) : filteredResources).map((resource, index) => (
                <tr key={loading ? `resource-row-${index}` : resource.id} className="border-b border-white/6">
                  {loading ? (
                    <td colSpan="6" className="py-5">
                      <div className="h-14 animate-pulse rounded-2xl bg-white/[0.05]" />
                    </td>
                  ) : (
                    <>
                      <td className="py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40">
                            {resource.imageUrl ? (
                              <img
                                src={resolveBackendUrl(resource.imageUrl)}
                                alt={resource.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-500">
                                <ImageIcon className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{resource.title}</p>
                            <p className="mt-1 line-clamp-2 max-w-md text-sm text-slate-400">{resource.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5">
                        <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">
                          {resource.type}
                        </span>
                      </td>
                      <td className="py-5 text-slate-200">{resource.category}</td>
                      <td className="py-5 text-slate-400">{resource.author}</td>
                      <td className="py-5 text-slate-200">{resource.downloadsCount || 0}</td>
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <button className="icon-btn text-accent-primary" title="Edit">
                            <Edit size={18} />
                          </button>
                          <button
                            className="icon-btn text-danger"
                            title="Delete"
                            onClick={() => handleDelete(resource.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filteredResources.length === 0 ? (
            <div className="py-12 text-center text-slate-400">No resources found for this search.</div>
          ) : null}
        </div>
      </div>
    </>
  );
}
