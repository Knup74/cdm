<template>
  <div class="login-container d-flex justify-content-center align-items-center vh-100">
    <div class="login-box p-4 shadow-lg rounded">
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
        const response = await axios.post('http://localhost:3000/api/login', {
          email: this.email,
          password: this.password,
        });
        const token = response.data.token;
        localStorage.setItem('jwt', token); // Store JWT in local storage
        this.$router.push('/home'); // Navigate to protected route after login
      } catch (err) {
        this.error = 'Invalid username or password';
      }
    },
  },
};
</script>
