<template>
    <div class="rounded p-4 shadow-sm mx-auto bg-white">
      <h2 class="mb-4">Se connecter</h2>
      <form @submit.prevent="handleSignin" class="needs-validation" novalidate>
        <div class="mb-3">
          <label for="email" class="form-label">Courriel</label>
          <input
            type="email"
            class="form-control input-soft-bg"
            :class="validationClass('email')"
            id="email"
            v-model="email"
            @input="validateField('email')"
            required
          />
          <div class="invalid-feedback">
            Le courriel est invalide.
          </div>
        </div>
  
        <div class="mb-3">
          <label for="password" class="form-label">Mot de passe</label>
          <input
            type="password"
            class="form-control input-soft-bg"
            :class="validationClass('password')"
            id="password"
            v-model="password"
            @input="validateField('password')"
            minlength="6"
            required
          />
          <div class="invalid-feedback">
            Le mot de passe doit contenir au moins 6 caractères.
          </div>
        </div>
  
        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>
  
        <button type="submit" class="btn btn-primary w-100">Se connecter</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useAuthStore } from '../stores/authStore';
  
  export default {
    name: 'LoginForm',
    setup() {
      const email = ref('');
      const password = ref('');
      const errorMessage = ref('');
      const attemptedSubmit = ref(false);
      const authStore = useAuthStore();
  
      const isValid = {
        email: ref(false),
        password: ref(false),
      };
  
      const handleSignin = async () => {
        attemptedSubmit.value = true;
        validateForm();
        if (!Object.values(isValid).every((field) => field.value)) {
          return;
        }
  
        const loginData = {
          email: email.value,
          password: password.value,
        };
  
        try {
          await authStore.loginUser(loginData);
          window.location.href = '/';
        } catch (error) {
          if (authStore.error) {
            errorMessage.value = authStore.error;
          } else {
            errorMessage.value = "Une erreur est survenue lors de la connexion.";
          }
        }
      };
  
      const validateForm = () => {
        validateField('email');
        validateField('password');
      };
  
      const validateField = (field) => {
        switch (field) {
          case 'email':
            isValid.email.value = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
            break;
          case 'password':
            isValid.password.value = password.value.length >= 6;
            break;
        }
      };
  
      const validationClass = (field) => {
        if (!attemptedSubmit.value) return '';
        return isValid[field].value ? 'is-valid' : 'is-invalid';
      };
  
      return {
        email,
        password,
        errorMessage,
        handleSignin,
        attemptedSubmit,
        isValid,
        validateField,
        validationClass,
      };
    },
  };
  </script>
  
  <style scoped>
  h2 {
    color: var(--primary-dark-blue) !important;
  }
  
  .btn-primary {
    background-color: var(--primary-light-blue) !important;
    border-color: var(--light-blue-muted) !important;
    color: var(--primary-dark-blue) !important;
  }
  
  .input-soft-bg {
    background-color: whitesmoke !important;
    border: none !important;
  }
  </style>
  