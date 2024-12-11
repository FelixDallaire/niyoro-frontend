import axios from "axios";
import apiBaseUrl from "../config/apiConfig";

export const createReaction = async (itemId, reactionData) => {
  return await axios.post(
    `${apiBaseUrl}/items/${itemId}/reactions`,
    reactionData
  );
};

export const getReactionsByItem = async (itemId) => {
  return await axios.get(`${apiBaseUrl}/items/${itemId}/reactions`);
};

export const deleteReaction = async (reactionId) => {
  return await axios.delete(`${apiBaseUrl}/reactions/${reactionId}`);
};
