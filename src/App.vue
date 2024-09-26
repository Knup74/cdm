<template>
  <div id="app">
    <router-view></router-view> <!-- Ici s'affichent les composants selon la route -->
  </div>
</template>

<script>
export default {
  created() {
    const isAuthenticated = !!localStorage.getItem('token');
    if (!isAuthenticated && this.$route.path !== '/login') {
      this.$router.push('/login');
    }
  }
};
</script>

<style lang="scss">
@import '@/assets/site.scss';  // Vérifie que le chemin est correct
</style>
