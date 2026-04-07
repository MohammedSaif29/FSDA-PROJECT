import { apiFetch } from './apiClient';

export const getAllResources = async () => apiFetch('/api/resources/all');

export const getRecommendations = async (userId) => apiFetch(`/api/recommendations/${userId}`);

export const getDownloadAnalytics = async () => apiFetch('/api/analytics/downloads');

export const getDashboardOverview = async () => apiFetch('/api/analytics/overview');

export const getRecentActivity = async () => apiFetch('/api/activity');

export const getDashboardContent = async (userId) => {
  const [resources, analytics, activity, recommendations, overview] = await Promise.all([
    getAllResources(),
    getDownloadAnalytics(),
    getRecentActivity(),
    userId ? getRecommendations(userId) : Promise.resolve([]),
    getDashboardOverview(),
  ]);

  return {
    resources,
    analytics,
    activity,
    recommendations,
    overview,
  };
};
