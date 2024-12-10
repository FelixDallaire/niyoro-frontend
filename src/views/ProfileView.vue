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

        const loadProfile = async () => {
            try {
                loading.value = true;

                if (props.id) {
                    await userStore.loadUserById(props.id);
                    profile.value = userStore.selectedUser;
                } else {
                    await userStore.loadCurrentUser();
                    profile.value = userStore.currentUser;
                }

                if (profile.value) {
                    fullName.value = `${profile.value.first_name || ""} ${profile.value.last_name || ""}`.trim();

                    formattedDate.value = profile.value.createdAt
                        ? new Date(profile.value.createdAt).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })
                        : "Date inconnue";
                }
            } catch (err) {
                console.error("Impossible de charger le profil:", err);
                error.value = "Impossible de charger le profil.";
            } finally {
                loading.value = false;
            }
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
