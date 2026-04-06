import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Activity, LoaderCircle, Rocket } from 'lucide-react';
import AdminLayout from './layouts/AdminLayout';
import ResourceDetail from './pages/ResourceDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageResources from './pages/Admin/ManageResources';
import ManageUsers from './pages/Admin/ManageUsers';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminDownloads from './pages/Admin/AdminDownloads';
import AdminSavedResources from './pages/Admin/AdminSavedResources';
import PrivateRoute from './components/PrivateRoute';
import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/Student/StudentDashboard';
import ExploreResources from './pages/Student/ExploreResources';
import MyActivity from './pages/Student/MyActivity';
import SavedResources from './pages/Student/SavedResources';
import { getBackendHealth, login } from './api/apiClient';
import {
  getDemoCredentials,
  getRedirectPathForRole,
  getRole,
  getUser,
  isDemoAutoLoginEnabled,
  normalizeUserRole,
  setAuth,
} from './hooks/useAuth';

function BackendStartupScreen({ statusMessage, onRetry, autoLoginEnabled }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#04050a] px-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.18),_transparent_40%)]" />
      <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative w-full max-w-3xl rounded-[36px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl md:p-10">
        <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
          <Rocket className="h-4 w-4" />
          Preparing your local EduVault workspace
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">Starting backend services</h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              The frontend is ready. We are waiting for Spring Boot and MySQL to finish warming up so the dashboard can
              load without throwing errors.
            </p>

            <div className="mt-8 flex items-start gap-4 rounded-[28px] border border-white/10 bg-slate-950/40 p-5">
              <LoaderCircle className="mt-0.5 h-5 w-5 animate-spin text-cyan-300" />
              <div>
                <p className="font-semibold text-white">Current status</p>
                <p className="mt-1 text-sm text-slate-300">{statusMessage}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onRetry}
                className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
              >
                Retry now
              </button>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-slate-300">
                Backend health endpoint: <code>/api/health</code>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-[28px] border border-white/10 bg-slate-950/45 p-6">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-indigo-300" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-200">Startup checklist</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <p className="text-sm font-medium text-white">1. Spring Boot on port 8081</p>
              <p className="mt-1 text-sm text-slate-400">The frontend keeps polling until the API health check responds.</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <p className="text-sm font-medium text-white">2. MySQL running on port 3306</p>
              <p className="mt-1 text-sm text-slate-400">If MySQL is down, the backend will never report healthy.</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <p className="text-sm font-medium text-white">3. Demo auto-login</p>
              <p className="mt-1 text-sm text-slate-400">
                {autoLoginEnabled
                  ? 'Enabled in development. Once the backend is healthy, you will be signed into the demo account automatically.'
                  : 'Disabled. You will stay on the login screen after the backend becomes healthy.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = getRole();
  const user = getUser();
  const [backendReady, setBackendReady] = useState(Boolean(token));
  const [backendStatusMessage, setBackendStatusMessage] = useState('Checking backend health...');
  const [autoLoginInFlight, setAutoLoginInFlight] = useState(false);
  const autoLoginAttemptedRef = useRef(false);

  const defaultPath = token && user
    ? getRedirectPathForRole(role)
    : '/login';

  useEffect(() => {
    let cancelled = false;

    const probeBackend = async () => {
      try {
        await getBackendHealth();
        if (cancelled) return;
        setBackendReady(true);
        setBackendStatusMessage('Backend is healthy and ready.');
      } catch {
        if (cancelled) return;
        setBackendReady(false);
        setBackendStatusMessage('Waiting for Spring Boot on http://localhost:8081 and a healthy MySQL connection.');
      }
    };

    probeBackend();
    const intervalId = window.setInterval(probeBackend, 3000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [token]);

  useEffect(() => {
    if (!backendReady || token || !isDemoAutoLoginEnabled || autoLoginAttemptedRef.current) {
      return;
    }

    let cancelled = false;
    autoLoginAttemptedRef.current = true;

    const runAutoLogin = async () => {
      const credentials = getDemoCredentials();
      setAutoLoginInFlight(true);
      setBackendStatusMessage(`Backend is ready. Signing you in as ${credentials.email}...`);

      try {
        const response = await login({
          email: credentials.email,
          password: credentials.password,
        });

        if (cancelled) return;

        const resolvedRole = normalizeUserRole(response.role || credentials.role);
        setAuth({ id: response.userId, username: response.username, email: response.email, role: resolvedRole }, response.token);
        setBackendStatusMessage(`Signed in as ${response.username}. Redirecting to your workspace...`);
        navigate(getRedirectPathForRole(resolvedRole), { replace: true });
      } catch {
        if (cancelled) return;
        setBackendStatusMessage('Backend is ready, but demo auto-login failed. You can sign in manually.');
      } finally {
        if (!cancelled) {
          setAutoLoginInFlight(false);
        }
      }
    };

    runAutoLogin();

    return () => {
      cancelled = true;
    };
  }, [backendReady, navigate, token]);

  if (!backendReady || autoLoginInFlight) {
    return (
      <BackendStartupScreen
        statusMessage={backendStatusMessage}
        autoLoginEnabled={isDemoAutoLoginEnabled}
        onRetry={() => {
          setBackendStatusMessage('Retrying backend health check...');
          getBackendHealth()
            .then(() => {
              setBackendReady(true);
              setBackendStatusMessage('Backend is healthy and ready.');
            })
            .catch(() => {
              setBackendReady(false);
              setBackendStatusMessage('Backend is still starting. Keep Spring Boot and MySQL running, then retry.');
            });
        }}
      />
    );
  }

  return (
    <>
      <Routes>
      <Route path="/" element={<Navigate to={defaultPath} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route element={<PrivateRoute role="USER" />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="explore" element={<ExploreResources />} />
          <Route path="activity" element={<MyActivity />} />
          <Route path="saved" element={<SavedResources />} />
          <Route path="resources/:id" element={<ResourceDetail />} />
        </Route>
      </Route>

      <Route path="/home" element={<Navigate to={defaultPath} replace />} />

      <Route element={<PrivateRoute role="ADMIN" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="resources" element={<ManageResources />} />
          <Route path="resources/:id" element={<ResourceDetail />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="downloads" element={<AdminDownloads />} />
          <Route path="saved" element={<AdminSavedResources />} />
          <Route path="feedback" element={<ManageUsers />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={defaultPath} replace />} />
    </Routes>
    </>
  );
}

export default App;
