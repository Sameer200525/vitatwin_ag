import api from './api';
import { User, HealthProfile } from '../types';

export const authService = {
  async register(data: { name: string; email: string; password: string }) {
    const res = await api.post<{ success: boolean; token: string; user: User }>('/auth/register', data);
    if (res.data.token) {
      localStorage.setItem('vitatwin_token', res.data.token);
    }
    return res.data;
  },

  async login(data: { email: string; password: string }) {
    const res = await api.post<{ success: boolean; token: string; user: User }>('/auth/login', data);
    if (res.data.token) {
      localStorage.setItem('vitatwin_token', res.data.token);
    }
    return res.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('vitatwin_token');
    }
  },

  async getMe() {
    const res = await api.get<{ success: boolean; user: User; profile: HealthProfile }>('/auth/me');
    return res.data;
  },
};
