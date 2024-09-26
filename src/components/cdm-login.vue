<template>
  <div class="login">
    <h2>Connexion</h2>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Mot de passe</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Se connecter</button>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/api/login', {
          email: this.email,
          password: this.password
        });

        // Si la connexion est réussie, rediriger vers la page d'accueil
        if (response.data.success) {
          this.$router.push('/home');
        } else {
          this.errorMessage = 'Email ou mot de passe incorrect';
        }
      } catch (error) {
        this.errorMessage = 'Erreur lors de la connexion';
      }
    }
  }
};
</script>
