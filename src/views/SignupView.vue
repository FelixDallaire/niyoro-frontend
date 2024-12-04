<template>
    <div class="signup-view">
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
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: var(--primary-soft-white);
  }
  </style>  