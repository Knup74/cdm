<template>
  <div>
    <h1>Protected Page</h1>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem('token');  // Supprime le token JWT du localStorage
      this.$router.push('/login');  // Redirige vers la page de login
    }
  }
};
</script>
