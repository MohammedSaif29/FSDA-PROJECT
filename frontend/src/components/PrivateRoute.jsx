import { Navigate, Outlet } from 'react-router-dom';
import { getRedirectPathForRole, getRole, getUser } from '../hooks/useAuth';

export default function PrivateRoute({ role, allowedRoles = [] }) {
  const token = localStorage.getItem('token');
  const storedRole = getRole();
  const user = getUser();

  if (!token || !storedRole || !user) {
    return <Navigate to="/login" replace />;
  }

  const expectedRoles = role ? [role] : allowedRoles;

  if (expectedRoles.length > 0 && !expectedRoles.includes(storedRole)) {
    return <Navigate to={getRedirectPathForRole(storedRole)} replace />;
  }

  return <Outlet />;
}
