<template>
  <div class="col">
    <div class="card shadow-sm h-100 d-flex flex-column">
      <div class="card-body flex-grow-1 d-flex flex-column">
        <h5 class="card-title">
          <a :href="item.url" target="_blank" rel="noopener noreferrer" class="text-decoration-none link-primary">
            {{ item.title }}
          </a>
        </h5>
        <p class="card-text flex-grow-1" v-if="item.content">{{ item.content }}</p>
        <div v-if="item.tags.length > 0" class="mb-3">
          <span class="badge bg-info me-1" v-for="tag in item.tags" :key="tag">
            <router-link :to="`/tags/${tag}`" class="text-light text-decoration-none">{{ tag }}</router-link>
          </span>
        </div>
      </div>
      <div class="card-footer d-flex justify-content-between align-items-center mt-auto">
        <div class="d-flex align-items-center">
          <span class="text-muted me-3">
            Créé le {{ formattedDate }}
          </span>
          <button v-if="isOwner" @click="toggleSticky" class="btn btn-link p-0 me-3">
            <i :class="stickyIconClass"></i>
          </button>
          <router-link v-if="isOwner" :to="`/edit/${item._id}`" class="btn btn-sm btn-outline-primary me-2">
            Modifier <i class="bi-pencil-fill"></i>
          </router-link>
          <button v-if="isOwner" @click="removeItem" class="btn btn-sm btn-outline-danger">
            Supprimer <i class="bi-trash-fill"></i>
          </button>
        </div>
        <div>
          <span :class="privacyIconClass" title="Privacy status"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useItemStore } from '../stores/itemStore';
import { useAuthStore } from '../stores/authStore';

export default {
  name: 'ItemCard',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const itemStore = useItemStore();
    const authStore = useAuthStore();

    const isOwner = computed(() => authStore.user?.userId === props.item.userId);

    const formattedDate = computed(() => {
      const date = new Date(props.item.createdAt);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    });

    const stickyIconClass = computed(() => 
      props.item.sticky ? 'bi-pin-fill text-warning' : 'bi-pin text-secondary'
    );

    const privacyIconClass = computed(() =>
      props.item.private ? 'bi-lock-fill text-danger' : 'bi-globe text-success'
    );

    const toggleSticky = async () => {
      const updatedData = { ...props.item, sticky: !props.item.sticky };
      await itemStore.editItem(props.item._id, updatedData);
    };

    const removeItem = async () => {
      if (confirm("Voulez-vous vraiment supprimer cet item ?")) {
        await itemStore.removeItem(props.item._id);
      }
    };

    return {
      isOwner,
      formattedDate,
      stickyIconClass,
      privacyIconClass,
      toggleSticky,
      removeItem,
    };
  },
};
</script>

<style scoped>
</style>
