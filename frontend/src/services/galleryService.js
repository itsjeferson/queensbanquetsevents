import { api } from './api';

export const galleryService = {
  getAll: (category) => api.get(category ? `/gallery?category=${category}` : '/gallery'),
  upload: (formData) => api.upload('/gallery/upload', formData),
  delete: (id) => api.delete(`/gallery/${id}`),
};
