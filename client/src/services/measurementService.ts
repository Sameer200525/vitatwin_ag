import api from './api';
import { HealthMeasurement, MeasurementType } from '../types';

export const measurementService = {
  async getMeasurements(params?: {
    type?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    page?: number;
  }) {
    const res = await api.get<{
      success: boolean;
      count: number;
      total: number;
      measurements: HealthMeasurement[];
    }>('/measurements', { params });
    return res.data;
  },

  async createMeasurement(data: {
    type: MeasurementType;
    value: number;
    secondaryValue?: number;
    unit: string;
    notes?: string;
    recordedAt?: string;
  }) {
    const res = await api.post<{
      success: boolean;
      message: string;
      measurement: HealthMeasurement;
    }>('/measurements', data);
    return res.data;
  },

  async updateMeasurement(
    id: string,
    data: {
      type?: MeasurementType;
      value?: number;
      secondaryValue?: number;
      unit?: string;
      notes?: string;
      recordedAt?: string;
    }
  ) {
    const res = await api.put<{
      success: boolean;
      message: string;
      measurement: HealthMeasurement;
    }>(`/measurements/${id}`, data);
    return res.data;
  },

  async deleteMeasurement(id: string) {
    const res = await api.delete<{ success: boolean; message: string }>(`/measurements/${id}`);
    return res.data;
  },

  async downloadCSV() {
    const response = await api.get('/measurements/export/csv', {
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `vitatwin_health_records_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
