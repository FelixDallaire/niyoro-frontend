import { createRouter, createWebHistory } from "vue-router";

import SignupView from "@/views/SignupView.vue";
import LoginView from "@/views/LoginView.vue";
import HomeView from "@/views/HomeView.vue";
import AddItemView from "@/views/AddItemView.vue";
import ItemDetailView from "@/views/ItemDetailView.vue";
import ProfileView from "@/views/ProfileView.vue";
import TagsView from "@/views/TagsView.vue";

const routes = [
  {
    path: "/signup",
    name: "Signup",
    component: SignupView,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/add",
    name: "AddItem",
    component: AddItemView,
  },
  {
    path: "/edit/:id",
    name: "EditItem",
    component: AddItemView,
    props: true,
  },
  {
    path: "/item/:id",
    name: "ItemDetail",
    component: ItemDetailView,
    props: true,
  },
  {
    path: "/profile/:id?",
    name: "Profile",
    component: ProfileView,
    props: true,
  },
  {
    path: "/tags",
    name: "Tags",
    component: TagsView,
    meta: { requiresAdmin: true },
  },
];

function getUser() {
  const token = localStorage.getItem("token");
  return token ? JSON.parse(localStorage.getItem("user")) : null;
}

async function checkItemOwnership(itemId, user, isAdmin) {
  try {
    const itemResponse = await fetch(`/api/items/${itemId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!itemResponse.ok) {
      throw new Error("Impossible de récupérer l'élément.");
    }

    const item = await itemResponse.json();

    if (item.created_by !== user._id && !isAdmin) {
      throw new Error("Accès non autorisé");
    }

    return true;
  } catch (error) {
    throw error;
  }
}

async function checkProfileAccess(profileId, user) {
  if (!profileId) {
    return true;
  }

  try {
    const profileResponse = await fetch(`/api/users/${profileId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!profileResponse.ok) {
      throw new Error("Impossible de récupérer le profil.");
    }

    return true;
  } catch (error) {
    console.error("[ERROR] Problème lors de l'accès au profil:", error);
    throw error;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const user = getUser();
  const isAuthenticated = !!user;
  const isAdmin = user?.is_admin;

  try {
    if (to.matched.some((record) => record.meta.requiresAdmin) && !isAdmin) {
      alert("Accès interdit : réservé aux administrateurs.");
      next({ name: "Home" });
    } else if (
      (to.name === "Signup" || to.name === "Login") &&
      isAuthenticated
    ) {
      next({ name: "Home" });
    } else if (to.name === "EditItem") {
      const itemId = to.params.id;
      await checkItemOwnership(itemId, user, isAdmin);
      next();
    } else if (to.name === "Profile") {
      const profileId = to.params.id;
      await checkProfileAccess(profileId, user);
      next();
    } else {
      next();
    }
  } catch (error) {
    alert("Accès refusé ou problème de chargement.");
    next({ name: "Home" });
  }
});

export default router;
