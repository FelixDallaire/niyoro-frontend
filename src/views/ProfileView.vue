<template>
    <div class="profile-view container mt-4 w-25">
        <div class="card shadow-sm">
            <div class="card-header text-center">
                <img :src="profile?.avatar || defaultAvatar" alt="Avatar" class="rounded-circle mb-3 avatar border-5"
                    width="120" height="120" />
                <h3 class="mb-1">{{ profile?.username || "Utilisateur inconnu" }}</h3>
                <p class="text-muted mb-0">{{ fullName }}</p>
            </div>
            <div class="card-body">
                <ul class="list-group list-group-flush rounded">
                    <li class="list-group-item">
                        <strong>Date d'inscription: </strong>
                        <span>{{ formattedDate }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="loading" class="text-center mt-3">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Chargement...</span>
            </div>
        </div>
        <div v-else-if="error" class="alert alert-danger mt-3">
            {{ error }}
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";

export default {
    name: "ProfileView",
    props: {
        id: {
            type: String,
            default: null,
        },
    },
    setup(props) {
        const userStore = useUserStore();
        const profile = ref(null);
        const defaultAvatar = "https://via.placeholder.com/120?text=Avatar";
        const fullName = ref("");
        const formattedDate = ref("");
        const loading = ref(false);
        const error = ref(null);

        /**
         * Loads the user profile based on the provided ID or the current user.
         */
        const loadProfile = async () => {
            try {
                loading.value = true;
                const user = props.id
                    ? await loadUserById(props.id)
                    : await loadCurrentUser();
                profile.value = user;
                updateProfileDetails(user);
            } catch (err) {
                handleLoadError(err);
            } finally {
                loading.value = false;
            }
        };

        /**
         * Loads a user by their ID from the store.
         * 
         * @param {String} userId - The ID of the user to load.
         * @returns {Object} The loaded user profile.
         */
        const loadUserById = async (userId) => {
            await userStore.loadUserById(userId);
            return userStore.selectedUser;
        };

        /**
         * Loads the current user profile from the store.
         * 
         * @returns {Object} The current user's profile.
         */
        const loadCurrentUser = async () => {
            await userStore.loadCurrentUser();
            return userStore.currentUser;
        };

        /**
         * Updates the local details such as full name and formatted date based on the user profile.
         * 
         * @param {Object} user - The user profile object.
         */
        const updateProfileDetails = (user) => {
            if (user) {
                fullName.value = `${user.first_name || ""} ${user.last_name || ""}`.trim();
                formattedDate.value = user.createdAt
                    ? formatDate(user.createdAt)
                    : "Date inconnue";
            }
        };

        /**
         * Formats a date string to a localized French format.
         * 
         * @param {String} dateString - The date string to format.
         * @returns {String} The formatted date.
         */
        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            });
        };

        /**
         * Handles errors during the profile loading process.
         * 
         * @param {Error} err - The error object.
         */
        const handleLoadError = (err) => {
            console.error("Impossible de charger le profil:", err);
            error.value = "Impossible de charger le profil.";
        };

        onMounted(loadProfile);

        return {
            profile,
            fullName,
            formattedDate,
            defaultAvatar,
            loading,
            error,
        };
    },
};
</script>

<style scoped></style>
