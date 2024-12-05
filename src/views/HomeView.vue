<template>
  <div class="container mt-4">
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="isUnauthorized" class="d-flex justify-content-center align-items-center">
      <div class="card unauthorized-card shadow-sm">
        <div class="card-body text-center">
          <h4 class="card-title mb-3">Accès Restreint</h4>
          <p class="card-text">Veuillez vous connecter pour accéder à cette section.</p>
          <div class="d-flex justify-content-center align-items-center gap-2 mt-3">
            <router-link to="/login" class="btn btn-primary">Se connecter</router-link>
            <span class="or-separator">ou</span>
            <router-link to="/signup" class="btn btn-outline-primary">Inscription</router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>

    <div v-else>
      <div v-if="showFilterSection" class="d-flex justify-content-between align-items-center mb-3">
        <h1>Items</h1>
        <div>
          <label for="showMyItems" class="form-check-label me-2">Afficher mes items uniquement</label>
          <input type="checkbox" id="showMyItems" v-model="showMyItems" class="form-check-input" @change="handleCheckboxToggle" />
        </div>
      </div>

      <div v-else>
        <h1>Items</h1>
      </div>

      <div v-if="isItemsListEmpty" class="alert alert-info text-center">
        Aucun item à afficher.
      </div>

      <div class="row">
        <ItemCard v-for="item in filteredItems" :key="item._id" :item="item" class="col-md-4 mb-4" />
      </div>
    </div>
  </div>
</template>

<script>
import { useItemStore } from '../stores/itemStore';
import { useAuthStore } from '../stores/authStore';
import { onMounted, ref, computed, watch } from 'vue';
import ItemCard from '../components/ItemCard.vue';

export default {
  name: 'HomeView',
  components: {
    ItemCard,
  },
  setup() {
    const itemStore = useItemStore();
    const authStore = useAuthStore();
    const showMyItems = ref(false);

    onMounted(() => {
      itemStore.loadItems();
    });

    const items = computed(() => itemStore.items);
    const loading = computed(() => itemStore.loading);
    const error = computed(() => itemStore.error);
    const isAuthenticated = computed(() => authStore.isAuthenticated);

    const showFilterSection = computed(() => isAuthenticated.value);

    const isItemsListEmpty = computed(() => filteredItems.value.length === 0);

    const isUnauthorized = computed(() => error.value && error.value.includes('401'));

    const filteredItems = computed(() => {
      if (!isAuthenticated.value) {
        return items.value.filter(item => !item.private);
      }

      if (showMyItems.value) {
        return itemStore.myItems;
      }
      return items.value;
    });

    watch(isAuthenticated, (newValue) => {
      if (!newValue) {
        itemStore.loadItems();
        showMyItems.value = false;
      }
    });

    const handleCheckboxToggle = () => {
      if (isAuthenticated.value) {
        if (showMyItems.value) {
          itemStore.loadMyItems();
        } else {
          itemStore.loadItems();
        }
      }
    };

    return {
      items,
      loading,
      error,
      showMyItems,
      filteredItems,
      handleCheckboxToggle,
      isAuthenticated,
      showFilterSection,
      isItemsListEmpty,
      isUnauthorized,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
.spinner-border {
  width: 3rem;
  height: 3rem;
}

.unauthorized-card {
  background-color: var(--soft-white-light);
  border: 1px solid var(--grey-medium);
  max-width: 500px;
  padding: 20px;
  border-radius: 12px;
}

.unauthorized-card .card-title {
  color: var(--primary-dark-blue);
}

.unauthorized-card .card-text {
  color: var(--grey-dark);
}

.unauthorized-card .btn-primary {
  background-color: var(--primary-light-blue);
  border-color: var(--light-blue-muted);
  color: var(--primary-dark-blue);
}

.unauthorized-card .btn-outline-primary {
  border-color: var(--primary-light-blue);
  color: var(--primary-light-blue);
}

.unauthorized-card .btn-outline-primary:hover,
.unauthorized-card .btn-outline-primary:focus {
  background-color: var(--primary-light-blue);
  color: var(--soft-white-light);
}

.or-separator {
  color: var(--primary-dark-blue);
  font-weight: bold;
}
</style>
