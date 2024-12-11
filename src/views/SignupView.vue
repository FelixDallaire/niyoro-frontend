<template>
  <div class="signup-view d-flex justify-content-center align-items-center min-vh-100">
    <SignupForm />
  </div>
</template>

<script>
import SignupForm from '../components/SignupForm.vue';

export default {
  name: 'SignupView',
  components: {
    SignupForm,
  },
};
</script>

<style scoped>
.signup-view {
  background-color: var(--primary-soft-white);
}
</style>