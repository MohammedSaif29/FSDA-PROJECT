import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute({ allowedRoles = [] }) {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');

  if (!token || !userJson) {
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = JSON.parse(userJson);
  } catch (e) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/home'} replace />;
  }

  return <Outlet />;
}
