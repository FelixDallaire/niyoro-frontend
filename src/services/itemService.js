import axios from "axios";
import apiBaseUrl from "../config/apiConfig";

export const fetchItems = async () => {
  return await axios.get(`${apiBaseUrl}/items`);
};

export const fetchMyItems = async () => {
  return await axios.get(`${apiBaseUrl}/me/items`);
};

export const fetchItemsByUser = async (userId) => {
  return await axios.get(`${apiBaseUrl}/users/${userId}/items`);
};

export const fetchItemById = async (itemId) => {
  return await axios.get(`${apiBaseUrl}/items/${itemId}`);
};

export const fetchItemByPermalink = async (permalink) => {
  return await axios.get(`${apiBaseUrl}/items/permalink/${permalink}`);
};

export const createItem = async (itemData) => {
  return await axios.post(`${apiBaseUrl}/items`, itemData);
};

export const updateItem = async (itemId, updatedData) => {
  return await axios.put(`${apiBaseUrl}/items/${itemId}`, updatedData);
};

export const deleteItem = async (itemId) => {
  return await axios.delete(`${apiBaseUrl}/items/${itemId}`);
};
