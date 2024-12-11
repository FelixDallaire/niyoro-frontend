<template>
  <div class="container mt-4">
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>

    <div v-else>
      <div class="form-check mb-3 d-flex justify-content-end">
        <input type="checkbox" class="form-check-input me-1" id="showMyItems" v-model="showMyItems" />
        <label class="form-check-label" for="showMyItems">Afficher mes items</label>
      </div>

      <div v-if="selectedTag" class="d-flex align-items-center justify-content-start mb-3">
        <span class="badge bg-theme-dark text-white me-3 d-flex align-items-center px-3 py-2 fs-7">
          <span class="me-2">{{ getTagName(selectedTag) }}</span>
          <button type="button" class="btn btn-close btn-close-white p-0 m-0" @click="clearTagFilter"
            title="Effacer le filtre" aria-label="Effacer le filtre"></button>
        </span>
      </div>

      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-3">
        <div v-for="item in filteredItems" :key="item._id" class="col">
          <ItemCard :item="item" :showDetailsButton="!!currentUser" :currentUser="currentUser || {}"
            @tagSelected="selectTag" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, computed, ref } from "vue";
import { useItemStore } from "@/stores/itemStore";
import { useUserStore } from "@/stores/userStore";
import { useTagStore } from "@/stores/tagStore";
import ItemCard from "@/components/ItemCard.vue";

export default {
  name: "HomeView",
  components: {
    ItemCard,
  },
  setup() {
    const itemStore = useItemStore();
    const userStore = useUserStore();
    const tagStore = useTagStore();
    const showMyItems = ref(false);
    const selectedTag = ref(null);

    const currentUser = computed(() => userStore.currentUser);
    const items = computed(() => itemStore.items);
    const loading = computed(() => itemStore.loading || tagStore.loading);
    const error = computed(() => itemStore.error || tagStore.error);

    const filteredItems = computed(() => {
      let filtered = showMyItems.value
        ? itemStore.myItems
        : itemStore.items.filter(
          (item) =>
            !item.private ||
            item.created_by?._id === currentUser.value?.userId
        );

      if (selectedTag.value) {
        filtered = filtered.filter((item) => item.tags.includes(selectedTag.value));
      }

      return filtered.sort((a, b) => {
        if (a.sticky !== b.sticky) {
          return b.sticky - a.sticky;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    });

    const selectTag = (tagId) => {
      selectedTag.value = tagId;
    };

    const clearTagFilter = () => {
      selectedTag.value = null;
    };

    const getTagName = (tagId) => {
      const tag = tagStore.getTagById(tagId);
      return tag ? tag.name : "Tag inconnu";
    };

    const loadTags = async () => {
      try {
        const latestTags = await tagStore.loadAllTags();
        tagStore.tags = [...new Set([...tagStore.tags, ...latestTags])];
      } catch (error) {
        console.error("Error loading tags:", error);
      }
    };

    onMounted(async () => {
      if (!items.value.length) {
        await itemStore.loadItems();
      }
      if (userStore.currentUser) {
        await itemStore.loadMyItems();
      }
      await loadTags();
    });

    return {
      items,
      loading,
      error,
      showMyItems,
      filteredItems,
      currentUser,
      selectedTag,
      selectTag,
      clearTagFilter,
      getTagName,
    };
  },
};
</script>

<style scoped></style>
