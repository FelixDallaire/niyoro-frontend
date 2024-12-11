import { defineStore } from "pinia";
import { login, signup, setAuthToken } from "../services/authService";
import { useUserStore } from "./userStore";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    token: localStorage.getItem("authToken") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null,
  }),

  actions: {
    /**
     * Gère l'inscription d'un nouvel utilisateur et met à jour l'état d'authentification.
     *
     * @param {Object} signupData - Les données nécessaires pour l'inscription (ex. email, mot de passe).
     */
    async signupUser(signupData) {
      this.loading = true;
      try {
        const response = await signup(signupData);

        const { token, userId, username, email, avatar, is_admin } =
          response.data;

        const user = {
          userId,
          username,
          email,
          avatar,
          is_admin,
        };

        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));

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

    /**
     * Gère la connexion d'un utilisateur et met à jour l'état d'authentification.
     *
     * @param {Object} loginData - Les données nécessaires pour la connexion (ex. email, mot de passe).
     */
    async loginUser(loginData) {
      this.loading = true;
      try {
        const response = await login(loginData);

        const { token, userId, username, email, avatar, is_admin } =
          response.data;

        const user = {
          userId,
          username,
          email,
          avatar,
          is_admin,
        };

        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));

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

    /**
     * Déconnecte l'utilisateur et réinitialise l'état d'authentification.
     *
     * @param {Object} router - L'objet Vue Router pour rediriger vers la page de connexion.
     */
    logoutUser(router) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      this.token = null;
      this.user = null;

      setAuthToken(null);

      const userStore = useUserStore();
      userStore.currentUser = null;

      if (router) {
        router.push("/login");
      }
    },

    /**
     * Recharge l'état d'authentification à partir des données stockées dans le localStorage.
     */
    refreshStateFromLocalStorage() {
      this.token = localStorage.getItem("authToken");
      this.user = JSON.parse(localStorage.getItem("user"));

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
    /**
     * Vérifie si l'utilisateur est authentifié.
     */
    isAuthenticated: (state) => !!state.token,

    /**
     * Vérifie si l'utilisateur a le rôle d'administrateur.
     */
    is_admin: (state) => state.user?.is_admin ?? false,
  },
});
