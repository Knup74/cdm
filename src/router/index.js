import { createRouter, createWebHistory } from 'vue-router';
import CdmLogin from '@/components/cdm-login.vue';  // Import de cdm-login.js
import CdmHome from '@/components/cdm-home.vue';    // Import de cdm-home.js
import CoproprietairesListe from '@/components/coproprietaires-liste.vue'; // Assurez-vous que le chemin est correct
const jwt = require('jsonwebtoken');

const routes = [
  {
    path: '/',
    redirect: '/login'  // Redirige vers la page de login par défaut
  },
  {
    path: '/login',
    name: 'Login',
    component: CdmLogin  // Utilise cdm-login.js pour la route login
  },
  {
    path: '/home',
    name: 'Home',
    component: CdmHome  // Utilise cdm-home.js pour la route home
  },
  {
    path: '/bdd',
    name: 'Bdd',
    component: {
      template: '<router-view></router-view>' // Un conteneur pour les sous-routes
    },
    children: [
      {
        path: 'coproprietaires/liste',
        name: 'CoproprietairesListe',
        component: CoproprietairesListe
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
