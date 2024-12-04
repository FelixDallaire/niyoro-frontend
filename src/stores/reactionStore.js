import { defineStore } from 'pinia';
import {
  createReaction,
  getReactionsByItem,
  deleteReaction,
} from '../services/reactionService';

export const useReactionStore = defineStore('reactionStore', {
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
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async addReaction(itemId, reactionData) {
      this.loading = true;
      try {
        const response = await createReaction(itemId, reactionData);
        this.reactions.push(response.data);
      } catch (err) {
        this.error = err.message;
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
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
  getters: {
    getReactionsByType: (state) => (type) => {
      return state.reactions.filter((reaction) => reaction.type === type);
    },
  },
});
