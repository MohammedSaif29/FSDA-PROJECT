import { apiFetch, getResources } from './apiClient';

export const getAdminStats = async () => apiFetch('/admin/stats');

export const getAdminDownloadsTrend = async () => apiFetch('/admin/downloads-trend');

export const getAdminCategoryStats = async () => apiFetch('/admin/category-stats');

export const getAdminRecentActivity = async () => apiFetch('/admin/recent-activity');

export const getAdminSavedResources = async () => apiFetch('/admin/saved-resources');

export const deleteAdminResource = async (id) => apiFetch(`/admin/resources/${id}`, { method: 'DELETE' });

export const getAdminResources = async () => getResources();

export const getAdminDashboardData = async () => {
  const [stats, downloadsTrend, categoryStats, recentActivity, resources] = await Promise.all([
    getAdminStats(),
    getAdminDownloadsTrend(),
    getAdminCategoryStats(),
    getAdminRecentActivity(),
    getResources(),
  ]);

  return {
    stats,
    downloadsTrend,
    categoryStats,
    recentActivity,
    resources,
  };
};
