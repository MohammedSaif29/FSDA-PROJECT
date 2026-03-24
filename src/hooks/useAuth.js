export const getToken = () => localStorage.getItem('token');

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch {
    return null;
  }
};

export const setAuth = (user, token) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.replace('/#/login');
};

export const isAuthenticated = () => {
  return Boolean(getToken() && getUser());
};
