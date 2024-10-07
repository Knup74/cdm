import { createRouter, createWebHistory } from 'vue-router';
import cdmLogin from '@/components/cdm-login.vue';
import cdmHome from '@/components/cdm-home.vue';
import cdmProtected from '@/components/cdm-protected.vue';

const routes = [
  {
    path: '/login',
    name: 'cdm-login',
    component: cdmLogin,
  },
  {
    path: '/home',
    name: 'cdm-home',
    component: cdmHome,
    //meta: { requiresAuth: true },  // Indique que cette route nécessite une authentification
  },
  {
    path: '/protected',
    name: 'cdm-protected',
    component: cdmProtected,
    meta: { requiresAuth: true },  // Indique que cette route nécessite une authentification
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));  // Décoder le payload du JWT
    const isExpired = payload.exp * 1000 < Date.now();  // Vérifier si le token a expiré
    if (isExpired) {
      localStorage.removeItem('token');  // Supprimer le token expiré
      next({ name: 'cdm-login' });  // Rediriger vers la page de login
    } else {
      next();  // Le token est valide, autoriser l'accès
    }
  } else {
    next();  // Pas de token, autoriser l'accès à la page de login ou autres routes publiques
  }
});


export default router;
