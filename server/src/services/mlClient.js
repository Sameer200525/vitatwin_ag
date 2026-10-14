const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

const client = axios.create({
  baseURL: ML_SERVICE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const mlClient = {
  async getHealth() {
    try {
      const response = await client.get('/health');
      return response.data;
    } catch (error) {
      console.warn(`[ML Client] Health check failed: ${error.message}`);
      return { status: 'offline', error: error.message };
    }
  },

  async getMetadata() {
    try {
      const response = await client.get('/api/models/metadata');
      return response.data;
    } catch (error) {
      console.warn(`[ML Client] Failed to fetch metadata: ${error.message}`);
      return null;
    }
  },

  async predictHeart(payload) {
    const response = await client.post('/api/predict/heart', payload);
    return response.data;
  },

  async predictDiabetes(payload) {
    const response = await client.post('/api/predict/diabetes', payload);
    return response.data;
  },

  async predictHypertension(payload) {
    const response = await client.post('/api/predict/hypertension', payload);
    return response.data;
  },

  async predictStroke(payload) {
    const response = await client.post('/api/predict/stroke', payload);
    return response.data;
  },

  async predictKidney(payload) {
    const response = await client.post('/api/predict/kidney', payload);
    return response.data;
  },

  async predictObesity(payload) {
    const response = await client.post('/api/predict/obesity', payload);
    return response.data;
  },

  async predictAll(payload) {
    const response = await client.post('/api/predict/all', payload);
    return response.data;
  },
};

module.exports = mlClient;
