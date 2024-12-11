import { defineStore } from "pinia";
import {
  createReaction,
  getReactionsByItem,
  deleteReaction,
} from "../services/reactionService";

export const useReactionStore = defineStore("reactionStore", {
  state: () => ({
    reactions: [],
    loading: false,
    error: null,
  }),
  actions: {
    /**
     * Charge toutes les réactions associées à un item spécifique.
     *
     * @param {String} itemId - L'ID de l'item pour lequel charger les réactions.
     */
    async loadReactionsByItem(itemId) {
      this.loading = true;
      try {
        const response = await getReactionsByItem(itemId);
        this.reactions = response.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Ajoute une nouvelle réaction à un item.
     *
     * @param {String} itemId - L'ID de l'item.
     * @param {String} type - Le type de la réaction (ex. "like", "love").
     */
    async addReaction(itemId, type) {
      this.loading = true;
      try {
        const response = await createReaction(itemId, { type });
        this.reactions.push(response.data);
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Supprime une réaction en fonction de son ID.
     *
     * @param {String} reactionId - L'ID de la réaction à supprimer.
     */
    async removeReaction(reactionId) {
      this.loading = true;
      try {
        await deleteReaction(reactionId);
        this.reactions = this.reactions.filter(
          (reaction) => reaction._id !== reactionId
        );
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },
  },
  getters: {
    /**
     * Retourne le nombre de réactions par type.
     *
     * @returns {Object} Un objet avec les types de réactions comme clés et leurs nombres comme valeurs.
     */
    reactionCounts: (state) => {
      return state.reactions.reduce((counts, reaction) => {
        const type = reaction.type;
        counts[type] = (counts[type] || 0) + 1;
        return counts;
      }, {});
    },

    /**
     * Récupère la réaction d'un utilisateur spécifique.
     *
     * @param {String} userId - L'ID de l'utilisateur.
     * @returns {Object|null} La réaction de l'utilisateur ou null si aucune réaction trouvée.
     */
    userReaction: (state) => (userId) => {
      return state.reactions.find(
        (reaction) => reaction.user_id._id === userId
      );
    },
  },
});
