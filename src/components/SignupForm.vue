<template>
  <div class="rounded p-4 shadow-sm mx-auto bg-white">
    <h2 class="mb-4">Créer un compte</h2>
    <form @submit.prevent="handleSignup" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-4 mb-3">
          <label for="username" class="form-label">Pseudo</label>
          <input type="text" class="form-control input-soft-bg" :class="validationClass('username')" id="username"
            v-model="username" @input="validateField('username')" required />
          <div class="invalid-feedback">
            Le pseudo est requis et doit contenir entre 1 et 50 caractères.
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <label for="firstName" class="form-label">Prénom</label>
          <input type="text" class="form-control input-soft-bg" :class="validationClass('firstName')" id="firstName"
            v-model="firstName" @input="validateField('firstName')" required />
          <div class="invalid-feedback">
            Le prénom est requis et doit contenir entre 1 et 50 caractères.
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <label for="lastName" class="form-label">Nom</label>
          <input type="text" class="form-control input-soft-bg" :class="validationClass('lastName')" id="lastName"
            v-model="lastName" @input="validateField('lastName')" required />
          <div class="invalid-feedback">
            Le nom est requis et doit contenir entre 1 et 50 caractères.
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Courriel</label>
        <input type="email" class="form-control input-soft-bg" :class="validationClass('email')" id="email"
          v-model="email" @input="validateField('email')" required />
        <div class="invalid-feedback">
          Le courriel est invalide.
        </div>
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Mot de passe</label>
        <input type="password" class="form-control input-soft-bg" :class="validationClass('password')" id="password"
          v-model="password" @input="validateField('password')" minlength="6" required />
        <div class="invalid-feedback">
          Le mot de passe doit contenir au moins 6 caractères.
        </div>
      </div>

      <div class="mb-3">
        <label for="confirmPassword" class="form-label">Confirmer le mot de passe</label>
        <input type="password" class="form-control input-soft-bg" :class="validationClass('confirmPassword')"
          id="confirmPassword" v-model="confirmPassword" @input="validateField('confirmPassword')" required />
        <div class="invalid-feedback">
          Les mots de passe ne correspondent pas.
        </div>
      </div>

      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <button type="submit" class="btn btn-primary w-100">S'inscrire</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { signup } from '../services/authService';

export default {
  name: 'SignupForm',
  setup() {
    const username = ref('');
    const firstName = ref('');
    const lastName = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const errorMessage = ref('');
    const attemptedSubmit = ref(false);

    const isValid = {
      username: ref(false),
      firstName: ref(false),
      lastName: ref(false),
      email: ref(false),
      password: ref(false),
      confirmPassword: ref(false),
    };

    /**
     * Gère la soumission du formulaire d'inscription après validation.
     */
    const handleSignup = async () => {
      attemptedSubmit.value = true;
      validateForm();

      if (!Object.values(isValid).every((field) => field.value)) {
        return;
      }

      const userData = {
        username: username.value,
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value,
        password: password.value,
      };

      try {
        await signup(userData);
        window.location.href = '/login';
      } catch (error) {
        if (error.response?.data?.message) {
          errorMessage.value = error.response.data.message;
        } else {
          errorMessage.value = "Une erreur est survenue lors de l'inscription.";
        }
      }
    };

    /**
     * Valide l'ensemble des champs du formulaire.
     */
    const validateForm = () => {
      validateField('username');
      validateField('firstName');
      validateField('lastName');
      validateField('email');
      validateField('password');
      validateField('confirmPassword');
    };

    /**
     * Valide un champ spécifique selon ses règles.
     *
     * @param {String} field - Le nom du champ à valider.
     */
    const validateField = (field) => {
      switch (field) {
        case 'username':
          isValid.username.value = username.value.trim().length >= 1 && username.value.trim().length <= 50;
          break;
        case 'firstName':
          isValid.firstName.value = firstName.value.trim().length >= 1 && firstName.value.trim().length <= 50;
          break;
        case 'lastName':
          isValid.lastName.value = lastName.value.trim().length >= 1 && lastName.value.trim().length <= 50;
          break;
        case 'email':
          isValid.email.value = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
          break;
        case 'password':
          isValid.password.value = password.value.length >= 6;
          break;
        case 'confirmPassword':
          isValid.confirmPassword.value =
            password.value === confirmPassword.value && confirmPassword.value.trim() !== '';
          break;
      }
    };

    /**
     * Retourne la classe CSS de validation appropriée pour un champ.
     *
     * @param {String} field - Le nom du champ.
     * @returns {String} La classe CSS correspondant au statut de validation.
     */
    const validationClass = (field) => {
      if (!attemptedSubmit.value) return '';
      return isValid[field].value ? 'is-valid' : 'is-invalid';
    };

    return {
      username,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      errorMessage,
      handleSignup,
      attemptedSubmit,
      isValid,
      validateField,
      validationClass,
    };
  },
};
</script>

<style scoped></style>
