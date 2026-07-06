import api from './api';

export const createGroupService = async (name) => {
  const response = await api.post('/groups', { name });
  return response.data;
};

export const joinGroupService = async (inviteCode) => {
  const response = await api.post('/groups/join', { inviteCode });
  return response.data;
};

export const getMyGroupsService = async () => {
  const response = await api.get('/groups');
  return response.data;
};

export const getGroupMembersService = async (groupId) => {
  const response = await api.get(`/groups/${groupId}/members`);
  return response.data;
};

export const getLeaderboardService = async (groupId) => {
  const response = await api.get(`/groups/${groupId}/leaderboard`);
  return response.data;
};