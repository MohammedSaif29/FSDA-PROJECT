export const getToken = () => localStorage.getItem('token');
export const getRole = () => normalizeUserRole(localStorage.getItem('role'));
export const getUsername = () => localStorage.getItem('username');
export const getUserId = () => {
  const rawUserId = localStorage.getItem('userId');
  return rawUserId ? Number(rawUserId) : null;
};

export const normalizeUserRole = (role) => {
  if (!role) return 'STUDENT';
  return role === 'USER' ? 'STUDENT' : role;
};

export const getRedirectPathForRole = (role) => (
  normalizeUserRole(role) === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'
);

export const getUser = () => {
  try {
    const storedUsername = getUsername();
    const storedRole = localStorage.getItem('role');
    const storedUserId = getUserId();

    if (storedUsername || storedRole || storedUserId !== null) {
      return {
        id: storedUserId,
        username: storedUsername,
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
  localStorage.setItem('role', normalizedUser.role);
  localStorage.setItem('user', JSON.stringify(normalizedUser));
};

export const clearAuth = () => {
  localStorage.clear();
};

export const logout = () => {
  clearAuth();
  window.location.replace('/#/login');
};

export const isAuthenticated = () => {
  return Boolean(getToken() && getRole());
};
