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
      console.log('[itemStore] Loading all items...');
      await this._handleRequest(fetchItems, (data) => {
        console.log('[itemStore] Items loaded:', data);
        this.items = data;
      });
    },

    async loadMyItems() {
      console.log('[itemStore] Loading user-specific items...');
      await this._handleRequest(fetchMyItems, (data) => {
        console.log('[itemStore] My items loaded:', data);
        this.myItems = data;
      });
    },

    async loadItemsByUser(userId) {
      console.log(`[itemStore] Loading items for user ID: ${userId}`);
      await this._handleRequest(() => fetchItemsByUser(userId), (data) => {
        console.log(`[itemStore] Items loaded for user ID ${userId}:`, data);
        this.items = data;
      });
    },

    async loadItem(itemId) {
      console.log(`[itemStore] Loading item with ID: ${itemId}`);
      await this._handleRequest(() => fetchItemById(itemId), (data) => {
        console.log(`[itemStore] Item loaded with ID ${itemId}:`, data);
        this.selectedItem = data;
      });
    },

    async addItem(itemData) {
      console.log('[itemStore] Adding new item:', itemData);
      await this._handleRequest(() => createItem(itemData), (data) => {
        console.log('[itemStore] Item added:', data);
        this.items.push(data);
        this.myItems.push(data);
      });
    },

    async editItem(itemId, updatedData) {
      console.log(`[itemStore] Editing item with ID: ${itemId}`, updatedData);
      await this._handleRequest(() => updateItem(itemId, updatedData), (data) => {
        console.log(`[itemStore] Item updated with ID ${itemId}:`, data);
        this._updateItemList(this.items, itemId, data);
        this._updateItemList(this.myItems, itemId, data);
        if (this.selectedItem && this.selectedItem._id === itemId) {
          this.selectedItem = data;
        }
      });
    },

    async removeItem(itemId) {
      console.log(`[itemStore] Removing item with ID: ${itemId}`);
      await this._handleRequest(() => deleteItem(itemId), () => {
        console.log(`[itemStore] Item removed with ID ${itemId}`);
        this.items = this.items.filter((item) => item._id !== itemId);
        this.myItems = this.myItems.filter((item) => item._id !== itemId);
        if (this.selectedItem && this.selectedItem._id === itemId) {
          this.selectedItem = null;
        }
      });
    },

    async togglePin(itemId, currentStickyStatus) {
      debugger
      console.log(`[itemStore] Toggling pin for item ID: ${itemId}. Current sticky status: ${currentStickyStatus}`);
      const updatedData = { sticky: !currentStickyStatus };
      await this._handleRequest(() => updateItem(itemId, updatedData), (data) => {
        debugger
        console.log(`[itemStore] Pin toggled for item ID ${itemId}:`, data);
        this._updateItemList(this.items, itemId, data);
        this._updateItemList(this.myItems, itemId, data);
      });
    },

    async _handleRequest(requestFn, successCallback) {
      this.loading = true;
      this.error = null;
      try {
        const response = await requestFn();
        console.log('[itemStore] Request succeeded:', response.data);
        successCallback(response.data);
      } catch (err) {
        console.error('[itemStore] Request failed:', err);
        this.error = err.response?.data?.message || err.message || 'An error occurred';
      } finally {
        this.loading = false;
        console.log('[itemStore] Request completed.');
      }
    },

    _updateItemList(list, itemId, updatedData) {
      console.log(`[itemStore] Updating item list for item ID: ${itemId}`);
      const index = list.findIndex((item) => item._id === itemId);
      if (index !== -1) {
        console.log(`[itemStore] Found item in list. Updating:`, list[index]);
        list[index] = { ...list[index], ...updatedData };
      } else {
        console.log(`[itemStore] Item ID ${itemId} not found in list.`);
      }
    },
  },

  getters: {
    getItemById: (state) => (itemId) => state.items.find((item) => item._id === itemId),
    publicItems: (state) => state.items.filter((item) => !item.private),
    stickyItems: (state) => state.items.filter((item) => item.sticky),
  },
});
