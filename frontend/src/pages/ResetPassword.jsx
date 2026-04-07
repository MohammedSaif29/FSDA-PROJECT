import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { resetPassword } from '../api/apiClient';
import { getRecaptchaToken, isRecaptchaEnabled } from '../lib/recaptcha';
import AuthShell from '../components/auth/AuthShell';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const recaptchaToken = await getRecaptchaToken('reset_password');
      const response = await resetPassword({
        token,
        email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        recaptchaToken,
      });

      toast.success(response.message || 'Password updated successfully.');
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Reset Password"
      title="Choose a new password"
      description="Use a strong password with uppercase, lowercase, and numbers. Your old refresh sessions will be revoked."
      footer={<Link to="/login" className="font-semibold text-indigo-300 hover:text-indigo-200">Back to sign in</Link>}
    >
      {!token || !email ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-100">
          Reset link is incomplete. Open the reset email again and use the full link.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="New password"
            name="password"
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            icon={KeyRound}
          />
          <InputField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
            icon={KeyRound}
          />
          <Button type="submit" loading={loading} className="w-full">
            Update Password
          </Button>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
            Password must be at least 8 characters and include uppercase, lowercase, and a number.
            {isRecaptchaEnabled ? <p className="mt-2 text-cyan-200">reCAPTCHA is active on this form.</p> : null}
          </div>
        </form>
      )}
    </AuthShell>
  );
}
