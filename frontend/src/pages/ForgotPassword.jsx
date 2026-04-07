import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { forgotPassword } from '../api/apiClient';
import { getRecaptchaToken, isRecaptchaEnabled } from '../lib/recaptcha';
import AuthShell from '../components/auth/AuthShell';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const recaptchaToken = await getRecaptchaToken('forgot_password');
      const response = await forgotPassword({ email, recaptchaToken });
      toast.success(response.message || 'If that account exists, a reset email has been sent.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Unable to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Account Recovery"
      title="Forgot your password?"
      description="Enter your email address and we will send you a secure password reset link."
      footer={<Link to="/login" className="font-semibold text-indigo-300 hover:text-indigo-200">Back to sign in</Link>}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField
          label="Account email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          icon={Mail}
          placeholder="you@company.com"
        />
        <Button type="submit" loading={loading} className="w-full">
          Send Reset Link
        </Button>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
          Reset links expire quickly and invalidate older sessions after password change.
          {isRecaptchaEnabled ? <p className="mt-2 text-cyan-200">reCAPTCHA is active on this form.</p> : null}
        </div>
      </form>
    </AuthShell>
  );
}
