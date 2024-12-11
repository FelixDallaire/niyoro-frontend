import { defineStore } from "pinia";
import {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
} from "../services/tagService";

export const useTagStore = defineStore("tagStore", {
  state: () => ({
    tags: [],
    tagsById: {},
    selectedTag: null,
    loading: false,
    error: null,
  }),
  actions: {
    async loadAllTags() {
      this.loading = true;
      try {
        const response = await getAllTags();
        this.tags = response.data;
    
        this.tagsById = {};
        this.tags.forEach((tag) => {
          this.tagsById[tag._id] = tag;
        });
    
        return this.tags; 
      } catch (err) {
        this.error = err.message;
        return [];
      } finally {
        this.loading = false;
      }
    },
    
    async loadTagById(tagId) {
      this.loading = true;
      try {
        const response = await getTagById(tagId);
        this.selectedTag = response.data;

        this.tagsById[tagId] = response.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async addTag(tagData) {
      this.loading = true;
      try {
        const response = await createTag(tagData);
        this.tags.push(response.data);
        this.tagsById[response.data._id] = response.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async editTag(tagId, tagData) {
      this.loading = true;
      try {
        const response = await updateTag(tagId, tagData);
        const index = this.tags.findIndex((tag) => tag._id === tagId);
        if (index !== -1) {
          this.tags[index] = response.data;
        }
        if (this.selectedTag && this.selectedTag._id === tagId) {
          this.selectedTag = response.data;
        }
        this.tagsById[tagId] = response.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async removeTag(tagId) {
      this.loading = true;
      try {
        await deleteTag(tagId);
        this.tags = this.tags.filter((tag) => tag._id !== tagId);
        delete this.tagsById[tagId];
        if (this.selectedTag && this.selectedTag._id === tagId) {
          this.selectedTag = null;
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
  getters: {
    getTagById: (state) => (tagId) => {
      return state.tagsById[tagId] || null;
    },
  },
});
