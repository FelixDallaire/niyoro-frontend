<template>
  <div class="tags-view container mt-4">
    <h2 class="mb-4">Gestion des Tags</h2>
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    <div v-else>
      <ul class="list-group">
        <TagListItem
          v-for="tag in tags"
          :key="tag._id"
          :tag="tag"
          :onEdit="editTag"
          :onDelete="deleteTag"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import { useTagStore } from "@/stores/tagStore";
import TagListItem from "@/components/TagListItem.vue";

export default {
  name: "TagsView",
  components: {
    TagListItem,
  },
  setup() {
    const tagStore = useTagStore();
    const loading = ref(false);
    const error = ref(null);

    /**
     * Loads all tags from the store.
     */
    const loadTags = async () => {
      try {
        startLoading();
        await tagStore.loadAllTags();
      } catch (err) {
        handleError("Impossible de charger les tags.", err);
      } finally {
        stopLoading();
      }
    };

    /**
     * Edits a tag in the store.
     * 
     * @param {String} tagId - The ID of the tag to edit.
     * @param {Object} tagData - The updated data for the tag.
     */
    const editTag = async (tagId, tagData) => {
      try {
        await tagStore.editTag(tagId, tagData);
      } catch (err) {
        handleError("Impossible de sauvegarder le tag.", err);
      }
    };

    /**
     * Deletes a tag from the store after user confirmation.
     * 
     * @param {String} tagId - The ID of the tag to delete.
     */
    const deleteTag = async (tagId) => {
      if (confirm("Êtes-vous sûr de vouloir supprimer ce tag ?")) {
        try {
          await tagStore.removeTag(tagId);
        } catch (err) {
          handleError("Impossible de supprimer le tag.", err);
        }
      }
    };

    /**
     * Starts the loading state.
     */
    const startLoading = () => {
      loading.value = true;
      error.value = null;
    };

    /**
     * Stops the loading state.
     */
    const stopLoading = () => {
      loading.value = false;
    };

    /**
     * Handles errors by updating the error message and logging the error.
     * 
     * @param {String} message - The error message to display.
     * @param {Error} err - The error object to log.
     */
    const handleError = (message, err) => {
      error.value = message;
      console.error(err);
    };

    const tags = computed(() => tagStore.tags);

    onMounted(loadTags);

    return {
      tags,
      loading,
      error,
      editTag,
      deleteTag,
    };
  },
};
</script>

<style scoped>
.tags-view {
  max-width: 800px;
  margin: auto;
}
</style>
