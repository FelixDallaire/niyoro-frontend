import { defineStore } from "pinia";
import {
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../services/userService";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    currentUser: null,
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
  }),
  actions: {
    /**
     * Charge les informations de l'utilisateur actuellement connecté.
     */
    async loadCurrentUser() {
      this.loading = true;
      try {
        const response = await getUser();
        this.currentUser = response.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Modifie les informations de l'utilisateur actuellement connecté.
     *
     * @param {Object} updateData - Les nouvelles données de l'utilisateur.
     */
    async editCurrentUser(updateData) {
      this.loading = true;
      try {
        const response = await updateUser(updateData);
        this.currentUser = response.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Supprime l'utilisateur actuellement connecté.
     */
    async removeCurrentUser() {
      this.loading = true;
      try {
        await deleteUser();
        this.currentUser = null;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Charge la liste de tous les utilisateurs.
     */
    async loadAllUsers() {
      this.loading = true;
      try {
        const response = await getAllUsers();
        this.users = response.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Charge les informations d'un utilisateur spécifique par son ID.
     *
     * @param {String} userId - L'ID de l'utilisateur à charger.
     */
    async loadUserById(userId) {
      this.loading = true;
      try {
        const response = await getUserById(userId);
        this.selectedUser = response.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Modifie les informations d'un utilisateur spécifique par son ID.
     *
     * @param {String} userId - L'ID de l'utilisateur à modifier.
     * @param {Object} updateData - Les nouvelles données de l'utilisateur.
     */
    async editUserById(userId, updateData) {
      this.loading = true;
      try {
        const response = await updateUserById(userId, updateData);
        const index = this.users.findIndex((user) => user._id === userId);
        if (index !== -1) {
          this.users[index] = response.data;
        }
        if (this.selectedUser && this.selectedUser._id === userId) {
          this.selectedUser = response.data;
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Supprime un utilisateur spécifique par son ID.
     *
     * @param {String} userId - L'ID de l'utilisateur à supprimer.
     */
    async removeUserById(userId) {
      this.loading = true;
      try {
        await deleteUserById(userId);
        this.users = this.users.filter((user) => user._id !== userId);
        if (this.selectedUser && this.selectedUser._id === userId) {
          this.selectedUser = null;
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
  getters: {
    /**
     * Vérifie si l'utilisateur actuel est administrateur.
     *
     * @returns {Boolean} True si l'utilisateur est administrateur, sinon False.
     */
    is_admin: (state) => {
      return state.currentUser?.is_admin ?? false;
    },
  },
});
