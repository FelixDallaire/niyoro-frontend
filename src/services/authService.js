import axios from 'axios';
import apiBaseUrl from '../config/apiConfig';

export const signup = async (signupData) => {
  return await axios.post(`${apiBaseUrl}/signup`, signupData);
};

export const login = async (loginData) => {
  return await axios.post(`${apiBaseUrl}/login`, loginData);
};

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};
