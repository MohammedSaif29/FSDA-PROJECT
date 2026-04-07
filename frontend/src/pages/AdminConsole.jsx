import { useEffect, useState } from 'react';
import { Shield, UserCog } from 'lucide-react';
import { getAdminSession } from '../api/apiClient';
import Loader from '../components/ui/Loader';

export default function AdminConsole() {
  const [state, setState] = useState({ loading: true, error: '', data: null });

  useEffect(() => {
    getAdminSession()
      .then((data) => setState({ loading: false, error: '', data }))
      .catch((error) => setState({ loading: false, error: error.response?.data?.error || 'Unable to load admin console.', data: null }));
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.18),_transparent_40%),#050816] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-200">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">Admin Access</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">Role-protected admin console</h1>
            </div>
          </div>
        </section>

        {state.loading ? <Loader message="Checking admin permissions..." /> : null}
        {state.error ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-5 text-rose-100">{state.error}</div>
        ) : null}
        {state.data ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <UserCog className="h-6 w-6 text-cyan-300" />
            <p className="mt-4 text-lg font-semibold text-white">{state.data.message}</p>
            <p className="mt-3 text-sm text-slate-400">Authenticated admin: {state.data.user?.email}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
