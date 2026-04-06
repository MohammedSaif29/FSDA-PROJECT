import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/ui/Loader';
import { getCurrentUser } from '../api/apiClient';
import { getRedirectPathForRole, setAuth } from '../hooks/useAuth';

export default function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const completeAuthentication = async () => {
      // Backend puts query parameters before the hash: /?token=...#/auth/callback
      // location.search only parses after the hash. We must capture window.location.search!
      const activeSearch = location.search || window.location.search;
      const params = new URLSearchParams(activeSearch);
      const token = params.get('token');

      if (!token) {
        toast.error('Google sign-in did not return a token.');
        navigate('/login', { replace: true });
        return;
      }

      const fallbackUser = {
        id: Number(params.get('userId')),
        username: params.get('username'),
        email: params.get('email'),
        role: params.get('role'),
      };

      try {
        setAuth(fallbackUser, token);
        const currentUser = await getCurrentUser();
        const nextUser = {
          id: currentUser.id,
          username: currentUser.username,
          email: currentUser.email,
          role: currentUser.role,
        };

        setAuth(nextUser, token);
        toast.success('Signed in with Google');
        navigate(getRedirectPathForRole(currentUser.role), { replace: true });
      } catch {
        setAuth(fallbackUser, token);
        toast.success('Signed in with Google');
        navigate(getRedirectPathForRole(fallbackUser.role), { replace: true });
      }
    };

    completeAuthentication();
  }, [location.search, navigate]);

  return <Loader message="Completing Google sign-in..." />;
}
