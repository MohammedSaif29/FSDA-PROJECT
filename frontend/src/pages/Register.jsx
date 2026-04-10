import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { register } from '../api/apiClient';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import Captcha from '../components/ui/Captcha';
import { getRedirectPathForRole, setAuth } from '../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', captcha: '', role: 'USER' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [expectedCaptcha, setExpectedCaptcha] = useState('');
  const captchaRef = useRef(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = 'Username is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.password.trim()) newErrors.password = 'Password is required';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords must match';
    if (!form.captcha.trim()) newErrors.captcha = 'Verification code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (form.captcha.toLowerCase() !== expectedCaptcha.toLowerCase()) {
      toast.error('Invalid verification code. Please try again.');
      setForm(prev => ({ ...prev, captcha: '' }));
      if (captchaRef.current) captchaRef.current.refresh();
      const newErrors = { ...errors, captcha: 'Invalid code' };
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await register({
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      setAuth(
        { id: response.userId, username: response.username, email: response.email, role: response.role },
        response.token
      );
      toast.success('Account created successfully');
      navigate(getRedirectPathForRole(response.role));
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#2d2f5975,_#06070f_80%)] text-white">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 shadow-2xl backdrop-blur-xl md:grid-cols-2">
        <aside className="flex flex-col items-start justify-center p-10 md:p-16">
          <div className="mb-8 rounded-xl bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-200">EduVault Premium</div>
          <h1 className="text-4xl font-bold leading-tight text-slate-100">Create your learning vault</h1>
          <p className="mt-4 text-slate-300">Join thousands of learners and educators with secure, collaborative resource management in a modern dashboard experience.</p>
        </aside>

        <main className="p-8 sm:p-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-300">
              <UserPlus />
            </div>
            <h2 className="text-2xl font-bold">Create your account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField label="Username" name="username" value={form.username} onChange={handleChange} error={errors.username} icon={BookOpen} />
            <InputField label="Email" type="email" name="email" value={form.email} onChange={handleChange} error={errors.email} icon={BookOpen} />
            <InputField label="Password" type="password" name="password" value={form.password} onChange={handleChange} error={errors.password} icon={BookOpen} />
            <InputField label="Confirm Password" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} icon={BookOpen} />

            <div className="pt-2">
              <label className="mb-3 block text-sm font-medium text-slate-300">Account Type</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-4 transition-all ${form.role === 'USER' ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-white/10 bg-slate-900/50 text-slate-400 hover:bg-slate-800'}`}>
                  <input type="radio" name="role" value="USER" checked={form.role === 'USER'} onChange={handleChange} className="sr-only" />
                  <span className="font-semibold">Student</span>
                </label>
                <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-4 transition-all ${form.role === 'ADMIN' ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-white/10 bg-slate-900/50 text-slate-400 hover:bg-slate-800'}`}>
                  <input type="radio" name="role" value="ADMIN" checked={form.role === 'ADMIN'} onChange={handleChange} className="sr-only" />
                  <span className="font-semibold">Educator</span>
                </label>
              </div>
            </div>

            <div className="pt-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">Security Check</label>
              <div className="grid gap-4 sm:flex sm:items-end">
                <div className="mb-1 sm:mb-0">
                  <Captcha 
                    ref={captchaRef} 
                    onTargetCodeChange={(code) => setExpectedCaptcha(code)} 
                  />
                </div>
                <div className="flex-1">
                  <InputField 
                    type="text" 
                    name="captcha" 
                    value={form.captcha} 
                    onChange={handleChange} 
                    error={errors.captcha} 
                    placeholder="Enter verification code"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full">Register</Button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
            <span>Already enrolled?</span>
            <Link to="/login" className="text-indigo-300 hover:text-indigo-200">Sign in</Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Register;
