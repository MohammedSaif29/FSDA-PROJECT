import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, MailCheck, XCircle } from 'lucide-react';
import AuthShell from '../components/auth/AuthShell';
import Loader from '../components/ui/Loader';
import { verifyEmail } from '../api/apiClient';

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState({ loading: true, success: false, message: '' });

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      setState({ loading: false, success: false, message: 'Verification link is incomplete or invalid.' });
      return;
    }

    verifyEmail({ token, email })
      .then((response) => {
        setState({ loading: false, success: true, message: response.message || 'Email verified successfully.' });
      })
      .catch((error) => {
        setState({
          loading: false,
          success: false,
          message: error.response?.data?.error || 'Verification failed.',
        });
      });
  }, [searchParams]);

  return (
    <AuthShell
      eyebrow="Email Verification"
      title="Verify your email"
      description="We use email verification to prevent fake signups and protect password-based access."
      footer={<Link to="/login" className="font-semibold text-indigo-300 hover:text-indigo-200">Return to sign in</Link>}
    >
      {state.loading ? <Loader message="Verifying your email..." /> : (
        <div className={`rounded-[24px] border p-5 ${state.success ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100' : 'border-rose-400/20 bg-rose-400/10 text-rose-100'}`}>
          <div className="flex items-center gap-3">
            {state.success ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
            <p className="text-lg font-semibold">{state.message}</p>
          </div>
          <p className="mt-4 text-sm">
            {state.success
              ? 'Your account is active now. You can continue to the login page.'
              : 'If the link expired, register again or trigger a fresh verification email from your next sign-up.'}
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:shadow-indigo-500/40"
          >
            <MailCheck className="h-4 w-4" />
            Go to Login
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
