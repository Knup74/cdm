import { createRouter, createWebHistory } from 'vue-router';
import cdmLogin from '@/components/cdm-login.vue';
import cdmHome from '@/components/cdm-home.vue';
import cdmCoproprietaires from '@/components/cdm-coproprietaires.vue';
import cdmDepenses from '@/components/cdm-depenses.vue';
import AuthenticatedLayout from '@/components/cdm-layout.vue';

function decodeToken(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );

  return JSON.parse(jsonPayload);
}

const routes = [
  {
    path: '/login',
    name: 'cdm-login',
    component: cdmLogin,
  },
  {
    path: '/',
    component: AuthenticatedLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: 'home',
      },
      {
        path: 'home',
        name: 'cdm-home',
        component: cdmHome,
      },
      {
        path: '/admin/coproprietaires',
        name: 'cdm-coproprietaires',
        component: cdmCoproprietaires,
        meta: { requiresAdmin: true },
      },
      {
        path: '/admin/depenses',
        name: 'cdm-depenses',
        component: cdmDepenses,
        meta: { requiresAdmin: true },
      },
    ],
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route guard
router.beforeEach((to, from, next) => {
  console.log('Navigating to:', to.fullPath);
  
  const token = localStorage.getItem('jwt');
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (token) {
      try {
        const payload = decodeToken(token);
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
          console.log('Token expiré, redirection vers la page de login');
          localStorage.removeItem('jwt');
          next({ name: 'cdm-login' });
        } else {
          if (to.matched.some(record => record.meta.requiresAdmin) && payload.role !== 'administrateur') {
            console.log('Accès refusé : rôle administrateur requis');
            next({ name: 'cdm-home' });
          } else {
            next();
          }
        }
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        localStorage.removeItem('jwt');
        next({ name: 'cdm-login' });
      }
    } else {
      console.log('Aucun token trouvé, redirection vers la page de login');
      next({ name: 'cdm-login' });
    }
  } else {
    next();
  }
});

export default router;
