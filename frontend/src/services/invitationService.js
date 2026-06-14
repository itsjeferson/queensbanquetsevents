import { api } from './api';

export const invitationService = {
  getBySlug: (slug) => api.get(`/invitations/slug/${slug}`),
  getByCode: (code) => api.get(`/invitations/code/${code}`),
};

export const eventService = {
  getAll: (clientId) => api.get(clientId ? `/events?client_id=${clientId}` : '/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  publish: (id) => api.post(`/events/${id}/publish`),
  delete: (id) => api.delete(`/events/${id}`),
};

export const guestService = {
  getByEvent: (eventId) => api.get(`/guests/event/${eventId}`),
  add: (data) => api.post('/guests', data),
  bulkAdd: (eventId, guests) => api.post('/guests/bulk', { event_id: eventId, guests }),
  remove: (id) => api.delete(`/guests/${id}`),
};

export const rsvpService = {
  getByEvent: (eventId) => api.get(`/rsvp/event/${eventId}`),
  submit: (data) => api.post('/rsvp', data),
};

export const guestMessageService = {
  getByEvent: (eventId) => api.get(`/guest-messages/event/${eventId}`),
  submit: (data) => api.post('/guest-messages', data),
};

export const templateService = {
  getAll: (category) => api.get(category ? `/templates?category=${category}` : '/templates'),
  getById: (id) => api.get(`/templates/${id}`),
  create: (data) => api.post('/templates', data),
  update: (id, data) => api.put(`/templates/${id}`, data),
};
