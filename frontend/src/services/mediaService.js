import { api } from './api';

export const mediaService = {
  uploadInvitationMedia: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.upload('/events/upload', formData);
  },
  importRemoteMedia: (url) => api.post('/events/import-media', { url }),
};
