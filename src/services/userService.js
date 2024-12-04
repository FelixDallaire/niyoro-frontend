import axios from 'axios';

const baseUrl = '/api';

export const getUser = async () => {
  return await axios.get(`${baseUrl}/me`);
};

export const updateUser = async (updateData) => {
  return await axios.put(`${baseUrl}/me`, updateData);
};

export const deleteUser = async () => {
  return await axios.delete(`${baseUrl}/me`);
};

export const getAllUsers = async () => {
  return await axios.get(`${baseUrl}/users`);
};

export const getUserById = async (userId) => {
  return await axios.get(`${baseUrl}/users/${userId}`);
};

export const updateUserById = async (userId, updateData) => {
  return await axios.put(`${baseUrl}/users/${userId}`, updateData);
};

export const deleteUserById = async (userId) => {
  return await axios.delete(`${baseUrl}/users/${userId}`);
};
