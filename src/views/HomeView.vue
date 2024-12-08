<template>
  <div class="container mt-4">
    <!-- Loading Spinner -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error Message -->
    <div v-else-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>

    <!-- Item List -->
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
import ItemCard from "@/components/ItemCard.vue";

export default {
  name: "HomeView",
  components: {
    ItemCard,
  },
  setup() {
    const itemStore = useItemStore();
    const userStore = useUserStore();
    const showMyItems = ref(false);

    const currentUser = computed(() => userStore.currentUser);
    const items = computed(() => itemStore.items);
    const loading = computed(() => itemStore.loading);
    const error = computed(() => itemStore.error);

    const filteredItems = computed(() => {
      return showMyItems.value
        ? itemStore.myItems
        : itemStore.items.filter((item) => !item.private || item.owner === currentUser.value?.userId);
    });

    onMounted(() => {
      if (!items.value.length) {
        itemStore.loadItems();
      }
      if (userStore.currentUser) {
        itemStore.loadMyItems();
      }
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

<style scoped>
.container {
  max-width: 1200px;
}
</style>
