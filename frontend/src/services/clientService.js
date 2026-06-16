import { api } from './api';

const STORAGE_KEY = 'qb_clients';

const demoClients = [
  {
    id: 1,
    first_name: 'Maria',
    last_name: 'Santos',
    email: 'client@queensbanquetevents.ph',
    phone: '+63 917 000 0000',
    status: 'active',
    password: 'client123',
    created_at: new Date().toISOString(),
  },
];

function readLocalClients() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoClients));
  return [...demoClients];
}

function writeLocalClients(clients) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

function toPublicClient(client) {
  const { password, ...rest } = client;
  return rest;
}

export function findLocalClientByEmail(email, password) {
  const clients = readLocalClients();
  const match = clients.find(
    (c) => c.email.toLowerCase() === email.toLowerCase() && c.status === 'active',
  );
  if (!match || match.password !== password) return null;
  return {
    email: match.email,
    role: 'client',
    name: `${match.first_name} ${match.last_name}`,
    initials: `${match.first_name?.[0] || ''}${match.last_name?.[0] || ''}`.toUpperCase(),
    id: match.id,
  };
}

export const clientService = {
  getAll: async () => {
    try {
      const res = await api.get('/clients');
      return { data: res.data || [] };
    } catch {
      return { data: readLocalClients().map(toPublicClient) };
    }
  },

  create: async (payload) => {
    try {
      const res = await api.post('/clients', payload);
      return { data: res.data };
    } catch {
      const clients = readLocalClients();
      if (clients.some((c) => c.email.toLowerCase() === payload.email.toLowerCase())) {
        throw new Error('Email already registered');
      }
      const newClient = {
        id: Date.now(),
        first_name: payload.firstName,
        last_name: payload.lastName,
        email: payload.email,
        phone: payload.phone || '',
        status: 'active',
        password: payload.password,
        created_at: new Date().toISOString(),
      };
      writeLocalClients([...clients, newClient]);
      return { data: toPublicClient(newClient) };
    }
  },

  update: async (id, payload) => {
    try {
      const res = await api.put(`/clients/${id}`, payload);
      return { data: res.data };
    } catch {
      const clients = readLocalClients();
      const index = clients.findIndex((c) => c.id === id);
      if (index === -1) throw new Error('Client not found');
      const updated = {
        ...clients[index],
        first_name: payload.firstName ?? clients[index].first_name,
        last_name: payload.lastName ?? clients[index].last_name,
        email: payload.email ?? clients[index].email,
        phone: payload.phone ?? clients[index].phone,
        status: payload.status ?? clients[index].status,
      };
      if (payload.password) updated.password = payload.password;
      clients[index] = updated;
      writeLocalClients(clients);
      return { data: toPublicClient(updated) };
    }
  },

  archive: async (id) => {
    try {
      await api.delete(`/clients/${id}`);
      return { success: true };
    } catch {
      const clients = readLocalClients();
      const index = clients.findIndex((c) => c.id === id);
      if (index === -1) throw new Error('Client not found');
      clients[index] = { ...clients[index], status: 'disabled' };
      writeLocalClients(clients);
      return { success: true };
    }
  },
};
