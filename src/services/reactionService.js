import axios from 'axios';

const baseUrl = '/api';

export const createReaction = async (itemId, reactionData) => {
  return await axios.post(`${baseUrl}/items/${itemId}/reactions`, reactionData);
};

export const getReactionsByItem = async (itemId) => {
  return await axios.get(`${baseUrl}/items/${itemId}/reactions`);
};

export const deleteReaction = async (reactionId) => {
  return await axios.delete(`${baseUrl}/reactions/${reactionId}`);
};
