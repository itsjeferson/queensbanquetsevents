import { api } from './api';

export const reportService = {
  getAdminDashboard: () => api.get('/reports/dashboard'),
  getClientDashboard: (clientId) => api.get(`/reports/dashboard?client_id=${clientId}`),
  getCalendar: (year, month) => api.get(`/reports/calendar?year=${year}&month=${month}`),
};
