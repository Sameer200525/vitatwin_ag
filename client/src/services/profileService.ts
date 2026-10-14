import api from './api';
import { HealthProfile } from '../types';

export const profileService = {
  async getProfile() {
    const res = await api.get<{ success: boolean; profile: HealthProfile }>('/profile');
    return res.data.profile;
  },

  async updateProfile(data: Partial<HealthProfile>) {
    const res = await api.put<{ success: boolean; profile: HealthProfile; message: string }>('/profile', data);
    return res.data;
  },
};
