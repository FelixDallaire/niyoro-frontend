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
import { onMounted, computed, ref, watch } from "vue";
import { useItemStore } from "@/stores/itemStore";
import { useUserStore } from "@/stores/userStore";
import { useTagStore } from "@/stores/tagStore";
import { useRouter } from "vue-router";
import ItemCard from "@/components/ItemCard.vue";

export default {
  name: "HomeView",
  components: {
    ItemCard,
  },
  props: {
    initialTag: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const router = useRouter();
    const itemStore = useItemStore();
    const userStore = useUserStore();
    const tagStore = useTagStore();
    const showMyItems = ref(false);
    const selectedTag = ref(null);
    const tagError = ref(false);

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
        const tagId = getTagId(selectedTag.value);
        if (tagId) {
          filtered = filtered.filter((item) => item.tags.includes(tagId));
        }
      }

      return filtered.sort((a, b) => {
        if (a.sticky !== b.sticky) {
          return b.sticky - a.sticky;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    });

    const selectTag = (tagId) => {
      const tagName = getTagName(tagId);
      selectedTag.value = tagName;
      router.push({ name: "Home", params: { tag: tagName } });
    };

    const clearTagFilter = () => {
      selectedTag.value = null;
      tagError.value = false;
      router.push({ name: "Home" });
    };

    const getTagName = (tagIdOrName) => {
      const tag = tagStore.tags.find(
        (tag) => tag._id === tagIdOrName || tag.name === tagIdOrName
      );
      return tag ? tag.name : "Tag inconnu";
    };

    const getTagId = (tagName) => {
      const tag = tagStore.tags.find((tag) => tag.name === tagName);
      return tag ? tag._id : null;
    };

    const loadTags = async () => {
      try {
        const latestTags = await tagStore.loadAllTags();
        tagStore.tags = [...new Set([...tagStore.tags, ...latestTags])];
        validateInitialTag(); 
      } catch (error) {
        console.error("Error loading tags:", error);
      }
    };

    const validateInitialTag = () => {
      if (props.initialTag && !getTagId(props.initialTag)) {
        tagError.value = true;
        router.push({ name: "Home" });
      } else {
        selectedTag.value = props.initialTag;
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

    watch(
      () => props.initialTag,
      (newTag) => {
        if (newTag && !getTagId(newTag)) {
          tagError.value = true;
          router.push({ name: "Home" });
        } else {
          tagError.value = false;
          selectedTag.value = newTag;
        }
      }
    );

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
      getTagId,
      tagError,
    };
  },
};
</script>

<style scoped></style>
