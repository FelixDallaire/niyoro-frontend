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
    is_admin: (state) => {
      return state.currentUser?.is_admin ?? false;
    },
  },
});
