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
    reactionCounts: (state) => {
      return state.reactions.reduce((counts, reaction) => {
        const type = reaction.type;
        counts[type] = (counts[type] || 0) + 1;
        return counts;
      }, {});
    },
    userReaction: (state) => (userId) => {
      return state.reactions.find(
        (reaction) => reaction.user_id._id === userId
      );
    },
  },
});
