import { API_URL } from '../utils/constants';
import { authStorage } from '../utils/authStorage';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request(endpoint, options = {}) {
  const token = authStorage.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.message || 'Request failed', response.status, data);
  }

  return data;
}

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
  upload: async (endpoint, formData) => {
    const token = authStorage.getToken();
    let response;

    try {
      response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
    } catch {
      throw new ApiError('Could not reach the server. Check your connection and try again.', 0);
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data.message
        || (response.status === 404 ? 'Upload route not found on server.' : 'Upload failed');
      throw new ApiError(message, response.status, data);
    }
    return data;
  },
};

export { ApiError };
