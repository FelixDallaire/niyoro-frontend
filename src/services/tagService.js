import axios from 'axios';
import apiBaseUrl from '../config/apiConfig';

export const createTag = async (tagData) => {
  return await axios.post(apiBaseUrl, tagData);
};

export const getAllTags = async () => {
  return await axios.get(apiBaseUrl);
};

export const getTagById = async (tagId) => {
  return await axios.get(`${apiBaseUrl}/${tagId}`);
};

export const updateTag = async (tagId, tagData) => {
  return await axios.put(`${apiBaseUrl}/${tagId}`, tagData);
};

export const deleteTag = async (tagId) => {
  return await axios.delete(`${apiBaseUrl}/${tagId}`);
};
