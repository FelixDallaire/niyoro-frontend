import { defineStore } from "pinia";
import {
  fetchItems,
  fetchMyItems,
  fetchItemsByUser,
  fetchItemById,
  fetchItemByPermalink,
  createItem,
  updateItem,
  deleteItem,
} from "../services/itemService";

export const useItemStore = defineStore("itemStore", {
  state: () => ({
    items: [],
    myItems: [],
    selectedItem: null,
    loading: false,
    error: null,
  }),

  actions: {
    async loadItems(isAuthenticated = false) {
      await this._handleRequest(
        () => fetchItems(isAuthenticated),
        (data) => {
          this.items = data;
        }
      );
    },

    async loadMyItems() {
      await this._handleRequest(fetchMyItems, (data) => {
        this.myItems = data;
      });
    },

    async loadItemsByUser(userId) {
      await this._handleRequest(
        () => fetchItemsByUser(userId),
        (data) => {
          this.items = data;
        }
      );
    },

    async loadItemById(itemId) {
      await this._handleRequest(
        () => fetchItemById(itemId),
        (data) => {
          this.selectedItem = data;
        }
      );
    },

    async loadItemByPermalink(permalink) {
      await this._handleRequest(
        () => fetchItemByPermalink(permalink),
        (data) => {
          this.selectedItem = data;
        }
      );
    },

    async addItem(itemData) {
      await this._handleRequest(
        () => createItem(itemData),
        (data) => {
          this.items.push(data);
          this.myItems.push(data);
        }
      );
    },

    async editItem(itemId, updatedData) {
      await this._handleRequest(
        () => updateItem(itemId, updatedData),
        (data) => {
          this._updateItemList(this.items, itemId, data);
          this._updateItemList(this.myItems, itemId, data);
          if (this.selectedItem && this.selectedItem._id === itemId) {
            this.selectedItem = data;
          }
        }
      );
    },

    async removeItem(itemId) {
      await this._handleRequest(
        () => deleteItem(itemId),
        () => {
          this.items = this.items.filter((item) => item._id !== itemId);
          this.myItems = this.myItems.filter((item) => item._id !== itemId);
          if (this.selectedItem && this.selectedItem._id === itemId) {
            this.selectedItem = null;
          }
        }
      );
    },

    async togglePin(itemId, currentStickyStatus) {
      const updatedData = { sticky: !currentStickyStatus };
      await this._handleRequest(
        () => updateItem(itemId, updatedData),
        (data) => {
          this._updateItemList(this.items, itemId, data);
          this._updateItemList(this.myItems, itemId, data);
        }
      );
    },

    async _handleRequest(requestFn, successCallback) {
      this.loading = true;
      this.error = null;
      try {
        const response = await requestFn();
        successCallback(response.data);
      } catch (err) {
        this.error =
          err.response?.data?.message || err.message || "An error occurred";
      } finally {
        this.loading = false;
      }
    },

    _updateItemList(list, itemId, updatedData) {
      const index = list.findIndex((item) => item._id === itemId);
      if (index !== -1) {
        list[index] = { ...list[index], ...updatedData };
      }
    },
  },

  getters: {
    getItemById: (state) => (itemId) =>
      state.items.find((item) => item._id === itemId),
    getItemByPermalink: (state) => (permalink) =>
      state.items.find((item) => item.permalink === permalink),
    publicItems: (state) => state.items.filter((item) => !item.private),
    stickyItems: (state) => state.items.filter((item) => item.sticky),
  },
});
