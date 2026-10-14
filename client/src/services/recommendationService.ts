import api from './api';
import { Recommendation } from '../types';

export const recommendationService = {
  async getRecommendations() {
    const res = await api.get<{ success: boolean; count: number; recommendations: Recommendation[] }>('/recommendations');
    return res.data.recommendations;
  },

  async refreshRecommendations() {
    const res = await api.post<{ success: boolean; message: string; count: number; recommendations: Recommendation[] }>('/recommendations/generate');
    return res.data.recommendations;
  },
};
