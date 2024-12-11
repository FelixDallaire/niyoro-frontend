import axios from "axios";
import apiBaseUrl from "../config/apiConfig";

export const getUser = async () => {
  return await axios.get(`${apiBaseUrl}/me`);
};

export const updateUser = async (updateData) => {
  return await axios.put(`${apiBaseUrl}/me`, updateData);
};

export const deleteUser = async () => {
  return await axios.delete(`${apiBaseUrl}/me`);
};

export const getAllUsers = async () => {
  return await axios.get(`${apiBaseUrl}/users`);
};

export const getUserById = async (userId) => {
  return await axios.get(`${apiBaseUrl}/users/${userId}`);
};

export const updateUserById = async (userId, updateData) => {
  return await axios.put(`${apiBaseUrl}/users/${userId}`, updateData);
};

export const deleteUserById = async (userId) => {
  return await axios.delete(`${apiBaseUrl}/users/${userId}`);
};
