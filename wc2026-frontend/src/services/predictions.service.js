import api from './api';

export const createPredictionService = async (predictionData) => {
  // predictionData contiene { matchId, predictedHomeScore, predictedAwayScore }
  const response = await api.post('/predictions', predictionData);
  return response.data;
};

export const updatePredictionService = async (predictionId, predictionData) => {
  const response = await api.put(`/predictions/${predictionId}`, predictionData);
  return response.data;
};

export const getMyPredictionsService = async () => {
  const response = await api.get('/predictions');
  return response.data;
};