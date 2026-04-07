import { apiFetch } from './apiClient';

export const getAdminStats = async () => apiFetch('/api/admin/stats');

export const getAdminDownloadsTrend = async () => apiFetch('/api/admin/downloads-trend');

export const getAdminCategoryStats = async () => apiFetch('/api/admin/category-stats');

export const getAdminRecentActivity = async () => apiFetch('/api/admin/recent-activity');

export const getAdminSavedResources = async () => apiFetch('/api/admin/saved-resources');

export const deleteAdminResource = async (id) => apiFetch(`/api/admin/resources/${id}`, { method: 'DELETE' });

export const getAdminResources = async () => apiFetch('/api/admin/resources');

export const updateAdminResource = async (id, payload) => apiFetch(`/api/admin/resources/${id}`, {
  method: 'PUT',
  data: payload,
});

export const getAdminUsers = async () => apiFetch('/api/admin/users');

export const createAdminUser = async (payload) => apiFetch('/api/admin/users/admin', {
  method: 'POST',
  data: payload,
});

export const updateAdminUserRole = async (id, role) => apiFetch(`/api/admin/users/${id}/role`, {
  method: 'PUT',
  data: { role },
});

export const deleteAdminUser = async (id) => apiFetch(`/api/admin/users/${id}`, {
  method: 'DELETE',
});

export const getAdminDashboardData = async () => {
  const [stats, downloadsTrend, categoryStats, recentActivity, resources] = await Promise.all([
    getAdminStats(),
    getAdminDownloadsTrend(),
    getAdminCategoryStats(),
    getAdminRecentActivity(),
    getAdminResources(),
  ]);

  return {
    stats,
    downloadsTrend,
    categoryStats,
    recentActivity,
    resources,
  };
};
