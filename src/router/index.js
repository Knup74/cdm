import { createRouter, createWebHistory } from 'vue-router';
import cdmLogin from '@/components/cdm-login.vue';
import cdmHome from '@/components/cdm-home.vue';

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
    meta: { requiresAuth: true },  // Indique que cette route nécessite une authentification
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route guard
router.beforeEach((to, from, next) => {
  console.log('Navigating to:', to.fullPath);
  
  // Si la route nécessite une authentification
  if (to.matched.some(record => record.meta.requiresAuth)) {
    console.log('Cette route nécessite une authentification');
    const token = localStorage.getItem('jwt');
    
    if (token) {
      console.log('Token trouvé:', token);
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));  // Décoder le payload du JWT
        console.log('Payload décodé:', payload);
        const isExpired = payload.exp * 1000 < Date.now();  // Vérifier si le token a expiré
        console.log('Le token est-il expiré?', isExpired);
        
        if (isExpired) {
          console.log('Token expiré, redirection vers la page de login');
          localStorage.removeItem('token');  // Supprimer le token expiré
          next({ name: 'cdm-login' });  // Rediriger vers la page de login
        } else {
          console.log('Token valide, accès autorisé');
          next();  // Le token est valide, autoriser l'accès
        }
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        localStorage.removeItem('token');  // En cas d'erreur, supprimer le token
        next({ name: 'cdm-login' });
      }
    } else {
      console.log('Aucun token trouvé, redirection vers la page de login');
      // Si aucun token JWT n'est présent, rediriger vers la page de connexion
      next({ name: 'cdm-login' });  // Rediriger vers la page de login
    }
  } else {
    console.log('Cette route ne nécessite pas d\'authentification');
    next(); // Si la route n'a pas besoin d'authentification, continuer
  }
});



export default router;
