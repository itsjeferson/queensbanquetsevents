import { api } from './api';

export const mediaService = {
  uploadInvitationMedia: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.upload('/media/upload', formData);
  },
};
