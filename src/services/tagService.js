import axios from 'axios';
import apiBaseUrl from '../config/apiConfig';

export const createTag = async (tagData) => {
  return await axios.post(`${apiBaseUrl}/tags`, tagData);
};

export const getAllTags = async () => {
  return await axios.get(`${apiBaseUrl}/tags`);
};

export const getTagById = async (tagId) => {
  return await axios.get(`${apiBaseUrl}/tags/${tagId}`);
};

export const updateTag = async (tagId, tagData) => {
  return await axios.put(`${apiBaseUrl}/tags/${tagId}`, tagData);
};

export const deleteTag = async (tagId) => {
  return await axios.delete(`${apiBaseUrl}/tags/${tagId}`);
};
