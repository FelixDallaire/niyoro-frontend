<template>
  <div class="container mt-4">
    <h1>Item Details</h1>
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    <div v-else-if="item">
      <div class="row g-4">
        <div class="col-md-6">
          <ItemCard :item="item" :currentUser="currentUser" :showDetailsButton="false" />
        </div>
        <div class="col-md-6">
          <ItemReaction :itemId="item._id" />
        </div>
      </div>

      <div v-if="item.latitude && item.longitude" class="row g-4 mt-4">
        <div class="col-12">
          <LeafletMap :latitude="item.latitude" :longitude="item.longitude" />
        </div>
      </div>
    </div>
    <div v-else>
      <em>Loading item data...</em>
    </div>
  </div>
</template>

<script>
import { useItemStore } from "@/stores/itemStore";
import { useUserStore } from "@/stores/userStore";
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import ItemCard from "@/components/ItemCard.vue";
import LeafletMap from "@/components/LeafletMap.vue";
import ItemReaction from "@/components/ItemReaction.vue";

export default {
  name: "ItemDetailView",
  components: {
    ItemCard,
    LeafletMap,
    ItemReaction,
  },
  setup() {
    const route = useRoute();
    const itemStore = useItemStore();
    const userStore = useUserStore();
    const permalink = route.params.permalink;

    const item = computed(() => itemStore.selectedItem);
    const currentUser = computed(() => userStore.currentUser);
    const loading = computed(() => itemStore.loading);
    const error = computed(() => itemStore.error);

    onMounted(async () => {
      try {
        await itemStore.loadItemByPermalink(permalink);
      } catch (err) {
        console.error("Failed to load item details:", err);
      }
    });

    return {
      item,
      loading,
      error,
      currentUser,
    };
  },
};
</script>


<style scoped>
</style>
