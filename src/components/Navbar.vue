<template>
  <nav class="navbar navbar-expand-lg bg-light shadow-sm">
    <div class="container-fluid">
      
      <a class="navbar-brand d-flex align-items-center" href="/">
        <img src="../assets/logo.svg" alt="Logo" class="me-2" width="auto" height="25" />
      </a>

      <div class="collapse navbar-collapse justify-content-center">
        <ul class="navbar-nav mb-2 mb-lg-0">
          <li class="nav-item" v-if="isAuthenticated">
            <router-link class="nav-link" :class="{ active: isActive('/add') }" to="/add">Add Item</router-link>
          </li>
          
          <li class="nav-item" v-if="isAdmin">
            <router-link class="nav-link" :class="{ active: isActive('/tags') }" to="/tags">Tags</router-link>
          </li>
        </ul>
      </div>

      <div class="d-flex align-items-center">
        <div v-if="isAuthenticated">
          <router-link to="/profile" class="me-2">
            <img :src="userAvatar" alt="User Avatar" class="rounded-circle" width="40" height="40" />
          </router-link>
          <button @click="logout" class="btn btn-sm btn-danger">Logout</button>
        </div>
        <div v-else>
          <router-link to="/login" class="btn btn-primary">Connexion</router-link>
          <router-link to="/signup" class="btn btn-outline-primary ms-2">Inscription</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '../stores/authStore';

export default {
  name: 'NavBar',
  setup() {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;
    const isAdmin = authStore.isAdmin;
    const userAvatar = authStore.avatar;

    const logout = () => {
      authStore.logout();
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

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 0.5rem;
}
</style>
