<template>
  <nav class="navbar navbar-expand-lg bg-light shadow-sm">
    <div class="container-fluid">
      <a class="navbar-brand d-flex align-items-center" href="/">
        <img src="../assets/logo.svg" alt="Logo" class="me-2" width="auto" height="25" />
      </a>

      <div class="collapse navbar-collapse justify-content-center">
        <ul class="navbar-nav mb-2 mb-lg-0">
        </ul>
      </div>

      <div class="d-flex align-items-center">
        <div v-if="isAuthenticated">
          <div class="dropdown">
            <button class="btn btn-link p-0 border-0 dropdown-toggle-no-arrow" type="button" id="avatarDropdown"
              data-bs-toggle="dropdown" aria-expanded="false">
              <div class="avatar-border">
                <img :src="userAvatar" alt="User Avatar" class="rounded-circle avatar img-thumbnail" />
              </div>
            </button>
            <ul class="dropdown-menu dropdown-menu-end border-0 shadow-sm" aria-labelledby="avatarDropdown">
              <li>
                <router-link class="dropdown-item" to="/profile">Profil</router-link>
              </li>
              <li v-if="isAdmin">
                <router-link class="dropdown-item" to="/tags">Tags</router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/add">Ajouter Item</router-link>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <button @click="logout" class="dropdown-item">Déconnexion</button>
              </li>
            </ul>
          </div>
        </div>
        <div v-else>
          <router-link to="/login" class="btn btn-primary">Se connecter</router-link>
          <router-link to="/signup" class="btn btn-outline-primary ms-2">Inscription</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '../stores/authStore';
import { computed, onMounted } from 'vue';

export default {
  name: 'NavBar',
  setup() {
    const authStore = useAuthStore();

    onMounted(() => {
      authStore.refreshStateFromLocalStorage();
    });

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const isAdmin = computed(() => authStore.isAdmin);
    const userAvatar = computed(() => authStore.user?.avatar);

    const logout = () => {
      authStore.logoutUser();
    };

    const isActive = (route) => {
      return window.location.pathname === route;
    };

    return {
      isAuthenticated,
      isAdmin,
      userAvatar,
      logout,
      isActive,
    };
  },
};
</script>

<style scoped>
.navbar {
  padding: 1rem;
  background-color: var(--primary-dark-blue) !important;
}

.dropdown-toggle-no-arrow::after {
  display: none !important;
}
</style>
