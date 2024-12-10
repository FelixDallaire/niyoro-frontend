import { defineStore } from "pinia";
import {
  createReaction,
  getReactionsByItem,
  deleteReaction,
} from "../services/reactionService";

export const useReactionStore = defineStore("reactionStore", {
  state: () => ({
    reactions: [], // All reactions for an item
    loading: false, // Loading state
    error: null, // Error messages
  }),
  actions: {
    /**
     * Loads reactions for a specific item.
     * @param {string} itemId - The item's ID.
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
     * Adds a reaction to an item.
     * @param {string} itemId - The item's ID.
     * @param {number|string} type - The reaction type (1, 2, 3, or 4).
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
     * Removes a reaction by its ID.
     * @param {string} reactionId - The reaction's ID.
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
     * Returns the count of reactions by type.
     */
    reactionCounts: (state) => {
      return state.reactions.reduce((counts, reaction) => {
        const type = reaction.type;
        counts[type] = (counts[type] || 0) + 1;
        return counts;
      }, {});
    },
    /**
     * Returns the logged-in user's reaction, if any.
     * @param {string} userId - The user's ID.
     */
    userReaction: (state) => (userId) => {
      return state.reactions.find(
        (reaction) => reaction.user_id._id === userId
      );
    },
  },
});
