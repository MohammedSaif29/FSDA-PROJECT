import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Sparkles, LayoutDashboard, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { getApiErrorMessage, getGoogleAuthStatus, getGoogleLoginUrl, login } from '../api/apiClient';
import { getDemoCredentials, getRedirectPathForRole, isDemoAutoLoginEnabled, normalizeUserRole, setAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import Captcha from '../components/ui/Captcha';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: '', password: '', captcha: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(true);
  const [googleConfigured, setGoogleConfigured] = useState(false);
  const [errors, setErrors] = useState({});
  const [expectedCaptcha, setExpectedCaptcha] = useState('');
  const captchaRef = useRef(null);

  useEffect(() => {
    const hashQuery = window.location.hash.includes('?')
      ? window.location.hash.slice(window.location.hash.indexOf('?') + 1)
      : '';
    const params = new URLSearchParams(hashQuery || window.location.search);
    if (params.get('oauthError') === 'true') {
      const errorMsg = params.get('errorMsg') || 'Check your Google client ID, secret, and redirect URI.';
      toast.error('Google sign-in failed. Reason: ' + errorMsg);
      const cleanHash = window.location.hash.includes('?')
        ? window.location.hash.slice(0, window.location.hash.indexOf('?'))
        : window.location.hash;
      window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}${cleanHash}`);
    }

    const loadGoogleStatus = async () => {
      try {
        const status = await getGoogleAuthStatus();
        setGoogleConfigured(Boolean(status.configured));
      } catch {
        setGoogleConfigured(false);
      } finally {
        setGoogleLoading(false);
      }
    };

    loadGoogleStatus();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.identifier.trim()) newErrors.identifier = 'Email or username is required';
    if (!form.password.trim()) newErrors.password = 'Password is required';
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
      const res = await login({ identifier: form.identifier, password: form.password });
      const resolvedRole = normalizeUserRole(res.role);

      setAuth({ id: res.userId, username: res.username, email: res.email, role: resolvedRole }, res.token);
      toast.success('Welcome back, ' + res.username + '!');
      navigate(getRedirectPathForRole(resolvedRole));
    } catch (err) {
      toast.error(getApiErrorMessage(err) || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0b10] text-[#f8fafc] font-sans">
      
      {/* LEFT SIDE - Form */}
      <div className="flex w-full flex-col justify-center px-8 sm:px-16 lg:w-1/2 lg:px-24 xl:px-32 relative z-10">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">EduVault</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome back</h2>
          <p className="text-sm text-slate-400 mb-8">
            Sign in with your email or username. Admin access is only granted to approved admin accounts.
          </p>

          {isDemoAutoLoginEnabled ? (
            <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
              <p className="font-semibold text-white">Development auto-login is enabled</p>
              <p className="mt-2 text-emerald-100/90">
                Reloading in development will automatically sign you into the demo account
                {' '}
                <code>{getDemoCredentials().email}</code>
                .
              </p>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5 rounded-2xl bg-white/[0.03] p-6 border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl">
              <InputField 
                label="Email or Username" 
                type="text"
                name="identifier" 
                value={form.identifier} 
                onChange={handleChange} 
                error={errors.identifier} 
                placeholder="Enter your email or username"
                className="w-full rounded-xl border border-white/10 bg-[#12131c] px-4 py-3 text-white placeholder:text-slate-500 transition-all focus:border-indigo-500 focus:bg-[#1a1c29] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                icon={Mail}
              />
              <InputField 
                label="Password" 
                type="password" 
                name="password" 
                value={form.password} 
                onChange={handleChange} 
                error={errors.password} 
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-[#12131c] px-4 py-3 text-white placeholder:text-slate-500 transition-all focus:border-indigo-500 focus:bg-[#1a1c29] focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />

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
                      className="w-full rounded-xl border border-white/10 bg-[#12131c] px-4 py-3 text-white placeholder:text-slate-500 transition-all focus:border-indigo-500 focus:bg-[#1a1c29] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4 text-sm text-indigo-100">
                <p className="font-semibold text-white">Demo credentials</p>
                <div className="mt-3 space-y-1">
                  <p><span className="font-medium">Admin:</span> <code>admin@eduvault.com</code> / <code>admin123</code></p>
                  <p><span className="font-medium">Student 1:</span> <code>user1@gmail.com</code> / <code>user123</code></p>
                  <p><span className="font-medium">Student 2:</span> <code>user2@gmail.com</code> / <code>user123</code></p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
                <p className="font-semibold text-white">Role separation</p>
                <p className="mt-2">
                  Public registration creates a normal user account. Admin access is reserved for approved admin emails and existing admin accounts.
                </p>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer hover:text-slate-300">
                  <input type="checkbox" className="rounded border-white/20 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900" />
                  Remember me
                </label>
                <a href="#" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
              </div>

              <Button type="submit" loading={loading} className="w-full mt-2 font-bold py-3">
                Sign In
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="w-full font-bold py-3"
                loading={googleLoading}
                disabled={googleLoading || !googleConfigured}
                onClick={() => {
                  if (!googleConfigured) {
                    toast.error('Google sign-in is not configured on the backend yet.');
                    return;
                  }
                  window.location.href = getGoogleLoginUrl();
                }}
              >
                {googleConfigured ? 'Continue with Google' : 'Google Sign-In Not Configured'}
              </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Create a free account
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Visuals */}
      <div className="hidden lg:flex relative w-1/2 flex-col justify-center overflow-hidden bg-[#05050a] items-center">
        
        {/* Dynamic Abstract Background Elements */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px]" />
        
        {/* Premium Grid Pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgtMnY0aC00djJoNHY0aDJ2LTRoNHYtMmgtNHptMC0zMFYwaC0ydjRoLTR2Mmg0djRoMnYtNGg0VjRoLTR6bS0yMCAwdjRodjItNGg0VjRINS4wNjJMNCA0djRoMnYtNFYwaC0ydjRINFYyamg0VjBoMnY0aDRWMHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvZz48L3N2Zz4=')] opacity-50"></div>

        <div className="relative z-20 max-w-lg px-8">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 py-1 px-3 backdrop-blur-md">
               <span className="flex items-center text-sm font-medium text-indigo-300 gap-2">
                 <Sparkles className="h-4 w-4" /> EduVault Enterprise 2.0
               </span>
            </div>
            
            <h1 className="text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
              Unlock the future of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                digital learning.
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 mt-6 leading-relaxed">
              Experience the cutting-edge educational vault designed for top-tier institutions. Manage, upload, and organize securely.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4 mt-12 pr-12">
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-transform hover:-translate-y-1">
                <LayoutDashboard className="text-indigo-400 mb-4 h-6 w-6" />
                <h3 className="font-semibold text-white mb-2">Modern Dashboard</h3>
                <p className="text-sm text-slate-400">A clean, focused grid layout with robust filtering.</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-transform hover:-translate-y-1">
                <ShieldCheck className="text-purple-400 mb-4 h-6 w-6" />
                <h3 className="font-semibold text-white mb-2">Secure Vault</h3>
                <p className="text-sm text-slate-400">Enterprise authentication mechanisms built right in.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Login;
