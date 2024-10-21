import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/site.scss'; // Import du fichier SCSS

createApp(App).use(router).mount('#app');
