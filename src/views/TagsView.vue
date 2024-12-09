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
  
      const loadTags = async () => {
        loading.value = true;
        error.value = null;
        try {
          await tagStore.loadAllTags();
        } catch (err) {
          error.value = "Impossible de charger les tags.";
          console.error(err);
        } finally {
          loading.value = false;
        }
      };
  
      const tags = computed(() => tagStore.tags);
  
      const editTag = async (tagId, tagData) => {
        try {
          await tagStore.editTag(tagId, tagData);
        } catch (err) {
          error.value = "Impossible de sauvegarder le tag.";
          console.error(err);
        }
      };
  
      const deleteTag = async (tagId) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce tag ?")) {
          try {
            await tagStore.removeTag(tagId);
          } catch (err) {
            error.value = "Impossible de supprimer le tag.";
            console.error(err);
          }
        }
      };
  
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
  