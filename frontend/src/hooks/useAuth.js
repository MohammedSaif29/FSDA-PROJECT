const TOKEN_KEY = 'eduvaultToken';
const USER_KEY = 'eduvaultUser';
const ROLE_KEY = 'eduvaultRole';
const USERNAME_KEY = 'eduvaultUsername';
const USER_ID_KEY = 'eduvaultUserId';

const isDevMode = import.meta.env.DEV;
const isDemoAutoLoginEnabled =
  isDevMode && String(import.meta.env.VITE_AUTO_LOGIN_DEMO ?? 'false').toLowerCase() !== 'false';
const demoRole = String(import.meta.env.VITE_DEMO_ROLE ?? 'ADMIN').toUpperCase();

export const normalizeUserRole = (role) => {
  const normalized = String(role || '').trim().toUpperCase();
  if (normalized === 'ADMIN') return 'ADMIN';
  if (normalized === 'USER' || normalized === 'STUDENT') return 'USER';
  return 'USER';
};

export const getRedirectPathForRole = (role) =>
  normalizeUserRole(role) === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard';

export const getDemoCredentials = () => {
  if (demoRole === 'USER') {
    return {
      email: import.meta.env.VITE_DEMO_EMAIL || 'user1@gmail.com',
      password: import.meta.env.VITE_DEMO_PASSWORD || 'user123',
    };
  }

  return {
    email: import.meta.env.VITE_DEMO_EMAIL || 'admin@eduvault.com',
    password: import.meta.env.VITE_DEMO_PASSWORD || 'admin123',
  };
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const isAuthenticated = () => !!getToken();
export const getRole = () => normalizeUserRole(localStorage.getItem(ROLE_KEY) || 'USER');

export const getUserId = () => {
  const rawUserId = localStorage.getItem(USER_ID_KEY);
  if (!rawUserId) return null;
  const numericUserId = Number(rawUserId);
  return Number.isNaN(numericUserId) ? null : numericUserId;
};

export const getUsername = () => localStorage.getItem(USERNAME_KEY);

export const getUser = () => {
  const storedUser = localStorage.getItem(USER_KEY);
  const username = getUsername();
  const role = getRole();
  const userId = getUserId();

  if ((!storedUser || storedUser === 'undefined') && username) {
    return { id: userId, username, role };
  }

  if (!storedUser || storedUser === 'undefined') return null;

  try {
    const parsed = JSON.parse(storedUser);
    return {
      ...parsed,
      role: normalizeUserRole(parsed.role ?? role),
      username: parsed.username ?? username,
      id: parsed.id ?? userId,
    };
  } catch {
    return { id: userId, username, role };
  }
};

export const setAuth = (user, token) => {
  const normalizedRole = normalizeUserRole(user.role);
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify({ ...user, role: normalizedRole }));
  localStorage.setItem(ROLE_KEY, normalizedRole);
  localStorage.setItem(USERNAME_KEY, user.username || '');
  if (user.id !== undefined && user.id !== null) {
    localStorage.setItem(USER_ID_KEY, String(user.id));
  } else {
    localStorage.removeItem(USER_ID_KEY);
  }
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(USER_ID_KEY);
};

export const logout = () => {
  clearAuth();
  window.location.href = `${import.meta.env.BASE_URL}login`;
};

export { isDemoAutoLoginEnabled };
