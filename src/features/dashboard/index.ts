export { default as UserDashboard } from './components/UserDashboard';
export { default as SavedChatCard } from './components/SavedChatCard';

export { default as useUserDashboard } from './hooks/useUserDashboard';

export { fetchDashboardStats, fetchSavedChats, deleteSavedChat } from './services/dashboardService';

export type { DashboardStats, SavedChat } from './types/dashboardTypes';