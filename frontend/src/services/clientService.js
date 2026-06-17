import { api } from './api';

export const clientService = {
  getAll: () => api.get('/clients').then((res) => ({ data: res.data || [] })),
  create: (payload) => api.post('/clients', payload).then((res) => ({ data: res.data })),
  update: (id, payload) => api.put(`/clients/${id}`, payload).then((res) => ({ data: res.data })),
  archive: (id) => api.delete(`/clients/${id}`).then(() => ({ success: true })),
};
