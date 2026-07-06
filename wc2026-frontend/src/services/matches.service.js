import api from './api';

export const getMatchesService = async (filters = {}) => {
  const response = await api.get('/matches', { params: filters });
  return response.data;
};

export const createMatchService = async (matchData) => {
  const response = await api.post('/matches', matchData);
  return response.data;
};

export const updateMatchService = async (matchId, matchData) => {
  const response = await api.put(`/matches/${matchId}`, matchData);
  return response.data;
};