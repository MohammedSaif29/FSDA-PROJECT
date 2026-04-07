import { BookOpen, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuthShell({ eyebrow = 'EduVault Security', title, description, footer, children }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070811] text-white lg:grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <section className="flex min-h-screen items-center px-5 py-8 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto w-full max-w-lg">
          <Link to="/login" className="mb-10 inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/25">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-semibold tracking-tight text-white">EduVault</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Secure Access</p>
            </div>
          </Link>

          <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
            {eyebrow}
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
          <p className="mt-4 text-base leading-7 text-slate-300">{description}</p>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-6">
            {children}
          </div>

          {footer ? (
            <div className="mt-6 text-sm text-slate-400">{footer}</div>
          ) : null}
        </div>
      </section>

      <aside className="relative hidden min-h-screen overflow-hidden bg-[#04050b] lg:flex lg:items-center lg:px-10 xl:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.2),_transparent_40%)]" />
        <div className="absolute top-24 left-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute bottom-12 right-12 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-[160px]" />

        <div className="relative z-10 mx-auto max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-indigo-200">
            <Sparkles className="h-4 w-4" />
            Production-ready auth stack
          </div>

          <h2 className="mt-8 text-5xl font-bold leading-[1.05] text-white">
            Protect every login, session, and recovery flow with one cohesive system.
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Email verification, refresh-token rotation, Google OAuth, reCAPTCHA, and role-aware access designed for modern apps.
          </p>

          <div className="mt-12 grid gap-4 xl:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
              <ShieldCheck className="h-6 w-6 text-cyan-300" />
              <h3 className="mt-4 text-xl font-semibold text-white">Defense in Depth</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Helmet, rate limiting, secure cookies, validation, and refresh token rotation are built into the flow.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
              <Sparkles className="h-6 w-6 text-fuchsia-300" />
              <h3 className="mt-4 text-xl font-semibold text-white">Fast Team Onboarding</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Students and admins land in the right place immediately, with verification and recovery flows ready to ship.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
