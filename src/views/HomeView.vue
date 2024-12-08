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
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="item in filteredItems" :key="item._id" class="col">
          <ItemCard :item="item" :current-user="currentUser" />
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

    const currentUser = computed(() => userStore.currentUser);
    const items = computed(() => itemStore.items);
    const loading = computed(() => itemStore.loading || tagStore.loading);
    const error = computed(() => itemStore.error || tagStore.error);

    const filteredItems = computed(() => {
      let filtered = showMyItems.value
        ? itemStore.myItems
        : itemStore.items.filter((item) => !item.private || item.owner === currentUser.value?.userId);

      return filtered.sort((a, b) => {
        if (a.sticky !== b.sticky) {
          return b.sticky - a.sticky;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    });

    const loadTags = async () => {
      if (!tagStore.tags.length) {
        await tagStore.loadAllTags();
      } else {
        const latestTags = await tagStore.loadAllTags();
        tagStore.tags = [...new Set([...tagStore.tags, ...latestTags])];
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
    };
  },
};
</script>


<style scoped></style>
