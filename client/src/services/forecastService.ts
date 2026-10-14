import api from './api';
import { ForecastResult } from '../types';

export const forecastService = {
  async getForecast(metric: string, horizonDays: number = 30) {
    const res = await api.get<{ success: boolean; forecast: ForecastResult }>(`/forecast/${metric}`, {
      params: { horizonDays },
    });
    return res.data.forecast;
  },
};
