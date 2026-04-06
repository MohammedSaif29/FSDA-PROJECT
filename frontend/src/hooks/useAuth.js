export const getToken = () => localStorage.getItem('token');
export const getRole = () => normalizeUserRole(localStorage.getItem('role'));
export const getUsername = () => localStorage.getItem('username');
export const getEmail = () => localStorage.getItem('email');
export const isDevMode = Boolean(import.meta.env.DEV);
export const isDemoAutoLoginEnabled = (
  isDevMode && String(import.meta.env.VITE_AUTO_LOGIN_DEMO ?? 'false').toLowerCase() !== 'false'
);
export const getDemoCredentials = () => ({
  email: import.meta.env.VITE_DEMO_EMAIL || 'admin@eduvault.com',
  password: import.meta.env.VITE_DEMO_PASSWORD || 'admin123',
  role: import.meta.env.VITE_DEMO_ROLE || 'ADMIN',
});
export const getUserId = () => {
  const rawUserId = localStorage.getItem('userId');
  return rawUserId ? Number(rawUserId) : null;
};

export const normalizeUserRole = (role) => {
  if (!role) return null;
  return role === 'STUDENT' ? 'USER' : role;
};

export const getRedirectPathForRole = (role) => (
  normalizeUserRole(role) === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'
);

export const getHashRouteUrl = (route = '/login') => {
  const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
  const pathname = window.location.pathname || '/';
  const normalizedBasePath = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return `${window.location.origin}${normalizedBasePath}#${normalizedRoute}`;
};

export const getUser = () => {
  try {
    const storedUsername = getUsername();
    const storedRole = localStorage.getItem('role');
    const storedUserId = getUserId();

    if (storedUsername || storedRole || storedUserId !== null) {
      return {
        id: storedUserId,
        username: storedUsername,
        email: getEmail(),
        role: normalizeUserRole(storedRole),
      };
    }

    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (!user) return null;

    const normalizedUser = { ...user, role: normalizeUserRole(user.role) };
    setAuth(normalizedUser, getToken());
    return normalizedUser;
  } catch {
    return null;
  }
};

export const setAuth = (user, token) => {
  const normalizedUser = { ...user, role: normalizeUserRole(user?.role) };
  if (token) {
    localStorage.setItem('token', token);
  }
  if (normalizedUser.id != null) {
    localStorage.setItem('userId', String(normalizedUser.id));
  }
  if (normalizedUser.username) {
    localStorage.setItem('username', normalizedUser.username);
  }
  if (normalizedUser.email) {
    localStorage.setItem('email', normalizedUser.email);
  }
  localStorage.setItem('role', normalizedUser.role);
  localStorage.setItem('user', JSON.stringify(normalizedUser));
};

export const clearAuth = () => {
  ['token', 'userId', 'username', 'email', 'role', 'user'].forEach((key) => localStorage.removeItem(key));
};

export const logout = () => {
  clearAuth();
  window.location.replace(getHashRouteUrl('/login'));
};

export const isAuthenticated = () => {
  return Boolean(getToken() && getRole());
};
