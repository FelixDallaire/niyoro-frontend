import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

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
  {
    path: "/add",
    name: "AddItem",
    component: AddItemView,
    meta: { requiresAuth: true },
  },
  {
    path: "/edit/:id",
    name: "EditItem",
    component: AddItemView,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/item/:permalink",
    name: "ItemDetail",
    component: ItemDetailView,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile/:id?",
    name: "Profile",
    component: ProfileView,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/tags",
    name: "Tags",
    component: TagsView,
    meta: { requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const isAdmin = authStore.isAdmin;

  if (to.matched.some((record) => record.meta.requiresAdmin) && !isAdmin) {
    alert("Accès interdit : réservé aux administrateurs.");
    return next({ name: "Home" });
  }

  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    alert("Veuillez vous connecter pour accéder à cette page.");
    return next({ name: "Login" });
  }

  if ((to.name === "Signup" || to.name === "Login") && isAuthenticated) {
    return next({ name: "Home" });
  }

  next();
});

export default router;
