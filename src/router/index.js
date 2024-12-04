import { createRouter, createWebHistory } from 'vue-router'

// Importation des vues nécessaires
import SignupView from '@/views/SignupView.vue'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import AddItemView from '@/views/AddItemView.vue'
import ItemDetailView from '@/views/ItemDetailView.vue'
import ProfileView from '@/views/ProfileView.vue'
import TagsView from '@/views/TagsView.vue'

const routes = [
  {
    path: '/signup',
    name: 'Signup',
    component: SignupView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/add',
    name: 'AddItem',
    component: AddItemView,
  },
  {
    path: '/item/:id',
    name: 'ItemDetail',
    component: ItemDetailView,
    props: true,
  },
  {
    path: '/profile/:id?',
    name: 'Profile',
    component: ProfileView,
    props: true,
  },
  {
    path: '/tags',
    name: 'Tags',
    component: TagsView,
    meta: { requiresAdmin: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const isAdmin = isAuthenticated && JSON.parse(localStorage.getItem('user')).is_admin;

  if (to.matched.some(record => record.meta.requiresAdmin) && !isAdmin) {
    next({ name: 'Home' });
  } else if ((to.name === 'Signup' || to.name === 'Login') && isAuthenticated) {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router
