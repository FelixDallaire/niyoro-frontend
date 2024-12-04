<template>
    <nav class="navbar">
      <div class="container">
        <router-link to="/" class="navbar-brand">Niyɔrɔ</router-link>
        <ul class="nav-links">
          <li>
            <router-link to="/">Home</router-link>
          </li>
          <li v-if="isAuthenticated">
            <router-link :to="`/profile/${user?.userId}`">Profile</router-link>
          </li>
          <li v-if="isAdmin">
            <router-link to="/admin/users">Admin Panel</router-link>
          </li>
        </ul>
        <div class="auth-actions">
          <button v-if="!isAuthenticated" @click="goToLogin">Login</button>
          <button v-if="isAuthenticated" @click="logout">Logout</button>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  import { useAuthStore } from '../stores/authStore';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const authStore = useAuthStore();
      const router = useRouter();
  
      const { isAuthenticated, isAdmin, user, logoutUser } = authStore;
  
      const logout = () => {
        logoutUser();
        router.push('/login');
      };
  
      const goToLogin = () => {
        router.push('/login');
      };
  
      return {
        isAuthenticated,
        isAdmin,
        user,
        logout,
        goToLogin,
      };
    },
  };
  </script>
  
  <style scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #333;
    padding: 1rem;
    color: #fff;
  }
  
  .container {
    display: flex;
    align-items: center;
    width: 100%;
  }
  
  .navbar-brand {
    color: #fff;
    text-decoration: none;
    font-size: 1.5rem;
    margin-right: 2rem;
  }
  
  .nav-links {
    list-style: none;
    display: flex;
    gap: 1rem;
  }
  
  .nav-links a {
    color: #fff;
    text-decoration: none;
  }
  
  .auth-actions {
    margin-left: auto;
  }
  
  button {
    background-color: #555;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #777;
  }
  </style>
  