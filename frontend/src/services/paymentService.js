import { api } from './api';

export const paymentService = {
  getAll: () => api.get('/payments'),
  getByBooking: (bookingId) => api.get(`/payments/booking/${bookingId}`),
  upload: (formData) => api.upload('/payments/upload', formData),
  verify: (id, status) => api.put(`/payments/${id}/verify`, { status }),
};
