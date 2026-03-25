import { apiFetch, getAllResources } from './apiClient';

export const getStudentDashboard = async (userId) => apiFetch(`/student/dashboard/${userId}`);

export const getStudentActivity = async (userId) => apiFetch(`/user/activity/${userId}`);

export const getStudentSavedResources = async (userId) => apiFetch(`/user/saved/${userId}`);

export const getStudentRecommendations = async (userId) => apiFetch(`/recommendations/${userId}`);

export const getExploreResources = async () => getAllResources();
