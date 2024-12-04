import axios from 'axios';

const baseUrl = '/api';

export const signup = async (signupData) => {
  return await axios.post(`${baseUrl}/signup`, signupData);
};

export const login = async (loginData) => {
  return await axios.post(`${baseUrl}/login`, loginData);
};

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};
