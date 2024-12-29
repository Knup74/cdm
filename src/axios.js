import axios from 'axios';

// Crée une instance d'axios
const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL, // Remplacez ceci si nécessaire
  });
  

// Ajouter un intercepteur pour inclure le token JWT dans chaque requête
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default axiosInstance;
