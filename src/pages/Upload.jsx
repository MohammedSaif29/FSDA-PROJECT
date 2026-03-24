import { useState } from 'react';
import { CloudUpload, Tag, FileText, BookOpen } from 'lucide-react';
import { uploadResource } from '../api/apiClient';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import toast from 'react-hot-toast';

const categories = ['Computer Science', 'Physics', 'Mathematics', 'Chemistry', 'Economics'];

export default function Upload() {
  const [form, setForm] = useState({ title: '', author: '', description: '', category: '', fileUrl: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.fileUrl) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await uploadResource({ ...form, author: form.author || 'Anonymous', rating: 0, downloadsCount: 0 });
      toast.success('Resource uploaded successfully');
      setForm({ title: '', author: '', description: '', category: '', fileUrl: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
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
        <InputField label="File URL" name="fileUrl" value={form.fileUrl} onChange={handleChange} icon={FileText} />

        <Button type="submit" loading={loading}>Submit Resource</Button>
      </form>
    </div>
  );
}
