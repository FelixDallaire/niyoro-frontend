import { defineStore } from 'pinia';
import {
  fetchItems,
  fetchMyItems,
  fetchItemsByUser,
  fetchItemById,
  createItem,
  updateItem,
  deleteItem,
} from '../services/itemService';

export const useItemStore = defineStore('itemStore', {
  state: () => ({
    items: [],
    myItems: [],
    selectedItem: null,
    loading: false,
    error: null,
  }),
  actions: {
    async loadItems() {
      this.loading = true;
      try {
        const response = await fetchItems();
        this.items = response.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async loadMyItems() {
      this.loading = true;
      try {
        const response = await fetchMyItems();
        this.myItems = response.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async loadItemsByUser(userId) {
      this.loading = true;
      try {
        const response = await fetchItemsByUser(userId);
        this.items = response.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async loadItem(itemId) {
      this.loading = true;
      try {
        const response = await fetchItemById(itemId);
        this.selectedItem = response.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async addItem(itemData) {
      this.loading = true;
      try {
        const response = await createItem(itemData);
        this.items.push(response.data);
        this.myItems.push(response.data);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async editItem(itemId, updatedData) {
      this.loading = true;
      try {
        const response = await updateItem(itemId, updatedData);
        const index = this.items.findIndex((item) => item._id === itemId);
        if (index !== -1) {
          this.items[index] = response.data;
        }
        if (this.selectedItem && this.selectedItem._id === itemId) {
          this.selectedItem = response.data;
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async removeItem(itemId) {
      this.loading = true;
      try {
        await deleteItem(itemId);
        this.items = this.items.filter((item) => item._id !== itemId);
        this.myItems = this.myItems.filter((item) => item._id !== itemId);
        if (this.selectedItem && this.selectedItem._id === itemId) {
          this.selectedItem = null;
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
  getters: {
    getItemById: (state) => (itemId) => {
      return state.items.find((item) => item._id === itemId);
    },
    publicItems: (state) => {
      return state.items.filter((item) => !item.private);
    },
    stickyItems: (state) => {
      return state.items.filter((item) => item.sticky);
    },
  },
});
