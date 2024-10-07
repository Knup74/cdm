<template>
  <img alt="Vue logo" src="../assets/logo.png">
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="text" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: null,
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
