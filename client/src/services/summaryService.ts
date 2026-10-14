import api from './api';
import { User, HealthProfile, TwinSummary, HealthMeasurement, DiseaseAssessment, Recommendation } from '../types';

export interface DashboardData {
  success: boolean;
  user: User;
  profile: HealthProfile;
  twinSummary: TwinSummary;
  historicalMeasurements: HealthMeasurement[];
  recentAssessments: DiseaseAssessment[];
  recommendations: Recommendation[];
}

export const summaryService = {
  async getDashboardSummary(days: string = '30') {
    const res = await api.get<DashboardData>('/summary', {
      params: { days },
    });
    return res.data;
  },
};
