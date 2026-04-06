import { useState } from 'react';
import { CloudUpload, Tag, FileText, BookOpen, ImageIcon } from 'lucide-react';
import { uploadResource } from '../api/apiClient';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import toast from 'react-hot-toast';
import { getUser } from '../hooks/useAuth';

const categories = ['Computer Science', 'Physics', 'Mathematics', 'Chemistry', 'Economics'];

export default function Upload({ onUploaded }) {
  const user = getUser();
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    type: 'GUIDE',
    file: null,
    thumbnail: null,
  });
  const [loading, setLoading] = useState(false);

  if (user?.role !== 'ADMIN') {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100">
        Only admins can upload resources.
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Client-side validations
    const allowedResourceTypes = ['application/pdf'];
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxResourceBytes = 50 * 1024 * 1024; // 50MB
    const maxImageBytes = 5 * 1024 * 1024; // 5MB

    if (!form.title || !form.description || !form.category || !form.file) {
      toast.error('Please fill in all required fields');
      return;
    }

    const resourceFile = form.file;
    if (!resourceFile) {
      toast.error('Resource file is required');
      return;
    }

    const resourceTypeOk = allowedResourceTypes.includes(resourceFile.type) || resourceFile.name.toLowerCase().endsWith('.pdf');
    if (!resourceTypeOk) {
      toast.error('Only PDF resource files are allowed');
      return;
    }

    if (resourceFile.size > maxResourceBytes) {
      toast.error('Resource file is too large (max 50MB)');
      return;
    }

    if (form.thumbnail) {
      const img = form.thumbnail;
      const imgTypeOk = allowedImageTypes.includes(img.type) || /\.(jpe?g|png|webp)$/i.test(img.name);
      if (!imgTypeOk) {
        toast.error('Thumbnail must be an image (jpg, png, webp)');
        return;
      }
      if (img.size > maxImageBytes) {
        toast.error('Thumbnail is too large (max 5MB)');
        return;
      }
    }

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append('title', form.title);
      payload.append('description', form.description);
      payload.append('category', form.category);
      payload.append('type', form.type);
      payload.append('author', form.author || 'Admin');
      payload.append('file', form.file);
      if (form.thumbnail) {
        payload.append('thumbnail', form.thumbnail);
      }

      const uploadedResource = await uploadResource(payload);
      toast.success('Resource uploaded successfully');
      setForm({ title: '', author: '', description: '', category: '', type: 'GUIDE', file: null, thumbnail: null });
      onUploaded?.(uploadedResource);
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6">
      <div className="mb-6 flex items-center gap-3">
        <CloudUpload className="h-6 w-6 text-indigo-300" />
        <h2 className="text-2xl font-semibold">Upload Resource</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label="Title" name="title" value={form.title} onChange={handleChange} icon={BookOpen} />
        <InputField label="Author" name="author" value={form.author} onChange={handleChange} icon={Tag} />
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-200">Type</label>
          <select name="type" value={form.type} onChange={handleChange} className="form-control">
            <option value="TEXTBOOK">Textbook</option>
            <option value="PAPER">Paper</option>
            <option value="GUIDE">Guide</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-200">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="form-control">
            <option value="">Choose category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-200">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="form-control" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-200">Resource file</label>
          <label className="form-control flex cursor-pointer items-center gap-3">
            <FileText className="h-4 w-4 text-indigo-300" />
            <span className="text-sm text-slate-300">{form.file?.name || 'Choose a PDF or image file'}</span>
            <input type="file" name="file" accept=".pdf,image/*" onChange={handleChange} className="hidden" />
          </label>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-200">Thumbnail image (optional)</label>
          <label className="form-control flex cursor-pointer items-center gap-3">
            <ImageIcon className="h-4 w-4 text-indigo-300" />
            <span className="text-sm text-slate-300">{form.thumbnail?.name || 'Choose a thumbnail image'}</span>
            <input type="file" name="thumbnail" accept="image/*" onChange={handleChange} className="hidden" />
          </label>
        </div>

        <Button type="submit" loading={loading}>Submit Resource</Button>
      </form>
    </div>
  );
}
