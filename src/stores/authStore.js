import { defineStore } from 'pinia';
import { login, signup, setAuthToken } from '../services/authService';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    token: localStorage.getItem('authToken') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null,
  }),
  actions: {
    async signupUser(signupData) {
      this.loading = true;
      try {
        const response = await signup(signupData);
        const { token, ...userData } = response.data;

        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));

        this.token = token;
        this.user = userData;

        setAuthToken(token);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async loginUser(loginData) {
      this.loading = true;
      try {
        const response = await login(loginData);
        const { token, ...userData } = response.data;

        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));

        this.token = token;
        this.user = userData;

        setAuthToken(token);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    logoutUser() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      this.token = null;
      this.user = null;

      setAuthToken(null);
    },
  },
  getters: {
    isAuthenticated: (state) => {
      return !!state.token;
    },
    isAdmin: (state) => {
      return state.user?.is_admin ?? false;
    },
  },
});
