<template>
    <div class="login-view d-flex justify-content-center align-items-center min-vh-100">
        <LoginForm />
    </div>
</template>

<script>
import LoginForm from '../components/LoginForm.vue';

export default {
    name: 'LoginView',
    components: {
        LoginForm,
    },
};
</script>

<style scoped>
.login-view {
    background-color: var(--primary-soft-white);
}
</style>
