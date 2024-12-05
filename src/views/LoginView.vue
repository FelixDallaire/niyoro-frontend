<template>
    <div class="login-view">
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
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: var(--primary-soft-white);
}
</style>