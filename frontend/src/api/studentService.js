import { apiFetch, getAllResources } from './apiClient';

export const getStudentDashboard = async (userId) => apiFetch(`/api/student/dashboard/${userId}`);

export const getStudentActivity = async (userId) => apiFetch(`/api/user/activity/${userId}`);

export const getStudentSavedResources = async (userId) => apiFetch(`/api/user/saved/${userId}`);

export const getStudentRecommendations = async (userId) => apiFetch(`/api/recommendations/${userId}`);

export const getExploreResources = async () => getAllResources();
