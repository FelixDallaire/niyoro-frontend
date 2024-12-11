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
    /**
     * Charge tous les items (publics ou privés en fonction de l'authentification).
     *
     * @param {Boolean} isAuthenticated - Indique si l'utilisateur est authentifié.
     */
    async loadItems(isAuthenticated = false) {
      await this._handleRequest(
        () => fetchItems(isAuthenticated),
        (data) => {
          this.items = data;
        }
      );
    },

    /**
     * Charge les items appartenant à l'utilisateur actuel.
     */
    async loadMyItems() {
      await this._handleRequest(fetchMyItems, (data) => {
        this.myItems = data;
      });
    },

    /**
     * Charge les items créés par un utilisateur spécifique.
     *
     * @param {String} userId - L'ID de l'utilisateur.
     */
    async loadItemsByUser(userId) {
      await this._handleRequest(
        () => fetchItemsByUser(userId),
        (data) => {
          this.items = data;
        }
      );
    },

    /**
     * Charge un item par son ID.
     *
     * @param {String} itemId - L'ID de l'item.
     */
    async loadItemById(itemId) {
      await this._handleRequest(
        () => fetchItemById(itemId),
        (data) => {
          this.selectedItem = data;
        }
      );
    },

    /**
     * Charge un item à partir de son permalink.
     *
     * @param {String} permalink - Le permalink de l'item.
     */
    async loadItemByPermalink(permalink) {
      await this._handleRequest(
        () => fetchItemByPermalink(permalink),
        (data) => {
          this.selectedItem = data;
        }
      );
    },

    /**
     * Ajoute un nouvel item et met à jour la liste des items.
     *
     * @param {Object} itemData - Les données de l'item à ajouter.
     */
    async addItem(itemData) {
      await this._handleRequest(
        () => createItem(itemData),
        (data) => {
          this.items.push(data);
          this.myItems.push(data);
          this.selectedItem = data;
        }
      );
    },

    /**
     * Modifie un item existant.
     *
     * @param {String} itemId - L'ID de l'item à modifier.
     * @param {Object} updatedData - Les données mises à jour de l'item.
     */
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

    /**
     * Supprime un item et met à jour les listes.
     *
     * @param {String} itemId - L'ID de l'item à supprimer.
     */
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

    /**
     * Alterne l'état "sticky" (épinglé) d'un item.
     *
     * @param {String} itemId - L'ID de l'item à modifier.
     * @param {Boolean} currentStickyStatus - L'état actuel "sticky" de l'item.
     */
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

    /**
     * Gère les requêtes et les callbacks de succès ou d'échec.
     *
     * @param {Function} requestFn - La fonction de requête à exécuter.
     * @param {Function} successCallback - La fonction à exécuter en cas de succès.
     */
    async _handleRequest(requestFn, successCallback) {
      this.loading = true;
      this.error = null;
      try {
        const response = await requestFn();
        successCallback(response.data);
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          err.message ||
          "Une erreur s'est produite.";
      } finally {
        this.loading = false;
      }
    },

    /**
     * Met à jour une liste d'items avec les nouvelles données.
     *
     * @param {Array} list - La liste des items à mettre à jour.
     * @param {String} itemId - L'ID de l'item à mettre à jour.
     * @param {Object} updatedData - Les nouvelles données de l'item.
     */
    _updateItemList(list, itemId, updatedData) {
      const index = list.findIndex((item) => item._id === itemId);
      if (index !== -1) {
        list[index] = { ...list[index], ...updatedData };
      }
    },
  },

  getters: {
    /**
     * Récupère un item par son ID.
     */
    getItemById: (state) => (itemId) =>
      state.items.find((item) => item._id === itemId),

    /**
     * Récupère un item par son permalink.
     */
    getItemByPermalink: (state) => (permalink) =>
      state.items.find((item) => item.permalink === permalink),

    /**
     * Récupère les items publics.
     */
    publicItems: (state) => state.items.filter((item) => !item.private),

    /**
     * Récupère les items épinglés.
     */
    stickyItems: (state) => state.items.filter((item) => item.sticky),
  },
});
