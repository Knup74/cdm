<template>
  <div class="login-container d-flex justify-content-center align-items-center vh-100">
    <div class="login-box p-4 shadow-lg rounded">
      <!-- Ajout du logo -->
      <img src="@/assets/logo.jpg" alt="Logo Copro des Moulins" class="logo mb-3">
      
      <h2 class="text-center mb-4">Connexion</h2>
      
      <form @submit.prevent="login">
        <div class="form-group mb-3">
          <label for="email" class="form-label">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            class="form-control" 
            placeholder="Entrez votre email" 
            required 
          />
        </div>
        
        <div class="form-group mb-4">
          <label for="password" class="form-label">Mot de passe</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            class="form-control" 
            placeholder="Entrez votre mot de passe" 
            required 
          />
        </div>
        
        <div class="text-center">
          <button type="submit" class="btn btn-primary w-100">Se connecter</button>
        </div>
        
        <div v-if="errorMessage" class="alert alert-danger mt-3">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: null,
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/login`, {
          email: this.email,
          password: this.password,
        });
        const token = response.data.token;
        localStorage.setItem('jwt', token); // Stockage du JWT dans localStorage
        this.$router.push('/home'); // Redirection vers la page d'accueil après connexion
      } catch (err) {
        this.errorMessage = 'Email ou mot de passe invalide';
      }
    },
  },
};
</script>

<style scoped lang="scss">
  @import "@/assets/login.scss";
</style>
