import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { login } from '../api/apiClient';
import { setAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.username.trim()) newErrors.username = 'Username is required';
    if (!form.password.trim()) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await login({ username: form.username, password: form.password });
      setAuth({ username: res.username, role: res.role || 'USER' }, res.token);
      toast.success('Welcome back, ' + res.username + '!');
      navigate(res.role === 'ADMIN' ? '/admin/dashboard' : '/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#2d2f5975,_#06070f_80%)] text-white">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 shadow-2xl backdrop-blur-xl md:grid-cols-2">
        <aside className="flex flex-col items-start justify-center p-10 md:p-16">
          <div className="mb-8 rounded-xl bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-200">EduVault Premium</div>
          <h1 className="text-4xl font-bold leading-tight text-slate-100">Secure. Smart. Scholarly.</h1>
          <p className="mt-4 text-slate-300">Continue to your learning vault, upload resources, and collaborate with your cohort in a modern, smooth UI.</p>
          <div className="mt-8 space-y-3">
            <p className="text-slate-300"><strong>Enterprise-grade features:</strong></p>
            <ul className="ml-5 list-disc text-slate-400">
              <li>JWT session management</li>
              <li>Dark mode + responsive UX</li>
              <li>Grid resource feed with filters</li>
            </ul>
          </div>
        </aside>

        <main className="p-8 sm:p-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-300">
              <BookOpen />
            </div>
            <h2 className="text-2xl font-bold">Sign in to your account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField label="Username" name="username" value={form.username} onChange={handleChange} error={errors.username} icon={BookOpen} />
            <InputField label="Password" type="password" name="password" value={form.password} onChange={handleChange} error={errors.password} icon={BookOpen} />

            <Button type="submit" loading={loading} className="w-full">Sign In</Button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
            <span>Don’t have an account?</span>
            <Link to="/register" className="text-indigo-300 hover:text-indigo-200">Create account</Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;

