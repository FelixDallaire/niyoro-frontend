import { defineStore } from 'pinia';
import { login, signup, setAuthToken } from '../services/authService';
import { useUserStore } from './userStore';

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
        const { token, userId, username, email, avatar, isAdmin } = response.data;

        const user = {
          userId,
          username,
          email,
          avatar,
          isAdmin: isAdmin ?? false,
        };

        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));

        this.token = token;
        this.user = user;

        setAuthToken(token);

        const userStore = useUserStore();
        userStore.currentUser = user;
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
        const { token, userId, username, email, avatar, isAdmin } = response.data;

        const user = {
          userId,
          username,
          email,
          avatar,
          isAdmin: isAdmin ?? false,
        };

        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));

        this.token = token;
        this.user = user;

        setAuthToken(token);

        const userStore = useUserStore();
        userStore.currentUser = user;
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

      const userStore = useUserStore();
      userStore.currentUser = null;
    },

    refreshStateFromLocalStorage() {
      this.token = localStorage.getItem('authToken');
      this.user = JSON.parse(localStorage.getItem('user'));

      if (this.token) {
        setAuthToken(this.token);

        const userStore = useUserStore();
        userStore.currentUser = this.user;
      } else {
        setAuthToken(null);
      }
    },
  },

  getters: {
    isAuthenticated: (state) => {
      return !!state.token;
    },
    isAdmin: (state) => {
      return state.user?.isAdmin ?? false;
    },
  },
});
