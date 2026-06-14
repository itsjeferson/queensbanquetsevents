import { api } from './api';

export const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  disable: (id) => api.put(`/users/${id}/disable`),
  enable: (id) => api.put(`/users/${id}/enable`),
};
