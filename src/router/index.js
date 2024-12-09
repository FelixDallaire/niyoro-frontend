import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useItemStore } from "@/stores/itemStore";

import SignupView from "@/views/SignupView.vue";
import LoginView from "@/views/LoginView.vue";
import HomeView from "@/views/HomeView.vue";
import AddItemView from "@/views/AddItemView.vue";
import ItemDetailView from "@/views/ItemDetailView.vue";
import ProfileView from "@/views/ProfileView.vue";
import TagsView from "@/views/TagsView.vue";

const routes = [
  { path: "/signup", name: "Signup", component: SignupView },
  { path: "/login", name: "Login", component: LoginView },
  { path: "/", name: "Home", component: HomeView },
  { path: "/add", name: "AddItem", component: AddItemView },
  { path: "/edit/:id", name: "EditItem", component: AddItemView, props: true },
  { path: "/item/:id", name: "ItemDetail", component: ItemDetailView, props: true },
  { path: "/profile/:id?", name: "Profile", component: ProfileView, props: true },
  { path: "/tags", name: "Tags", component: TagsView, meta: { requiresAdmin: true } },
];

async function checkItemOwnership(itemId, user, isAdmin, itemStore) {
  try {
    await itemStore.loadItem(itemId);
    const item = itemStore.selectedItem;

    if (!item) {
      throw new Error("L'élément est introuvable.");
    }

    const creatorId = item.created_by._id;
    console.log("User ID:", user.userId);
    console.log("Creator ID:", creatorId);

    if (creatorId !== user.userId && !isAdmin) {
      throw new Error("Accès non autorisé");
    }
  } catch (error) {
    console.error("[ERROR] Item Ownership Check:", error);
    throw error;
  }
}

async function checkProfileAccess(profileId, user) {
  if (!profileId) return true;

  try {
    const response = await fetch(`/api/users/${profileId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    if (!response.ok) throw new Error("Impossible de récupérer le profil.");
  } catch (error) {
    console.error("[ERROR] Profile Access Check:", error);
    throw error;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const itemStore = useItemStore();
  const user = authStore.user;
  const isAuthenticated = authStore.isAuthenticated;
  const isAdmin = authStore.isAdmin;

  try {
    if (to.matched.some((record) => record.meta.requiresAdmin) && !isAdmin) {
      alert("Accès interdit : réservé aux administrateurs.");
      return next({ name: "Home" });
    }

    if ((to.name === "Signup" || to.name === "Login") && isAuthenticated) {
      return next({ name: "Home" });
    }

    if (to.name === "EditItem") {
      const itemId = to.params.id;
      if (!itemId) throw new Error("L'ID de l'élément est manquant.");
      await checkItemOwnership(itemId, user, isAdmin, itemStore);
    }

    if (to.name === "Profile") {
      const profileId = to.params.id;
      if (profileId) await checkProfileAccess(profileId, user);
    }

    next();
  } catch (error) {
    console.error("[ERROR] Navigation Guard:", error.message);
    alert(error.message || "Accès refusé ou problème de chargement.");
    next({ name: "Home" });
  }
});

export default router;
