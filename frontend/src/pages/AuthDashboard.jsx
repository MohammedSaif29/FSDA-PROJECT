import { Link } from 'react-router-dom';
import { CheckCircle2, Shield, UserCircle2 } from 'lucide-react';
import { getUser } from '../hooks/useAuth';

export default function AuthDashboard() {
  const user = getUser();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.18),_transparent_40%),#050816] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Authenticated Session</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">Welcome, {user?.username || 'User'}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                Your account is signed in through the new production-ready auth service with JWT access tokens and refresh-token rotation.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {user?.role === 'ADMIN' ? (
                <Link
                  to="/admin-console"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:shadow-indigo-500/40"
                >
                  <Shield className="h-4 w-4" />
                  Open Admin Console
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <UserCircle2 className="h-6 w-6 text-indigo-300" />
            <h2 className="mt-4 text-xl font-semibold text-white">Profile</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">Email: {user?.email}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Role: {user?.role}</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <CheckCircle2 className="h-6 w-6 text-emerald-300" />
            <h2 className="mt-4 text-xl font-semibold text-white">Verification</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Email status: {user?.isEmailVerified ? 'Verified' : 'Pending verification'}
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <Shield className="h-6 w-6 text-cyan-300" />
            <h2 className="mt-4 text-xl font-semibold text-white">Session Security</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Refresh tokens are stored in HTTP-only cookies. Access tokens are rotated automatically when needed.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
