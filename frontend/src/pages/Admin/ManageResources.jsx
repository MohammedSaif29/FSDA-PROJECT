import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Edit, FileText, ImageIcon, Search, Tag, Trash2, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { deleteAdminResource, getAdminResources, updateAdminResource } from '../../api/adminService';
import { resolveBackendUrl } from '../../api/apiClient';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import InputField from '../../components/ui/InputField';
import Upload from '../Upload';

const categories = ['Computer Science', 'Physics', 'Mathematics', 'Chemistry', 'Economics', 'AI', 'ML'];
const resourceTypes = ['TEXTBOOK', 'PAPER', 'GUIDE'];

export default function ManageResources() {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingResource, setEditingResource] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    author: '',
    category: '',
    type: 'PAPER',
    description: '',
    file: null,
    thumbnail: null,
    removeThumbnail: false,
  });
  const [savingEdit, setSavingEdit] = useState(false);

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
    // listen to uploads from global upload modal (Navbar)
    const onGlobalUpload = (e) => {
      const resource = e.detail;
      if (resource) setResources((current) => [resource, ...current]);
    };
    window.addEventListener('resource:uploaded', onGlobalUpload);

    return () => {
      window.removeEventListener('resource:uploaded', onGlobalUpload);
    };
  }, []);

  const filteredResources = resources.filter((resource) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    return [resource.title, resource.author, resource.category, resource.type]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(query);
  });

  const openEditModal = (resource) => {
    setEditingResource(resource);
    setEditForm({
      title: resource.title || '',
      author: resource.author || '',
      category: resource.category || '',
      type: resource.type || 'PAPER',
      description: resource.description || '',
      file: null,
      thumbnail: null,
      removeThumbnail: false,
    });
  };

  const closeEditModal = () => {
    if (savingEdit) return;
    setEditingResource(null);
    setEditForm({
      title: '',
      author: '',
      category: '',
      type: 'PAPER',
      description: '',
      file: null,
      thumbnail: null,
      removeThumbnail: false,
    });
  };

  const handleEditChange = (event) => {
    const { name, value, files } = event.target;
    setEditForm((current) => ({ ...current, [name]: files ? files[0] : value }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!editingResource) return;

    if (!editForm.title.trim() || !editForm.author.trim() || !editForm.category.trim() || !editForm.description.trim()) {
      toast.error('Please complete all edit fields');
      return;
    }

    if (editForm.file) {
      const validResourceFile = editForm.file.type === 'application/pdf' || editForm.file.name.toLowerCase().endsWith('.pdf');
      if (!validResourceFile) {
        toast.error('Replacement resource file must be a PDF');
        return;
      }
    }

    if (editForm.thumbnail) {
      const validThumbnail = editForm.thumbnail.type.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(editForm.thumbnail.name);
      if (!validThumbnail) {
        toast.error('Thumbnail must be an image (jpg, png, webp)');
        return;
      }
    }

    setSavingEdit(true);
    try {
      const payload = new FormData();
      payload.append('title', editForm.title.trim());
      payload.append('author', editForm.author.trim());
      payload.append('category', editForm.category.trim());
      payload.append('type', editForm.type);
      payload.append('description', editForm.description.trim());
      if (editForm.file) {
        payload.append('file', editForm.file);
      }
      if (editForm.thumbnail) {
        payload.append('thumbnail', editForm.thumbnail);
      }
      payload.append('removeThumbnail', String(editForm.removeThumbnail));

      const updatedResource = await updateAdminResource(editingResource.id, payload);

      setResources((current) => current.map((resource) => (
        resource.id === updatedResource.id ? updatedResource : resource
      )));
      toast.success('Resource updated');
      setEditingResource(null);
      setEditForm({
        title: '',
        author: '',
        category: '',
        type: 'PAPER',
        description: '',
        file: null,
        thumbnail: null,
        removeThumbnail: false,
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update resource');
    } finally {
      setSavingEdit(false);
    }
  };

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

      <div className="mb-8">
        <Upload onUploaded={(resource) => {
          setResources((current) => [resource, ...current]);
        }}
        />
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
                            <Link to={`/admin/resources/${resource.id}`} className="font-semibold text-white transition hover:text-indigo-300">
                              {resource.title}
                            </Link>
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
                          <button
                            className="icon-btn text-accent-primary"
                            title="Edit"
                            onClick={() => openEditModal(resource)}
                          >
                            <Edit size={18} />
                          </button>
                          <a
                            className="icon-btn text-sky-300"
                            title="Open resource"
                            href={`#/admin/resources/${resource.id}`}
                          >
                            Open
                          </a>
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

      <Modal open={Boolean(editingResource)} title="Edit Resource" onClose={closeEditModal}>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <InputField
            label="Title"
            name="title"
            value={editForm.title}
            onChange={handleEditChange}
            icon={BookOpen}
          />
          <InputField
            label="Author"
            name="author"
            value={editForm.author}
            onChange={handleEditChange}
            icon={UserIcon}
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-200">Category</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                name="category"
                value={editForm.category}
                onChange={handleEditChange}
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 py-3 pl-10 pr-4 text-white focus:border-indigo-400 focus:outline-none"
              >
                <option value="">Choose category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-200">Type</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                name="type"
                value={editForm.type}
                onChange={handleEditChange}
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 py-3 pl-10 pr-4 text-white focus:border-indigo-400 focus:outline-none"
              >
                {resourceTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-200">Description</label>
            <textarea
              name="description"
              rows={5}
              value={editForm.description}
              onChange={handleEditChange}
              className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-400 transition focus:border-indigo-400 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-200">Replace resource file (optional)</label>
            <label className="form-control flex cursor-pointer items-center gap-3">
              <FileText className="h-4 w-4 text-indigo-300" />
              <span className="text-sm text-slate-300">
                {editForm.file?.name || 'Choose a new PDF file'}
              </span>
              <input type="file" name="file" accept=".pdf,application/pdf" onChange={handleEditChange} className="hidden" />
            </label>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-200">Replace thumbnail / cover image (optional)</label>
            <label className="form-control flex cursor-pointer items-center gap-3">
              <ImageIcon className="h-4 w-4 text-indigo-300" />
              <span className="text-sm text-slate-300">
                {editForm.thumbnail?.name || 'Choose a new thumbnail image'}
              </span>
              <input type="file" name="thumbnail" accept="image/*" onChange={handleEditChange} className="hidden" />
            </label>
            {editingResource?.imageUrl ? (
              <label className="mt-1 inline-flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  name="removeThumbnail"
                  checked={editForm.removeThumbnail}
                  onChange={(event) => setEditForm((current) => ({ ...current, removeThumbnail: event.target.checked }))}
                />
                Remove current thumbnail
              </label>
            ) : null}
            {editingResource?.imageUrl ? (
              <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 p-2">
                <img
                  src={resolveBackendUrl(editingResource.imageUrl)}
                  alt={editingResource.title}
                  className="h-28 w-full rounded-xl object-cover"
                />
              </div>
            ) : null}
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" onClick={closeEditModal} disabled={savingEdit}>
              Cancel
            </Button>
            <Button type="submit" loading={savingEdit}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
