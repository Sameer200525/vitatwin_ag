import api from './api';
import { DiseaseAssessment } from '../types';

export const predictionService = {
  async predictHeart(payload: any) {
    const res = await api.post<{ success: boolean; assessmentId: string; result: any }>('/predictions/heart', payload);
    return res.data;
  },

  async predictDiabetes(payload: any) {
    const res = await api.post<{ success: boolean; assessmentId: string; result: any }>('/predictions/diabetes', payload);
    return res.data;
  },

  async predictHypertension(payload: any) {
    const res = await api.post<{ success: boolean; assessmentId: string; result: any }>('/predictions/hypertension', payload);
    return res.data;
  },

  async predictStroke(payload: any) {
    const res = await api.post<{ success: boolean; assessmentId: string; result: any }>('/predictions/stroke', payload);
    return res.data;
  },

  async predictKidney(payload: any) {
    const res = await api.post<{ success: boolean; assessmentId: string; result: any }>('/predictions/kidney', payload);
    return res.data;
  },

  async predictObesity(payload: any) {
    const res = await api.post<{ success: boolean; assessmentId: string; result: any }>('/predictions/obesity', payload);
    return res.data;
  },

  async predictAll(payload?: any) {
    const res = await api.post<{ success: boolean; results: Record<string, any> }>('/predictions/all', payload || {});
    return res.data;
  },

  async getHistory(disease?: string) {
    const res = await api.get<{ success: boolean; count: number; history: DiseaseAssessment[] }>('/predictions/history', {
      params: { disease },
    });
    return res.data;
  },
};
