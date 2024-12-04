import axios from 'axios';

const baseUrl = '/api/tags';

export const createTag = async (tagData) => {
  return await axios.post(baseUrl, tagData);
};

export const getAllTags = async () => {
  return await axios.get(baseUrl);
};

export const getTagById = async (tagId) => {
  return await axios.get(`${baseUrl}/${tagId}`);
};

export const updateTag = async (tagId, tagData) => {
  return await axios.put(`${baseUrl}/${tagId}`, tagData);
};

export const deleteTag = async (tagId) => {
  return await axios.delete(`${baseUrl}/${tagId}`);
};
