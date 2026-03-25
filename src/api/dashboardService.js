import { apiFetch } from './apiClient';

export const getAllResources = async () => apiFetch('/resources/all');

export const getRecommendations = async (userId) => apiFetch(`/recommendations/${userId}`);

export const getDownloadAnalytics = async () => apiFetch('/analytics/downloads');

export const getDashboardOverview = async () => apiFetch('/analytics/overview');

export const getRecentActivity = async () => apiFetch('/activity');

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
