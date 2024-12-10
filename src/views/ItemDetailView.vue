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
      <div v-else>
        <p><strong>Name:</strong> {{ item?.title }}</p>
        <p><strong>ID:</strong> {{ item?._id }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { useItemStore } from "@/stores/itemStore";
  import { onMounted, computed } from "vue";
  import { useRoute } from "vue-router";
  
  export default {
    name: "ItemDetailView",
    setup() {
      const route = useRoute();
      const itemStore = useItemStore();
      const permalink = route.params.permalink;
  
      const item = computed(() => itemStore.selectedItem);
      const loading = computed(() => itemStore.loading);
      const error = computed(() => itemStore.error);
  
      onMounted(async () => {
        await itemStore.loadItemByPermalink(permalink);
      });
  
      return {
        item,
        loading,
        error,
      };
    },
  };
  </script>
  
  <style scoped>
  .container {
    padding: 1rem;
  }
  
  h1 {
    margin-bottom: 1rem;
  }
  </style>
  