import axios from 'axios';

const apiBaseUrl = '/api/items';

export const fetchItems = async () => {
  return await axios.get(apiBaseUrl);
};

export const fetchMyItems = async () => {
  return await axios.get(`${apiBaseUrl}/me`);
};

export const fetchItemsByUser = async (userId) => {
  return await axios.get(`/api/users/${userId}/items`);
};

export const fetchItemById = async (itemId) => {
  return await axios.get(`${apiBaseUrl}/${itemId}`);
};

export const createItem = async (itemData) => {
  return await axios.post(apiBaseUrl, itemData);
};

export const updateItem = async (itemId, updatedData) => {
  return await axios.put(`${apiBaseUrl}/${itemId}`, updatedData);
};

export const deleteItem = async (itemId) => {
  return await axios.delete(`${apiBaseUrl}/${itemId}`);
};
